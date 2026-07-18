"use client";

import {
  Camera,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  QrCode,
  ScanLine,
  X,
} from "lucide-react";

import {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import toast from "react-hot-toast";

import Button from "@/components/ui/Button";

const SCANNER_ELEMENT_ID = "platon-pay-qr-reader";

type ScannerConfig = {
  fps?: number;

  qrbox?:
    | number
    | ((
        viewfinderWidth: number,
        viewfinderHeight: number
      ) => {
        width: number;
        height: number;
      });

  aspectRatio?: number;

  disableFlip?: boolean;
};

type CameraConfig = {
  facingMode:
    | "user"
    | "environment"
    | {
        exact: "user" | "environment";
      };
};

type ScannerInstance = {
  start(
    cameraIdOrConfig: string | CameraConfig,
    configuration: ScannerConfig,
    successCallback: (
      decodedText: string
    ) => void,
    errorCallback?: (
      errorMessage: string
    ) => void
  ): Promise<unknown>;

  stop(): Promise<void>;

  clear(): void;

  scanFile(
    imageFile: File,
    showImage?: boolean
  ): Promise<string>;
};

export default function QRScanner() {
  const [scannerOpen, setScannerOpen] =
    useState(false);

  const [starting, setStarting] =
    useState(false);

  const [scanning, setScanning] =
    useState(false);

  const [readingImage, setReadingImage] =
    useState(false);

  const [scannedValue, setScannedValue] =
    useState("");

  const [error, setError] =
    useState("");

  const scannerRef =
    useRef<ScannerInstance | null>(null);

  const scannerRunningRef =
    useRef(false);

  const resultHandledRef =
    useRef(false);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const stopScanner =
    useCallback(async () => {
      const scanner =
        scannerRef.current;

      if (!scanner) {
        scannerRunningRef.current =
          false;

        setScanning(false);

        setStarting(false);

        return;
      }

      if (
        scannerRunningRef.current
      ) {
        try {
          await scanner.stop();
        } catch (stopError) {
          console.error(
            "Unable to stop QR scanner:",
            stopError
          );
        }
      }

      scannerRunningRef.current =
        false;

      try {
        scanner.clear();
      } catch (clearError) {
        console.error(
          "Unable to clear QR scanner:",
          clearError
        );
      }

      scannerRef.current = null;

      setScanning(false);

      setStarting(false);
    }, []);

  const handleScanResult =
    useCallback(
      async (value: string) => {
        const normalizedValue =
          value.trim();

        if (
          !normalizedValue ||
          resultHandledRef.current
        ) {
          return;
        }

        resultHandledRef.current =
          true;

        setScannedValue(
          normalizedValue
        );

        setError("");

        await stopScanner();

        toast.success(
          "PLATON payment QR scanned."
        );
      },
      [stopScanner]
    );

  const startScanner =
    useCallback(async () => {
      setError("");

      setScannedValue("");

      resultHandledRef.current =
        false;

      await stopScanner();

      setStarting(true);

      try {
        const {
          Html5Qrcode,
          Html5QrcodeSupportedFormats,
        } = await import(
          "html5-qrcode"
        );

        const scanner =
          new Html5Qrcode(
            SCANNER_ELEMENT_ID,
            {
              formatsToSupport: [
                Html5QrcodeSupportedFormats.QR_CODE,
              ],

              verbose: false,
            }
          ) as ScannerInstance;

        scannerRef.current =
          scanner;

        await scanner.start(
          {
            facingMode:
              "environment",
          },

          {
            fps: 10,

            aspectRatio: 1,

            disableFlip: false,

            qrbox: (
              width,
              height
            ) => {
              const size =
                Math.floor(
                  Math.min(
                    width,
                    height
                  ) * 0.72
                );

              return {
                width: size,
                height: size,
              };
            },
          },

          (decodedText) => {
            void handleScanResult(
              decodedText
            );
          },

          () => {
            // QR code has not been detected yet.
          }
        );

        scannerRunningRef.current =
          true;

        setScanning(true);

        setStarting(false);
      } catch (scannerError) {
        console.error(
          "Unable to start QR scanner:",
          scannerError
        );

        scannerRunningRef.current =
          false;

        setScanning(false);

        setStarting(false);

        const message =
          scannerError instanceof
          Error
            ? scannerError.message
            : String(
                scannerError
              );

        const normalizedMessage =
          message.toLowerCase();

        if (
          normalizedMessage.includes(
            "permission"
          ) ||
          normalizedMessage.includes(
            "notallowed"
          ) ||
          normalizedMessage.includes(
            "denied"
          )
        ) {
          setError(
            "Camera access was denied. Allow camera access in Safari settings and try again."
          );

          toast.error(
            "Camera access was denied."
          );

          return;
        }

        setError(
          "Unable to start the camera. You can upload a QR image instead."
        );

        toast.error(
          "Unable to open the camera."
        );
      }
    }, [
      handleScanResult,
      stopScanner,
    ]);

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setReadingImage(true);

    setError("");

    setScannedValue("");

    resultHandledRef.current =
      false;

    await stopScanner();

    try {
      const {
        Html5Qrcode,
        Html5QrcodeSupportedFormats,
      } = await import(
        "html5-qrcode"
      );

      const scanner =
        new Html5Qrcode(
          SCANNER_ELEMENT_ID,
          {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
            ],

            verbose: false,
          }
        ) as ScannerInstance;

      scannerRef.current =
        scanner;

      const decodedValue =
        await scanner.scanFile(
          file,
          false
        );

      await handleScanResult(
        decodedValue
      );
    } catch (imageError) {
      console.error(
        "Unable to scan QR image:",
        imageError
      );

      setError(
        "QR code was not found in this image."
      );

      toast.error(
        "QR code was not found."
      );

      try {
        scannerRef.current?.clear();
      } catch {
        // Scanner is already empty.
      }

      scannerRef.current = null;
    } finally {
      setReadingImage(false);
    }
  }

  const closeScanner =
    useCallback(async () => {
      await stopScanner();

      setScannerOpen(false);

      setScannedValue("");

      setError("");

      setReadingImage(false);

      resultHandledRef.current =
        false;
    }, [stopScanner]);

  function openScanner() {
    setScannerOpen(true);

    setScannedValue("");

    setError("");

    resultHandledRef.current =
      false;
  }

  function useScannedPayment() {
    if (!scannedValue) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        "platon-payment-qr-scanned",
        {
          detail: {
            value:
              scannedValue,
          },
        }
      )
    );

    void closeScanner();
  }

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
          "Escape" &&
        scannerOpen
      ) {
        void closeScanner();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    scannerOpen,
    closeScanner,
  ]);

  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, [stopScanner]);

  return (
    <>
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-400/[0.08] blur-[90px]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
                QR Payment
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">
                Scan & Pay
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Scan a PLATON
                merchant QR code to
                create a secure
                payment.
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
              <QrCode size={22} />
            </div>
          </div>

          <div className="mt-8 flex min-h-[240px] items-center justify-center rounded-[26px] border border-dashed border-white/10 bg-black/20">
            <div className="px-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                <ScanLine
                  size={30}
                />
              </div>

              <p className="mt-4 font-black text-white">
                QR Scanner
              </p>

              <p className="mt-2 text-sm leading-6 text-white/30">
                Use your camera or
                upload an image with a
                PLATON payment QR
                code.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="secondary"
              onClick={openScanner}
            >
              <Camera size={18} />

              <span className="ml-2">
                Open Scanner
              </span>
            </Button>
          </div>
        </div>
      </section>

      {scannerOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl">
          <div className="relative max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-[32px] border border-white/10 bg-[#0A0D12] shadow-[0_30px_100px_rgba(0,0,0,0.65)]">
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.07] bg-[#0A0D12]/95 px-6 py-5 backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                  PLATON Pay
                </p>

                <h3 className="mt-2 text-xl font-black text-white">
                  Scan Payment QR
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  void closeScanner();
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="Close QR scanner"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="relative aspect-square overflow-hidden rounded-[26px] border border-white/10 bg-black">
                <div
                  id={
                    SCANNER_ELEMENT_ID
                  }
                  className="h-full w-full overflow-hidden [&_canvas]:max-h-full [&_canvas]:max-w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
                />

                {!scanning &&
                  !scannedValue && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 px-8 text-center">
                      {starting ? (
                        <>
                          <LoaderCircle
                            size={36}
                            className="animate-spin text-cyan-400"
                          />

                          <p className="mt-5 font-black text-white">
                            Starting
                            camera
                          </p>

                          <p className="mt-2 text-sm leading-6 text-white/35">
                            Allow camera
                            access when
                            Safari asks.
                          </p>
                        </>
                      ) : (
                        <>
                          <Camera
                            size={38}
                            className="text-cyan-400"
                          />

                          <p className="mt-5 font-black text-white">
                            Camera is
                            ready
                          </p>

                          <p className="mt-2 text-sm leading-6 text-white/35">
                            Start the
                            camera or
                            upload a QR
                            image.
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              void startScanner();
                            }}
                            className="mt-6 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-black text-[#05070A] transition hover:bg-cyan-300"
                          >
                            Start Camera
                          </button>
                        </>
                      )}
                    </div>
                  )}

                {scanning && (
                  <>
                    <div className="pointer-events-none absolute inset-[12%] rounded-[28px] border-2 border-cyan-400/70 shadow-[0_0_35px_rgba(34,211,238,0.25)]" />

                    <div className="pointer-events-none absolute left-[12%] right-[12%] top-1/2 h-0.5 animate-pulse bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />

                    <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs font-black text-white backdrop-blur-xl">
                      Point camera at
                      QR code
                    </div>
                  </>
                )}

                {scannedValue && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 px-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                      <CheckCircle2
                        size={30}
                      />
                    </div>

                    <p className="mt-5 text-xl font-black text-white">
                      QR Code Scanned
                    </p>

                    <p className="mt-3 max-w-sm break-all font-mono text-xs leading-6 text-emerald-300">
                      {scannedValue}
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4">
                  <p className="text-center text-sm leading-6 text-rose-300">
                    {error}
                  </p>
                </div>
              )}

              {!scannedValue && (
                <div className="mt-5">
                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageUpload
                    }
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={
                      starting ||
                      readingImage
                    }
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-black text-white transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {readingImage ? (
                      <LoaderCircle
                        size={18}
                        className="animate-spin text-cyan-400"
                      />
                    ) : (
                      <ImagePlus
                        size={18}
                        className="text-cyan-400"
                      />
                    )}

                    {readingImage
                      ? "Reading QR Image..."
                      : "Upload QR Image"}
                  </button>
                </div>
              )}

              {scannedValue && (
                <div className="mt-6">
                  <Button
                    onClick={
                      useScannedPayment
                    }
                  >
                    <CheckCircle2
                      size={18}
                    />

                    <span className="ml-2">
                      Use Payment
                      Details
                    </span>
                  </Button>
                </div>
              )}

              <p className="mt-5 text-center text-xs leading-5 text-white/25">
                Only scan trusted
                PLATON payment QR
                codes.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}