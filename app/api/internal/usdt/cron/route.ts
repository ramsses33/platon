import {
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  POST as scanDepositsRoute,
} from "@/app/api/internal/usdt/deposits/scan/route";

import {
  POST as processSweepsRoute,
} from "@/app/api/internal/usdt/sweeps/process/route";

import {
  POST as processWithdrawalsRoute,
} from "@/app/api/internal/usdt/withdrawals/process/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StageResult = {
  success: boolean;
  status: number;
  data?: unknown;
  error?: string;
};

type AcquireLockResult = {
  success?: boolean;
  acquired?: boolean;
  jobName?: string;
  lockedUntil?: string;
};

type ReleaseLockResult = {
  success?: boolean;
  released?: boolean;
  jobName?: string;
};

const USDT_CRON_JOB_NAME =
  "usdt.cron";

const USDT_CRON_LOCK_LEASE_SECONDS =
  900;

function getUsdtProcessingSecret() {
  const secret =
    process.env
      .USDT_DEPOSIT_SCAN_SECRET
      ?.trim();

  if (!secret) {
    throw new Error(
      "USDT_DEPOSIT_SCAN_SECRET is not configured."
    );
  }

  return secret;
}

function getVercelCronSecret() {
  const secret =
    process.env
      .CRON_SECRET
      ?.trim();

  if (!secret) {
    throw new Error(
      "CRON_SECRET is not configured."
    );
  }

  return secret;
}

function getSupabaseUrl() {
  const value =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  if (!value) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not configured."
    );
  }

  return value;
}

function getServiceRoleKey() {
  const value =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (!value) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured."
    );
  }

  return value;
}

