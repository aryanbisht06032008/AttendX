import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "react-toastify";

import api from "../../api/axios";

function Attendance() {
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const markAttendance = async (qrToken) => {
    try {
      setLoading(true);
      setMessage("");

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
    } finally {
      setLoading(false);
    }
  };

  const startScanner = async () => {
    try {
      setMessage("");

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
          if (loading) {
            return;
          }

          await markAttendance(decodedText);
        },
        (errorMessage) => {
          // Ignore normal QR scanning errors.
          // The scanner calls this while looking
          // for a QR code.
        }
      );

      isScanningRef.current = true;
    } catch (error) {
      console.error(
        "Failed to start QR scanner:",
        error
      );

      setScanning(false);
      scannerRef.current = null;

      const errorMessage =
        "Unable to access camera. Please allow camera permission.";

      setMessage(errorMessage);

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopScanner();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-xl mx-auto">

        {/* Header */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Mark Attendance
          </h1>

          <p className="text-gray-600 mt-2">
            Scan the QR code displayed by your teacher.
          </p>

        </div>


        {/* Scanner Card */}

        <div className="bg-white rounded-xl shadow-md p-6">

          <div
            id="attendance-qr-reader"
            className="w-full overflow-hidden rounded-lg"
          />

          {!scanning && (
            <div className="text-center py-10">

              <div className="text-6xl mb-4">
                📷
              </div>

              <p className="text-gray-500 mb-6">
                Camera scanner is not active.
              </p>

              <button
                onClick={startScanner}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                Start QR Scanner
              </button>

            </div>
          )}


          {scanning && (
            <div className="text-center mt-6">

              <p className="text-gray-600 mb-4">
                Point your camera at the teacher's
                attendance QR code.
              </p>

              <button
                onClick={stopScanner}
                disabled={loading}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                Stop Scanner
              </button>

            </div>
          )}

        </div>


        {/* Loading */}

        {loading && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">

            <p className="text-blue-700 font-medium">
              Marking your attendance...
            </p>

          </div>
        )}


        {/* Message */}

        {message && !loading && (
          <div className="mt-6 bg-white rounded-lg shadow p-5 text-center">

            <p className="text-gray-700 font-medium">
              {message}
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default Attendance;