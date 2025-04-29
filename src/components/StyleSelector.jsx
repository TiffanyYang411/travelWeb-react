import './StyleSelector.css';

function StyleSelector({ styles, activeStyleId, onSelect }) {
  return (
    <div className="style-selector">
      {styles.map((style) => (
        <div
          key={style.id}
          className={`style-option ${activeStyleId === style.id ? 'active' : ''}`}
          onClick={() => onSelect(style.id)}
        >
          <img src={style.cover} alt={style.name} />
          <p>{style.name}</p>
        </div>
      ))}
    </div>
  );
}

export default StyleSelector;