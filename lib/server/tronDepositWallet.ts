import "server-only";

import { TronWeb } from "tronweb";

export type TronDepositNetwork =
  | "SHASTA"
  | "MAINNET";

export type TronDepositWallet = {
  address: string;
  privateKey: string;
  derivationIndex: number;
  derivationPath: string;
};

const MAX_DERIVATION_INDEX =
  2_147_483_647;

function getDepositMnemonic() {
  const mnemonic =
    process.env
      .TRON_DEPOSIT_MNEMONIC
      ?.trim()
      .replace(
        /\s+/g,
        " "
      );

  if (!mnemonic) {
    throw new Error(
      "TRON_DEPOSIT_MNEMONIC is not configured."
    );
  }

  return mnemonic;
}

function getMnemonicPassword() {
  return (
    process.env
      .TRON_DEPOSIT_MNEMONIC_PASSWORD ??
    ""
  );
}

function validateDerivationIndex(
  derivationIndex: number
) {
  if (
    !Number.isSafeInteger(
      derivationIndex
    ) ||
    derivationIndex < 0 ||
    derivationIndex >
      MAX_DERIVATION_INDEX
  ) {
    throw new Error(
      "Invalid TRON derivation index."
    );
  }
}

export function deriveTronDepositWallet(
  derivationIndex: number
): TronDepositWallet {
  validateDerivationIndex(
    derivationIndex
  );

  const mnemonic =
    getDepositMnemonic();

  const password =
    getMnemonicPassword();

  const derivationPath =
    `m/44'/195'/0'/0/${derivationIndex}`;

  const account =
    TronWeb.fromMnemonic(
      mnemonic,
      derivationPath,
      password
    );

  const address =
    account.address;

  const privateKey =
    account.privateKey.replace(
      /^0x/i,
      ""
    );

  if (
    !TronWeb.isAddress(
      address
    )
  ) {
    throw new Error(
      "Generated TRON address is invalid."
    );
  }

  if (
    !/^[0-9a-fA-F]{64}$/.test(
      privateKey
    )
  ) {
    throw new Error(
      "Generated TRON private key is invalid."
    );
  }

  return {
    address,
    privateKey,
    derivationIndex,
    derivationPath,
  };
}