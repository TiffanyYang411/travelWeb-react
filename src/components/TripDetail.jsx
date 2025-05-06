// TripDetail.jsx 控制不顯示的行程內容
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tripData } from "../data/tripData";
import { isLoggedIn } from "../utils/auth";
import { addTripToUser } from "../utils/tripUtils";
import "../styles/TripDetail.css";

export default function TripDetail() {
  const { styleId, tripId } = useParams();
  const navigate = useNavigate();

  const style = tripData.find((style) => style.styleId === parseInt(styleId));
  const trip = style?.trips.find((trip) => trip.id === parseInt(tripId));

  if (!trip) {
    return <div>找不到此行程</div>;
  }

  const handleAddTrip = () => {
    console.log("🧪 點擊加入行程按鈕");
    console.log("🔒 isLoggedIn() =", isLoggedIn());

    if (!isLoggedIn()) {
      console.log("⚠️ 未登入，導向登入頁");
      sessionStorage.setItem("returnTo", window.location.pathname);
      navigate("/login");
    } else {
      console.log("✅ 已登入，執行 addTripToUser()");
      addTripToUser(trip);
      alert("已加入行程！");
    }
  };

  return (
    <div className="trip-detail">
      <div className="trip-banner">
        <img src={trip.banner} alt={`${trip.title} Banner`} />
      </div>

      <h1 className="trip-detail-title">{trip.title}</h1>
      <p className="trip-days">{trip.days}</p>
      <p className="trip-price">NT${trip.price.toLocaleString()}</p>

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





