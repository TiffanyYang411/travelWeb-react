// TripStore.jsx
import { createContext, useState } from 'react';

export const TripContext = createContext();

export function TripProvider({ children }) {
  const [pendingTrips, setPendingTrips] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <TripContext.Provider
      value={{
        pendingTrips,
        setPendingTrips,
        upcomingTrips,
        setUpcomingTrips,
        pastTrips,
        setPastTrips,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        totalPrice,
        setTotalPrice,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}
