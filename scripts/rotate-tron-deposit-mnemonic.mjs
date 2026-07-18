import {
  chmod,
  readFile,
  rename,
  unlink,
  writeFile,
} from "node:fs/promises";

import path from "node:path";

import {
  TronWeb,
} from "tronweb";

process.umask(
  0o077
);

const projectDirectory =
  process.cwd();

const environmentPath =
  path.join(
    projectDirectory,
    ".env.local"
  );

const temporaryPath =
  path.join(
    projectDirectory,
    ".env.local.rotation.tmp"
  );

function readCurrentMnemonic(
  environmentContent
) {
  const match =
    environmentContent.match(
      /^TRON_DEPOSIT_MNEMONIC=(?:"([^"]*)"|'([^']*)'|(.*))$/m
    );

  if (
    !match
  ) {
    throw new Error(
      "TRON_DEPOSIT_MNEMONIC was not found in .env.local."
    );
  }

  return (
    match[1] ??
    match[2] ??
    match[3] ??
    ""
  ).trim();
}

async function removeTemporaryFile() {
  try {
    await unlink(
      temporaryPath
    );
  } catch (
    error
  ) {
    if (
      error?.code !==
      "ENOENT"
    ) {
      throw error;
    }
  }
}

async function main() {
  const environmentContent =
    await readFile(
      environmentPath,
      "utf8"
    );

  const currentMnemonic =
    readCurrentMnemonic(
      environmentContent
    );

  const account =
    TronWeb.createRandom();

  const newMnemonic =
    account
      .mnemonic
      ?.phrase
      ?.trim();

  if (
    !newMnemonic ||
    newMnemonic
      .split(
        /\s+/
      )
      .length !==
      12
  ) {
    throw new Error(
      "TronWeb did not generate a valid 12-word mnemonic."
    );
  }

  if (
    newMnemonic ===
    currentMnemonic
  ) {
    throw new Error(
      "The generated mnemonic matches the previous mnemonic."
    );
  }

  const replacementLine =
    `TRON_DEPOSIT_MNEMONIC="${newMnemonic}"`;

  const updatedEnvironmentContent =
    environmentContent.replace(
      /^TRON_DEPOSIT_MNEMONIC=.*$/m,
      replacementLine
    );

  await removeTemporaryFile();

  await writeFile(
    temporaryPath,
    updatedEnvironmentContent,
    {
      encoding:
        "utf8",

      mode:
        0o600,

      flag:
        "wx",
    }
  );

  await rename(
    temporaryPath,
    environmentPath
  );

  await chmod(
    environmentPath,
    0o600
  );

  console.log(
    "SUCCESS: TRON deposit mnemonic was rotated securely."
  );

  console.log(
    "The new mnemonic was saved to .env.local and was not printed."
  );

  console.log(
    "Do not start the USDT Cron until the deposit addresses are rotated."
  );
}

main().catch(
  async (
    error
  ) => {
    try {
      await removeTemporaryFile();
    } catch {
      // Nothing else should be printed.
    }

    console.error(
      error instanceof Error
        ? error.message
        : "TRON mnemonic rotation failed."
    );

    process.exit(
      1
    );
  }
);