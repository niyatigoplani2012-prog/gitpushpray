const { test } = require('node:test');
const assert = require('node:assert');
const { findBestMatch } = require('../services/matching');

test('Matching Service - Safety Limit (safe_until)', () => {
  const donation = {
    food_type: 'produce',
    quantity: 10,
    expiry_window: { safe_until: new Date('2023-01-01T00:00:00Z') }, // inherently expired
    pickup_location: { lat: 40.7128, lng: -74.0060 }
  };
  const orgs = [
    {
      accepted_food_types: ['produce'],
      current_capacity: 50,
      location: { lat: 40.7138, lng: -74.0060 }
    }
  ];

  const now = new Date('2026-09-01T00:00:00Z');
  const match = findBestMatch(donation, orgs, now);

  assert.strictEqual(match, null, 'Expired donation should return null match');
});

test('Matching Service - Timing Check < 2s', () => {
  // Generate a large number of dummy orgs matching constraints
  const orgs = Array.from({ length: 1500 }, (_, i) => ({
    _id: `org${i}`,
    accepted_food_types: ['produce'],
    current_capacity: 100,
    location: {
      lat: 40.7 + (Math.random() * 0.1),
      lng: -74.0 + (Math.random() * 0.1)
    }
  }));

  const donation = {
    food_type: 'produce',
    quantity: 50,
    expiry_window: { safe_until: new Date('2030-01-01T00:00:00Z') },
    pickup_location: { lat: 40.7128, lng: -74.0060 }
  };

  const start = performance.now();
  const match = findBestMatch(donation, orgs, new Date('2026-09-01T00:00:00Z'));
  const duration = performance.now() - start;

  assert.ok(match !== null, 'Should find a match');
  assert.ok(duration < 2000, `Matching took ${duration}ms, expected under 2000ms`);
  console.log(`Matched against 1500 orgs in ${duration.toFixed(2)}ms`);
});
