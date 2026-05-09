import './Loader.css';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-container" id="loader">
      <div className="loader-spinner">
        <div className="spinner-ring"></div>
      </div>
      <p className="loader-text">{text}</p>
    </div>
  );
};

// Skeleton card for expert listing
export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-row">
      <div className="skeleton skeleton-avatar"></div>
      <div className="skeleton skeleton-badge"></div>
    </div>
    <div className="skeleton skeleton-title"></div>
    <div className="skeleton skeleton-tag"></div>
    <div className="skeleton-row">
      <div className="skeleton skeleton-meta"></div>
      <div className="skeleton skeleton-meta"></div>
    </div>
  </div>
);

export default Loader;
