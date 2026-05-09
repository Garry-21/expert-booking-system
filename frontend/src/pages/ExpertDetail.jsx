import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExpertById } from '../services/api';
import { connectSocket, joinExpertRoom, leaveExpertRoom, getSocket } from '../services/socket';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import {
  FiStar,
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiArrowLeft,
  FiCalendar,
  FiZap,
} from 'react-icons/fi';
import './ExpertDetail.css';

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [toast, setToast] = useState(null);

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

  const getInitials = (name) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();

  const fetchExpert = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getExpertById(id);
      setExpert(result.data);
      setSlots(result.data.availableSlots || {});
      const dates = Object.keys(result.data.availableSlots || {});
      if (dates.length > 0) setSelectedDate(dates[0]);
    } catch (err) {
      setError(err.message || 'Failed to load expert details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExpert();
  }, [fetchExpert]);

  // Socket.io for real-time updates
  useEffect(() => {
    const socket = connectSocket();
    joinExpertRoom(id);

    socket.on('slot-booked', (data) => {
      setSlots((prev) => {
        const updated = { ...prev };
        for (const dateKey of Object.keys(updated)) {
          updated[dateKey] = updated[dateKey].filter(
            (slot) => slot.id !== data.slotId
          );
          if (updated[dateKey].length === 0) {
            delete updated[dateKey];
          }
        }
        return updated;
      });
      setToast({ message: 'A slot was just booked by another user!', type: 'info' });
    });

    socket.on('slot-freed', (data) => {
      fetchExpert(); // Re-fetch to get the freed slot
      setToast({ message: 'A slot just became available!', type: 'success' });
    });

    return () => {
      leaveExpertRoom(id);
      const s = getSocket();
      s.off('slot-booked');
      s.off('slot-freed');
    };
  }, [id, fetchExpert]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  if (loading) return <div className="page-wrapper"><Loader text="Loading expert details..." /></div>;

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="error-state">
            <h3>Error</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchExpert}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  if (!expert) return null;

  const dates = Object.keys(slots).sort();

  return (
    <div className="page-wrapper">
      <div className="container">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <button className="back-btn animate-fade-in" onClick={() => navigate(-1)} id="back-btn">
          <FiArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="detail-layout">
          {/* Expert Profile */}
          <div className="expert-profile animate-fade-in-up" id="expert-profile">
            <div className="profile-header">
              <div
                className="profile-avatar"
                style={{ background: getCategoryColor(expert.category) }}
              >
                {getInitials(expert.name)}
              </div>
              <div className="profile-info">
                <h1 className="profile-name">{expert.name}</h1>
                <span
                  className="profile-category"
                  style={{
                    color: getCategoryColor(expert.category),
                    background: getCategoryColor(expert.category) + '12',
                  }}
                >
                  {expert.category}
                </span>
              </div>
            </div>

            {expert.bio && <p className="profile-bio">{expert.bio}</p>}

            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <FiStar size={18} />
                </div>
                <div>
                  <span className="stat-value">{expert.rating?.toFixed(1)}</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <FiBriefcase size={18} />
                </div>
                <div>
                  <span className="stat-value">{expert.experience} yrs</span>
                  <span className="stat-label">Experience</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <FiDollarSign size={18} />
                </div>
                <div>
                  <span className="stat-value">${expert.hourlyRate}</span>
                  <span className="stat-label">Per Hour</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <FiClock size={18} />
                </div>
                <div>
                  <span className="stat-value">{expert.availability?.startTime} - {expert.availability?.endTime}</span>
                  <span className="stat-label">Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Available Slots */}
          <div className="slots-section animate-fade-in-up stagger-2" id="slots-section">
            <div className="slots-header">
              <h2 className="slots-title">
                <FiCalendar size={20} />
                Available Slots
              </h2>
              <div className="live-badge">
                <FiZap size={12} />
                Live
              </div>
            </div>

            {dates.length === 0 ? (
              <div className="no-slots">
                <p>No available slots at the moment</p>
              </div>
            ) : (
              <>
                <div className="date-tabs" id="date-tabs">
                  {dates.map((date) => (
                    <button
                      key={date}
                      className={`date-tab ${selectedDate === date ? 'active' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <span className="date-tab-day">{formatDate(date)}</span>
                      <span className="date-tab-count">{slots[date].length} slots</span>
                    </button>
                  ))}
                </div>

                {selectedDate && slots[selectedDate] && (
                  <div className="slots-grid" id="slots-grid">
                    {slots[selectedDate].map((slot, i) => (
                      <button
                        key={slot.id}
                        className={`slot-btn animate-fade-in-up stagger-${(i % 8) + 1}`}
                        onClick={() =>
                          navigate(`/book/${id}/${slot.id}`, {
                            state: {
                              expert,
                              slot,
                              date: selectedDate,
                            },
                          })
                        }
                        id={`slot-${slot.id}`}
                      >
                        <span className="slot-time">
                          {formatTime(slot.startTime)} — {formatTime(slot.endTime)}
                        </span>
                        <span className="slot-action">Book →</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertDetail;
