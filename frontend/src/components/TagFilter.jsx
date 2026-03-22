export default function TagFilter({ tags, activeTag, onSelect }) {
  return (
    <div className="tag-filter">
      <button
        className={`tag-pill ${!activeTag ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {tags.map(tag => (
        <button
          key={tag}
          className={`tag-pill ${activeTag === tag ? 'active' : ''}`}
          onClick={() => onSelect(tag)}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}