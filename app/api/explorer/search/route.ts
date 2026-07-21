import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUERY_LENGTH = 128;
const WALLET_TRANSACTIONS_LIMIT = 20;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const BLOCK_HASH_PATTERN =
  /^[0-9a-f]{64}$/i;

const BLOCK_NUMBER_PATTERN =
  /^\d+$/;

type ExplorerTransaction = {
  id: string;
  sender_wallet: string | null;
  receiver_wallet: string;
  amount: number;
  type: string;
  status: string;
  created_at: string;
  block_number: number;
};

function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not configured.",
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured.",
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

const transactionFields = `
  id,
  sender_wallet,
  receiver_wallet,
  amount,
  type,
  status,
  created_at,
  block_number
`;

const blockFields = `
  block_number,
  block_hash,
  previous_hash,
  validator,
  transaction_count,
  confirmed_at
`;

export async function GET(
  request: NextRequest,
) {
  const normalizedQuery =
    request.nextUrl.searchParams
      .get("q")
      ?.trim() ?? "";

  if (!normalizedQuery) {
    return NextResponse.json(
      {
        success: false,
        error: "Search query is required.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    normalizedQuery.length >
    MAX_QUERY_LENGTH
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Search query is too long.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const supabase = getAdminClient();

    if (
      BLOCK_NUMBER_PATTERN.test(
        normalizedQuery,
      )
    ) {
      const blockNumber =
        Number(normalizedQuery);

      if (
        Number.isSafeInteger(
          blockNumber,
        ) &&
        blockNumber > 0
      ) {
        const {
          data: block,
          error: blockError,
        } = await supabase
          .from("network_blocks")
          .select(blockFields)
          .eq(
            "block_number",
            blockNumber,
          )
          .maybeSingle();

        if (blockError) {
          throw blockError;
        }

        if (block) {
          const {
            data: transactions,
            error:
              transactionsError,
          } = await supabase
            .from("transactions")
            .select(
              transactionFields,
            )
            .eq(
              "block_number",
              blockNumber,
            )
            .order("created_at", {
              ascending: false,
            });

          if (transactionsError) {
            throw transactionsError;
          }

          return NextResponse.json(
            {
              success: true,
              query: normalizedQuery,
              result: {
                type: "block",
                block,
                transactions:
                  transactions ?? [],
              },
            },
            {
              headers: {
                "Cache-Control":
                  "no-store, max-age=0",
              },
            },
          );
        }
      }
    }

    if (
      BLOCK_HASH_PATTERN.test(
        normalizedQuery,
      )
    ) {
      const {
        data: block,
        error: blockError,
      } = await supabase
        .from("network_blocks")
        .select(blockFields)
        .eq(
          "block_hash",
          normalizedQuery.toLowerCase(),
        )
        .maybeSingle();

      if (blockError) {
        throw blockError;
      }

      if (block) {
        const {
          data: transactions,
          error:
            transactionsError,
        } = await supabase
          .from("transactions")
          .select(transactionFields)
          .eq(
            "block_number",
            block.block_number,
          )
          .order("created_at", {
            ascending: false,
          });

        if (transactionsError) {
          throw transactionsError;
        }

        return NextResponse.json(
          {
            success: true,
            query: normalizedQuery,
            result: {
              type: "block",
              block,
              transactions:
                transactions ?? [],
            },
          },
          {
            headers: {
              "Cache-Control":
                "no-store, max-age=0",
            },
          },
        );
      }
    }

    if (
      UUID_PATTERN.test(
        normalizedQuery,
      )
    ) {
      const {
        data: transaction,
        error: transactionError,
      } = await supabase
        .from("transactions")
        .select(transactionFields)
        .eq("id", normalizedQuery)
        .maybeSingle();

      if (transactionError) {
        throw transactionError;
      }

      if (transaction) {
        const {
          data: block,
          error: blockError,
        } = await supabase
          .from("network_blocks")
          .select(blockFields)
          .eq(
            "block_number",
            transaction.block_number,
          )
          .maybeSingle();

        if (blockError) {
          throw blockError;
        }

        return NextResponse.json(
          {
            success: true,
            query: normalizedQuery,
            result: {
              type: "transaction",
              transaction,
              block,
            },
          },
          {
            headers: {
              "Cache-Control":
                "no-store, max-age=0",
            },
          },
        );
      }
    }

    const [
      sentResult,
      receivedResult,
    ] = await Promise.all([
      supabase
        .from("transactions")
        .select(transactionFields)
        .eq(
          "sender_wallet",
          normalizedQuery,
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(
          WALLET_TRANSACTIONS_LIMIT,
        ),

      supabase
        .from("transactions")
        .select(transactionFields)
        .eq(
          "receiver_wallet",
          normalizedQuery,
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(
          WALLET_TRANSACTIONS_LIMIT,
        ),
    ]);

    if (sentResult.error) {
      throw sentResult.error;
    }

    if (receivedResult.error) {
      throw receivedResult.error;
    }

    const transactionsById =
      new Map<
        string,
        ExplorerTransaction
      >();

    for (const transaction of [
      ...(sentResult.data ?? []),
      ...(receivedResult.data ?? []),
    ] as ExplorerTransaction[]) {
      transactionsById.set(
        transaction.id,
        transaction,
      );
    }

    const walletTransactions =
      Array.from(
        transactionsById.values(),
      )
        .sort(
          (first, second) =>
            new Date(
              second.created_at,
            ).getTime() -
            new Date(
              first.created_at,
            ).getTime(),
        )
        .slice(
          0,
          WALLET_TRANSACTIONS_LIMIT,
        );

    if (
      walletTransactions.length > 0
    ) {
      return NextResponse.json(
        {
          success: true,
          query: normalizedQuery,
          result: {
            type: "wallet",
            walletAddress:
              normalizedQuery,
            transactions:
              walletTransactions,
          },
        },
        {
          headers: {
            "Cache-Control":
              "no-store, max-age=0",
          },
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        query: normalizedQuery,
        result: {
          type: "not_found",
        },
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "Explorer search API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to search the PLATON Network.",
      },
      {
        status: 500,
      },
    );
  }
}
