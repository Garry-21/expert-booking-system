import { useNavigate } from 'react-router-dom';
import { FiStar, FiBriefcase, FiClock, FiArrowRight } from 'react-icons/fi';
import './ExpertCard.css';

const ExpertCard = ({ expert, index = 0 }) => {
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Web Development': '#0d9488',
      'Mobile Development': '#8b5cf6',
      'Data Science': '#f59e0b',
      'Cloud Architecture': '#3b82f6',
      'DevOps': '#ef4444',
      'UI/UX Design': '#ec4899',
      'Project Management': '#6366f1',
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div
      className={`expert-card animate-fade-in-up stagger-${(index % 8) + 1}`}
      onClick={() => navigate(`/experts/${expert._id}`)}
      id={`expert-card-${expert._id}`}
      role="button"
      tabIndex={0}
    >
      <div className="expert-card-top">
        <div className="expert-avatar" style={{ background: getCategoryColor(expert.category) }}>
          {getInitials(expert.name)}
        </div>
        <div className="expert-rating">
          <FiStar size={14} />
          <span>{expert.rating?.toFixed(1)}</span>
        </div>
      </div>

      <div className="expert-card-body">
        <h3 className="expert-name">{expert.name}</h3>
        <span
          className="expert-category-tag"
          style={{
            color: getCategoryColor(expert.category),
            background: getCategoryColor(expert.category) + '12',
          }}
        >
          {expert.category}
        </span>

        <div className="expert-meta">
          <div className="meta-item">
            <FiBriefcase size={14} />
            <span>{expert.experience} yrs exp</span>
          </div>
          <div className="meta-item">
            <FiClock size={14} />
            <span>${expert.hourlyRate}/hr</span>
          </div>
        </div>
      </div>

      <div className="expert-card-footer">
        <span className="view-profile-text">View Profile</span>
        <span className="view-profile-arrow">
          <FiArrowRight size={16} />
        </span>
      </div>
    </div>
  );
};

export default ExpertCard;
