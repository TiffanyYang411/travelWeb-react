export function getTripCount() {
    const trips = JSON.parse(localStorage.getItem('myTrips')) || [];
    return trips.length;
  }
  