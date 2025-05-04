import '../styles/ExploreTripCard.css';

function ExploreTripCard({ trip, onClick, isActive, delayIndex }) {
  const classes = [
    'explore-trip-card',
    isActive ? 'active' : '',
    'show',
    delayIndex !== undefined ? `delay-${delayIndex}` : ''
  ].join(' ');

  return (
    <div className={classes} onClick={onClick}>
      <div className="trip-card-image">
        <img src={trip.bannerImage} alt={trip.title} />
        <div className="trip-card-overlay">
          <p className="explore-trip-title">{trip.title}</p>
          <p className="trip-days">{trip.days}</p>
        </div>
      </div>
    </div>
  );
}

export default ExploreTripCard;





