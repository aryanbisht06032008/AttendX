/**
 * ============================================
 * GPS DISTANCE UTILITIES
 * ============================================
 *
 * Used to enforce that a student must be physically
 * near the teacher (within GPS_ALLOWED_RADIUS_METERS)
 * for a QR scan to count as attendance.
 */

/**
 * Default allowed distance (in meters) between a student and
 * the teacher for a QR scan to mark attendance, used when the
 * teacher does not choose a radius when starting the session.
 */
const DEFAULT_ALLOWED_RADIUS_METERS = 20;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Compute the great-circle distance between two coordinates
 * using the Haversine formula.
 *
 * @returns {number} Distance in meters.
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusMeters = 6371000;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
}

module.exports = {
  DEFAULT_ALLOWED_RADIUS_METERS,
  haversineDistance,
};
