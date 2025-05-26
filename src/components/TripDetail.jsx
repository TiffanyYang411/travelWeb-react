// TripDetail.jsx 控制不顯示的行程內容
// TripDetail.jsx
// TripDetail.jsx
import React, { useState } from "react"; // ✅ 要加useState
import { useParams, useNavigate } from "react-router-dom";
import { tripData } from "../data/tripData";
import { isLoggedIn } from "../utils/auth";
import { addTripToUser } from "../utils/tripUtils";
import "../styles/TripDetail.css";

export default function TripDetail() {
  const { styleId, tripId } = useParams();
  const navigate = useNavigate();

  const [showAddMessage, setShowAddMessage] = useState(false); // ✅ 新增這行

  const style = tripData.find((style) => style.styleId === parseInt(styleId));
  const trip = style?.trips.find((trip) => trip.id === parseInt(tripId));

  if (!trip) {
    return <div>找不到此行程</div>;
  }

  const handleAddTrip = () => {

    if (!isLoggedIn()) {

      const fullPath = window.location.pathname + window.location.search;
      const base = import.meta.env.BASE_URL.replace(/\/$/, '');
      const purePath = fullPath.startsWith(base.length)
        ? fullPath.slice(base.length)
        : fullPath;

      sessionStorage.setItem("returnTo", purePath);
      navigate("/login");
    } else {
      addTripToUser(trip);

      window.dispatchEvent(new CustomEvent("tripCountChanged"));
      window.dispatchEvent(new CustomEvent("tripAdded"));

      // ✅ 顯示提示字
      setShowAddMessage(true);
      setTimeout(() => {
        setShowAddMessage(false);
      }, 1500);
    }
  };

  return (
    <div className="trip-detail">
      <div className="trip-banner">
        <img src={trip.banner} alt={`${trip.title} Banner`} />
      </div>

      <h1 className="trip-detail-title">{trip.title}</h1>
      <p className="trip-days">{trip.days}</p>
      <p className="trip-price">NT$ {trip.price.toLocaleString()}</p>

      <button className="add-trip-btn zh-text-18" onClick={handleAddTrip}>
        加入行程 ➕
      </button>

      <h2 className="trip-highlights-title">行程亮點</h2>
      <ul className="trip-highlights">
        {trip.highlights
          .filter((item) => item !== null)
          .map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
      </ul>

      <h2 className="trip-itinerary-title">每日行程</h2>
      <div className="trip-itinerary">
        {Array.isArray(trip.itinerary) &&
          trip.itinerary
            .filter(
              (day) =>
                day &&
                typeof day.desc === "string" &&
                day.desc.trim() !== "" &&
                typeof day.image === "string" &&
                day.image.trim() !== "" &&
                typeof day.day === "string" &&
                day.day.trim() !== ""
            )
            .map((day, index) => (
              <div key={index} className="trip-day">
                <h3>{day.day}</h3>
                <img src={day.image} alt={`Image for ${day.day}`} />
                <pre>{day.desc}</pre>
              </div>
            ))}
      </div>


    </div>
  );
}

