function getAdminClient() {
  return createClient(
    getSupabaseUrl(),
    getServiceRoleKey(),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

function getBearerToken(
  request: NextRequest
) {
  const authorization =
    request.headers
      .get("authorization")
      ?.trim();

  if (!authorization) {
    return null;
  }

  const match =
    authorization.match(
      /^Bearer\s+(.+)$/i
    );

  return (
    match?.[1]?.trim() ??
    null
  );
}

function secretsMatch(
  providedSecret: string,
  configuredSecret: string
) {
  const providedBuffer =
    Buffer.from(
      providedSecret,
      "utf8"
    );

  const configuredBuffer =
    Buffer.from(
      configuredSecret,
      "utf8"
    );

  if (
    providedBuffer.length !==
    configuredBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    providedBuffer,
    configuredBuffer
  );
}

function getRequestSecret(
  request: NextRequest
) {
  /*
   * Vercel Cron вызывает маршрут
   * через GET и использует
   * отдельный CRON_SECRET.
   *
   * Локальный Cron использует
   * POST и старый внутренний
   * USDT_DEPOSIT_SCAN_SECRET.
   */
  if (request.method === "GET") {
    return getVercelCronSecret();
  }

  return getUsdtProcessingSecret();
}

function createInternalStageRequest(
  request: NextRequest
) {
  /*
   * Внутренние маршруты депозита,
   * sweep и withdrawal защищены
   * USDT_DEPOSIT_SCAN_SECRET.
   */
  return new NextRequest(
    request.url,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${getUsdtProcessingSecret()}`,
      },
    }
  );
}

function isObject(
  value: unknown
): value is Record<
  string,
  unknown
> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function hasFailedResult(
  value: unknown
) {
  return (
    isObject(value) &&
    value.success === false
  );
}

function getResultError(
  value: unknown
) {
  if (!isObject(value)) {
    return null;
  }

  if (
    typeof value.error === "string" &&
    value.error.trim()
  ) {
    return value.error.trim();
  }

  return null;
}

async function acquireCronLock(
  lockToken: string
) {
  const adminClient =
    getAdminClient();

  const {
    data,
    error,
  } = await adminClient.rpc(
    "acquire_system_job_lock",
    {
      p_job_name:
        USDT_CRON_JOB_NAME,

      p_lock_token:
        lockToken,

      p_lease_seconds:
        USDT_CRON_LOCK_LEASE_SECONDS,
    }
  );

  if (error) {
    throw new Error(
      `Unable to acquire USDT Cron lock: ${error.message}`
    );
  }

  const result =
    data as
      | AcquireLockResult
      | null;

  if (
    result?.success !== true
  ) {
    throw new Error(
      "USDT Cron lock request was not completed."
    );
  }

  return result;
}

async function releaseCronLock(
  lockToken: string
) {
  const adminClient =
    getAdminClient();

  const {
    data,
    error,
  } = await adminClient.rpc(
    "release_system_job_lock",
    {
      p_job_name:
        USDT_CRON_JOB_NAME,

      p_lock_token:
        lockToken,
    }
  );

  if (error) {
    throw new Error(
      `Unable to release USDT Cron lock: ${error.message}`
    );
  }

  const result =
    data as
      | ReleaseLockResult
      | null;

  if (
    result?.success !== true
  ) {
    throw new Error(
      "USDT Cron lock release was not completed."
    );
  }

  return result;
}

async function runStage(
  task: () => Promise<Response>
): Promise<StageResult> {
  try {
    const response =
      await task();

    let data: unknown =
      null;

    try {
      data =
        await response.json();
    } catch {
      data =
        null;
    }

    const success =
      response.ok &&
      !hasFailedResult(data);

    return {
      success,
      status: response.status,
      data,

      ...(
        success
          ? {}
          : {
              error:
                getResultError(data) ??
                `USDT stage failed with status ${response.status}.`,
            }
      ),
    };
  } catch (error) {
    return {
      success: false,
      status: 500,

      error:
        error instanceof Error
          ? error.message
          : "Unknown USDT processing error.",
    };
  }
}

async function handleCron(
  request: NextRequest
) {
  const startedAt =
    new Date();

  const lockToken =
    randomUUID();

  let lockAcquired =
    false;

  try {
    const configuredSecret =
      getRequestSecret(request);

    const providedSecret =
      getBearerToken(request);

    if (
      !providedSecret ||
      !secretsMatch(
        providedSecret,
        configuredSecret
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const lock =
      await acquireCronLock(
        lockToken
      );

    if (
      lock.acquired !== true
    ) {
      return NextResponse.json(
        {
          success: true,
          skipped: true,

          reason:
            "USDT Cron is already running.",

          jobName:
            USDT_CRON_JOB_NAME,

          lockedUntil:
            lock.lockedUntil ??
            null,

          startedAt:
            startedAt.toISOString(),

          finishedAt:
            new Date().toISOString(),
        },
        {
          status: 200,
        }
      );
    }

    lockAcquired =
      true;

    const deposits =
      await runStage(
        async () => {
          const internalRequest =
            createInternalStageRequest(
              request
            );

          return await scanDepositsRoute(
            internalRequest
          );
        }
      );

    const sweeps =
      await runStage(
        async () => {
          const internalRequest =
            createInternalStageRequest(
              request
            );

          return await processSweepsRoute(
            internalRequest
          );
        }
      );

    const withdrawals =
      await runStage(
        async () => {
          const internalRequest =
            createInternalStageRequest(
              request
            );

          return await processWithdrawalsRoute(
            internalRequest
          );
        }
      );

    const success =
      deposits.success &&
      sweeps.success &&
      withdrawals.success;

    const finishedAt =
      new Date();

    return NextResponse.json(
      {
        success,
        skipped: false,

        jobName:
          USDT_CRON_JOB_NAME,

        startedAt:
          startedAt.toISOString(),

        finishedAt:
          finishedAt.toISOString(),

        durationMs:
          finishedAt.getTime() -
          startedAt.getTime(),

        stages: {
          deposits,
          sweeps,
          withdrawals,
        },
      },
      {
        status:
          success
            ? 200
            : 500,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "USDT Cron processing failed.",
      },
      {
        status: 500,
      }
    );
  } finally {
    if (lockAcquired) {
      try {
        await releaseCronLock(
          lockToken
        );
      } catch (error) {
        console.error(
          "Unable to release USDT Cron lock:",
          error
        );
      }
    }
  }
}

export async function GET(
  request: NextRequest
) {
  return handleCron(request);
}

export async function POST(
  request: NextRequest
) {
  return handleCron(request);
}