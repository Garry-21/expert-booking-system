import { useState } from 'react';
import { getBookingsByEmail } from '../services/api';
import Toast from '../components/Toast';
import Loader from '../components/Loader';
import {
  FiMail, FiSearch, FiCalendar, FiClock,
  FiUser, FiFileText, FiInbox,
} from 'react-icons/fi';
import './MyBookings.css';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#f59e0b', bg: '#fffbeb', icon: '⏳' },
  confirmed: { label: 'Confirmed', color: '#10b981', bg: '#ecfdf5', icon: '✅' },
  completed: { label: 'Completed', color: '#3b82f6', bg: '#eff6ff', icon: '🎉' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2', icon: '❌' },
};

const MyBookings = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setToast({ message: 'Please enter a valid email address', type: 'warning' });
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const result = await getBookingsByEmail(email.trim().toLowerCase());
      setBookings(result.data);
    } catch (err) {
      setToast({ message: err.message || 'Failed to fetch bookings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });

  const formatTime = (time) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="bookings-header animate-fade-in-up">
          <h1 className="bookings-title">My Bookings</h1>
          <p className="bookings-subtitle">Look up your booking history by email</p>
        </div>

        <form className="email-search animate-fade-in-up stagger-1" onSubmit={handleSearch} id="email-search-form">
          <div className="email-input-wrap">
            <FiMail className="email-icon" size={18} />
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              id="email-input"
            />
          </div>
          <button type="submit" className="search-btn" id="search-bookings-btn" disabled={loading}>
            <FiSearch size={18} />
            <span>Search</span>
          </button>
        </form>

        {loading ? (
          <Loader text="Fetching your bookings..." />
        ) : searched && bookings.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <FiInbox size={48} />
            <h3>No bookings found</h3>
            <p>No bookings were found for this email address</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="bookings-list" id="bookings-list">
            {bookings.map((booking, i) => {
              const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
              return (
                <div
                  key={booking._id}
                  className={`booking-card animate-fade-in-up stagger-${(i % 8) + 1}`}
                  id={`booking-${booking._id}`}
                >
                  <div className="booking-card-header">
                    <div className="booking-expert-info">
                      <FiUser size={16} />
                      <span className="booking-expert-name">
                        {booking.expertId?.name || 'Expert'}
                      </span>
                      {booking.expertId?.category && (
                        <span className="booking-expert-cat">{booking.expertId.category}</span>
                      )}
                    </div>
                    <span
                      className="status-badge"
                      style={{ color: status.color, background: status.bg }}
                    >
                      {status.icon} {status.label}
                    </span>
                  </div>

                  <div className="booking-card-body">
                    <div className="booking-detail">
                      <FiCalendar size={15} />
                      <span>{formatDate(booking.bookingDate)}</span>
                    </div>
                    <div className="booking-detail">
                      <FiClock size={15} />
                      <span>{formatTime(booking.startTime)} — {formatTime(booking.endTime)}</span>
                    </div>
                    {booking.notes && (
                      <div className="booking-detail booking-notes">
                        <FiFileText size={15} />
                        <span>{booking.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MyBookings;
