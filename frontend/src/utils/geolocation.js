/**
 * Wraps navigator.geolocation.getCurrentPosition in a Promise
 * so it can be used with async/await.
 *
 * Resolves with the GeolocationPosition object.
 * Rejects when geolocation is unsupported, permission is
 * denied, or the position cannot be determined.
 */
function getCurrentPosition(options) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error(
          "Geolocation is not supported by this browser."
        )
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        // Best accuracy, since attendance depends on a
        // 20-meter radius around the teacher.
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options,
      }
    );
  });
}

export { getCurrentPosition };
