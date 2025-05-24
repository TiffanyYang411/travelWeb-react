const tripChangeListeners = [];

export function getTripCount() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return 0;
  const trips = JSON.parse(localStorage.getItem(`user_${currentUser}_trips`)) || [];
  return trips.length;
}

export function getUserTrips() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return [];
  return JSON.parse(localStorage.getItem(`user_${currentUser}_trips`)) || [];
}

export function addTripToUser(trip) {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;
  const key = `user_${currentUser}_trips`;
  const existingTrips = JSON.parse(localStorage.getItem(key)) || [];

  const exists = existingTrips.some(t => t.id === trip.id);
  if (!exists) {
    existingTrips.push(trip);
    localStorage.setItem(key, JSON.stringify(existingTrips));
    window.dispatchEvent(new Event("tripCountChanged")); // ✅ 通知購物車
    triggerTripChange(); // ✅ 通知我的行程
  }
}

export function removeTripFromUser(tripId) {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;
  const key = `user_${currentUser}_trips`;
  const trips = JSON.parse(localStorage.getItem(key)) || [];
  const updated = trips.filter(t => t.id !== tripId);
  localStorage.setItem(key, JSON.stringify(updated));
  window.dispatchEvent(new Event("tripCountChanged")); // ✅ 通知購物車
  triggerTripChange(); // ✅ 通知我的行程
}

// ✅ 加上訂閱變動功能
export function subscribeTripChanges(callback) {
  tripChangeListeners.push(callback);
}

export function unsubscribeTripChanges(callback) {
  const index = tripChangeListeners.indexOf(callback);
  if (index > -1) {
    tripChangeListeners.splice(index, 1);
  }
}

function triggerTripChange() {
  tripChangeListeners.forEach(fn => fn());
}

export function clearCart(username) {
  localStorage.removeItem(`cart_${username}`);
  window.dispatchEvent(new Event("tripCountChanged")); // ✅ 通知購物車 icon 更新
}



  