import fs from "node:fs";
import path from "node:path";

import { TronWeb } from "tronweb";

const PROJECT_ROOT =
  process.cwd();

const ENV_FILE =
  path.join(
    PROJECT_ROOT,
    ".env.local"
  );

function setEnvValue(
  content,
  key,
  value
) {
  const line =
    `${key}="${value}"`;

  const pattern =
    new RegExp(
      `^${key}=.*$`,
      "m"
    );

  if (
    pattern.test(
      content
    )
  ) {
    return content.replace(
      pattern,
      line
    );
  }

  const separator =
    content.length > 0 &&
    !content.endsWith("\n")
      ? "\n"
      : "";

  return (
    `${content}${separator}${line}\n`
  );
}

function hasEnvValue(
  content,
  key
) {
  const pattern =
    new RegExp(
      `^${key}=(?:"[^"]+"|'.+'|[^\\s]+)$`,
      "m"
    );

  return pattern.test(
    content
  );
}

async function main() {
  if (
    !fs.existsSync(
      ENV_FILE
    )
  ) {
    throw new Error(
      ".env.local was not found."
    );
  }

  const currentEnv =
    fs.readFileSync(
      ENV_FILE,
      "utf8"
    );

  if (
    hasEnvValue(
      currentEnv,
      "TRON_TEST_RECIPIENT_PRIVATE_KEY"
    )
  ) {
    throw new Error(
      "Test recipient already exists and was not replaced."
    );
  }

  const tronWeb =
    new TronWeb({
      fullHost:
        "https://api.shasta.trongrid.io",
    });

  const account =
    await tronWeb.createAccount();

  const address =
    account.address
      .base58
      .trim();

  const privateKey =
    account.privateKey
      .trim();

  if (
    !TronWeb.isAddress(
      address
    )
  ) {
    throw new Error(
      "Generated address is invalid."
    );
  }

  if (
    !/^[0-9a-fA-F]{64}$/.test(
      privateKey
    )
  ) {
    throw new Error(
      "Generated private key is invalid."
    );
  }

  const backupFile =
    `${ENV_FILE}.backup-${Date.now()}`;

  fs.copyFileSync(
    ENV_FILE,
    backupFile
  );

  let updatedEnv =
    currentEnv;

  updatedEnv =
    setEnvValue(
      updatedEnv,
      "TRON_TEST_RECIPIENT_ADDRESS",
      address
    );

  updatedEnv =
    setEnvValue(
      updatedEnv,
      "TRON_TEST_RECIPIENT_PRIVATE_KEY",
      privateKey
    );

  fs.writeFileSync(
    ENV_FILE,
    updatedEnv,
    {
      encoding:
        "utf8",

      mode:
        0o600,
    }
  );

  fs.chmodSync(
    ENV_FILE,
    0o600
  );

  console.log("");
  console.log(
    "SHASTA test recipient created successfully."
  );

  console.log("");
  console.log(
    `Public address: ${address}`
  );

  console.log("");
  console.log(
    "Private key was saved only to .env.local."
  );

  console.log(
    "The private key was not printed."
  );

  console.log("");
  console.log(
    `Backup created: ${path.basename(
      backupFile
    )}`
  );
}

main().catch(
  (
    error
  ) => {
    console.error("");

    console.error(
      "Test recipient creation failed:"
    );

    console.error(
      error instanceof Error
        ? error.message
        : error
    );

    process.exit(
      1
    );
  }
);