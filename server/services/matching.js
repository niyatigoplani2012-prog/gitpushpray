// Haversine distance in km
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Pure function to match a donation to the best recipient organization.
 * @param {Object} donation - The donation document/object.
 * @param {Array} recipientOrgs - Array of available recipient organizations.
 * @param {Date} now - Optional current time override for testing.
 * @returns {Object|null} The best matching recipient org, or null if no match.
 */
function findBestMatch(donation, recipientOrgs, now = new Date()) {
  const t0 = performance.now();

  // 1. Safety check: DO NOT match if past safe_until
  const safeUntil = new Date(donation.expiry_window.safe_until);
  if (safeUntil < now) {
    console.log('[Match Service] Rejected: Donation past safe_until timestamp.');
    return null; 
  }

  // 2. Filter available orgs based on constraints
  let candidates = recipientOrgs.filter(org => {
     const acceptsFood = org.accepted_food_types.includes(donation.food_type);
     const hasCapacity = org.current_capacity >= donation.quantity;
     return acceptsFood && hasCapacity;
  });

  if (candidates.length === 0) {
    return null; // No match found
  }

  let bestMatch = null;
  let highestScore = -Infinity;

  // 3. Score candidate orgs
  const { lat: dLat, lng: dLng } = donation.pickup_location;
  for (const org of candidates) {
    const { lat: oLat, lng: oLng } = org.location;
    // Prevent exactly 0-distance causing Infinity scores by using max(0.1, distance)
    const distanceKm = Math.max(0.1, getDistance(dLat, dLng, oLat, oLng));
    
    // Closer is better
    const w1_distance = 1 / distanceKm; 
    
    // Less remaining capacity after match is better (capacity efficiency)
    const leftOverCapacity = org.current_capacity - donation.quantity;
    const w2_capacityFit = 1 / (leftOverCapacity + 1); // Avoid div by 0

    const score = (w1_distance * 10) + (w2_capacityFit * 5);

    if (score > highestScore) {
      highestScore = score;
      bestMatch = org;
    }
  }

  const t1 = performance.now();
  // We log this specifically for the performance verification.
  console.log(`[Match Service] Matching executed in ${(t1 - t0).toFixed(2)} ms.`);

  return bestMatch;
}

module.exports = { findBestMatch, getDistance };
