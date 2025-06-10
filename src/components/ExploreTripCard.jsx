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

        {/* 黑色遮罩，未點擊時顯示 */}
        <div className={`trip-card-mask ${isActive ? 'hidden' : ''}`}></div>

        {/* 預設顯示：行程 + 幾天幾夜 */}
        <div className="trip-card-info">
          <p className="explore-trip-title">{trip.title}</p>
          <p className="trip-days">{trip.days}</p>
        </div>

        {/* Hover 顯示 */}
        <div className="trip-card-hover">
          <p className="trip-hover-text">點擊查看更多</p>
        </div>
      </div>
    </div>
  );
}

export default ExploreTripCard;