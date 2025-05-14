// findTripById.js
import { tripData } from '../data/tripData';

export function findTripById(tripId) {
  for (const style of tripData) {
    const found = style.trips.find((trip) => trip.id === tripId);
    if (found) return found;
  }
  return null;
}
