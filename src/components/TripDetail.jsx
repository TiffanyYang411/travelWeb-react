// TripDetail.jsx 控制不顯示的行程內容
import React from "react";
import { useParams } from "react-router-dom";
import { tripData } from "../data/tripData";
import "../styles/TripDetail.css"; // 依你需要加上 CSS 樣式

export default function TripDetail() {
    const { styleId, tripId } = useParams();

    // 轉成數字型別做比對
    const style = tripData.find((style) => style.styleId === parseInt(styleId));
    const trip = style?.trips.find((trip) => trip.id === parseInt(tripId));

    if (!trip) {
        return <div>找不到此行程</div>;
    }

    console.log("🔍 trip.itinerary =", trip.itinerary);

    return (
        <div className="trip-detail">
            <div className="trip-banner">
                <img src={trip.banner} alt={`${trip.title} Banner`} />
            </div>

            <h1 className=".trip-detail-title">{trip.title}</h1>
            <p className="trip-days">{trip.days}</p>
            <p className="trip-price">NT${trip.price.toLocaleString()}</p>

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
