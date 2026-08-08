import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "react-toastify";

import api from "../../api/axios";

function AttendanceScanner({ onClose }) {
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);
  const hasScannedRef = useRef(false);

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =====================================
  // STOP QR SCANNER
  // =====================================

  const stopScanner = async () => {
    if (!scannerRef.current) {
      return;
    }

    try {
      if (isScanningRef.current) {
        await scannerRef.current.stop();
        isScanningRef.current = false;
      }

      await scannerRef.current.clear();
    } catch (error) {
      console.error(
        "Failed to stop scanner:",
        error
      );
    }

    scannerRef.current = null;
    setScanning(false);
  };

  // =====================================
  // MARK ATTENDANCE
  // =====================================

  const markAttendance = async (qrToken) => {
    if (hasScannedRef.current) {
      return;
    }

    hasScannedRef.current = true;

    try {
      setLoading(true);
      setMessage("");

      // Stop camera after QR is detected
      await stopScanner();

      const response = await api.post(
        "/attendance/scan",
        {
          qrToken,
        }
      );

      const successMessage =
        response.data?.message ||
        "Attendance marked successfully.";

      setMessage(successMessage);

      toast.success(successMessage);
    } catch (error) {
      console.error(
        "Attendance scan failed:",
        error
      );

      const errorMessage =
        error.response?.data?.message ||
        "Failed to mark attendance.";

      setMessage(errorMessage);

      toast.error(errorMessage);

      // Allow scanning again if the request failed
      hasScannedRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // START QR SCANNER
  // =====================================

  const startScanner = async () => {
    try {
      setMessage("");
      hasScannedRef.current = false;

      if (scannerRef.current) {
        return;
      }

      const scanner = new Html5Qrcode(
        "attendance-qr-reader"
      );

      scannerRef.current = scanner;

      setScanning(true);

      await scanner.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          if (
            loading ||
            hasScannedRef.current
          ) {
            return;
          }

          await markAttendance(decodedText);
        },
        () => {
          // Ignore normal QR scanning errors.
        }
      );

      isScanningRef.current = true;
    } catch (error) {
      console.error(
        "Failed to start QR scanner:",
        error
      );

      scannerRef.current = null;
      isScanningRef.current = false;

      setScanning(false);

      const errorMessage =
        "Unable to access camera. Please allow camera permission.";

      setMessage(errorMessage);

      toast.error(errorMessage);
    }
  };

  // =====================================
  // CLEANUP CAMERA
  // =====================================

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopScanner();
      }
    };
  }, []);

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen bg-app p-8">

      <div className="max-w-xl mx-auto">

        {/* Header */}

        <div className="text-center mb-8">

          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
            Mark Attendance
          </h1>

          <p className="text-slate-500 mt-2">
            Scan the QR code displayed by your teacher.
          </p>

        </div>


        {/* Scanner Card */}

        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card">

          {/* QR Scanner */}

          <div
            id="attendance-qr-reader"
            className="w-full overflow-hidden rounded-lg"
          />


          {/* Start Scanner */}

          {!scanning && !loading && (
            <div className="text-center py-10">

              <div className="text-6xl mb-4">
                📷
              </div>

              <p className="text-slate-500 mb-6">
                Camera scanner is not active.
              </p>

              <button
                onClick={startScanner}
                className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-3 font-semibold text-white shadow-glow-sm transition hover:-translate-y-0.5 hover:shadow-glow"
              >
                Start QR Scanner
              </button>

            </div>
          )}


          {/* Scanner Active */}

          {scanning && !loading && (
            <div className="text-center mt-6">

              <p className="text-slate-500 mb-4">
                Point your camera at the teacher's
                attendance QR code.
              </p>

              <button
                onClick={stopScanner}
                className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-8 py-3 font-semibold text-white shadow-[0_4px_14px_-6px_rgb(225_29_72/0.5)] transition hover:-translate-y-0.5"
              >
                Stop Scanner
              </button>

            </div>
          )}


          {/* Loading */}

          {loading && (
            <div className="text-center py-10">

              <div className="text-5xl mb-4">
                ⏳
              </div>

              <p className="font-semibold text-amber-600">
                Marking your attendance...
              </p>

            </div>
          )}

        </div>


        {/* Message */}

        {message && !loading && (
          <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white p-6 text-center shadow-card">

            <p className="font-semibold text-slate-700">
              {message}
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default AttendanceScanner;