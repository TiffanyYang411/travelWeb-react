import '../styles/ExploreTripCard.css';

function ExploreTripCard({ trip, onClick, isActive }) {
  return (
    <div
      className={`explore-trip-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <img src={trip.bannerImage} alt={trip.title} />
      <div className="trip-card-info">
        <h3 className="trip-card-title">{trip.title}</h3>
        <p className="trip-card-days">{trip.days}</p>
      </div>
    </div>
  );
}

export default ExploreTripCard;
