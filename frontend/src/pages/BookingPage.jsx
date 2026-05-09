import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../services/api';
import Toast from '../components/Toast';
import {
  FiArrowLeft, FiUser, FiMail, FiPhone,
  FiFileText, FiCalendar, FiClock, FiCheck,
} from 'react-icons/fi';
import './BookingPage.css';

const BookingPage = () => {
  const { expertId, slotId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { expert, slot, date } = location.state || {};

  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);

  if (!expert || !slot || !date) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="error-state">
            <h3>Missing booking information</h3>
            <p>Please select a time slot from the expert detail page.</p>
            <button className="retry-btn" onClick={() => navigate('/')}>
              Go to Experts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!form.clientName.trim() || form.clientName.trim().length < 2)
      errs.clientName = 'Name must be at least 2 characters';
    if (!form.clientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail))
      errs.clientEmail = 'Please enter a valid email';
    if (!form.clientPhone.trim() || !/^\d{10,}$/.test(form.clientPhone.replace(/\D/g, '')))
      errs.clientPhone = 'Phone must be at least 10 digits';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createBooking({
        expertId,
        timeSlotId: slotId,
        clientName: form.clientName.trim(),
        clientEmail: form.clientEmail.trim().toLowerCase(),
        clientPhone: form.clientPhone.replace(/\D/g, ''),
        bookingDate: date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        notes: form.notes.trim(),
      });
      setSuccess(true);
    } catch (err) {
      setToast({
        message: err.message || 'Failed to create booking',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (time) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  const formatDate = (d) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="success-card animate-fade-in-up" id="booking-success">
            <div className="success-icon-wrap">
              <FiCheck size={32} />
            </div>
            <h2>Booking Confirmed!</h2>
            <p>Your session with <strong>{expert.name}</strong> has been booked.</p>
            <div className="success-details">
              <div className="success-detail-row">
                <FiCalendar size={16} />
                <span>{formatDate(date)}</span>
              </div>
              <div className="success-detail-row">
                <FiClock size={16} />
                <span>{formatTime(slot.startTime)} — {formatTime(slot.endTime)}</span>
              </div>
            </div>
            <div className="success-actions">
              <button className="btn-primary" onClick={() => navigate('/my-bookings')}>
                View My Bookings
              </button>
              <button className="btn-secondary" onClick={() => navigate('/')}>
                Browse Experts
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <button className="back-btn animate-fade-in" onClick={() => navigate(-1)}>
          <FiArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="booking-layout">
          <div className="booking-summary animate-fade-in-up" id="booking-summary">
            <h3 className="summary-title">Booking Summary</h3>
            <div className="summary-expert">
              <div className="summary-avatar" style={{ background: '#0d9488' }}>
                {expert.name.split(' ').map(w => w[0]).join('').toUpperCase()}
              </div>
              <div>
                <p className="summary-name">{expert.name}</p>
                <p className="summary-cat">{expert.category}</p>
              </div>
            </div>
            <div className="summary-row">
              <FiCalendar size={16} />
              <span>{formatDate(date)}</span>
            </div>
            <div className="summary-row">
              <FiClock size={16} />
              <span>{formatTime(slot.startTime)} — {formatTime(slot.endTime)}</span>
            </div>
          </div>

          <form className="booking-form animate-fade-in-up stagger-2" onSubmit={handleSubmit} id="booking-form">
            <h2 className="form-title">Complete Your Booking</h2>

            <div className={`form-group ${errors.clientName ? 'has-error' : ''}`}>
              <label htmlFor="clientName">
                <FiUser size={15} />
                Full Name
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                placeholder="John Doe"
                value={form.clientName}
                onChange={handleChange}
              />
              {errors.clientName && <span className="field-error">{errors.clientName}</span>}
            </div>

            <div className={`form-group ${errors.clientEmail ? 'has-error' : ''}`}>
              <label htmlFor="clientEmail">
                <FiMail size={15} />
                Email Address
              </label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                placeholder="john@example.com"
                value={form.clientEmail}
                onChange={handleChange}
              />
              {errors.clientEmail && <span className="field-error">{errors.clientEmail}</span>}
            </div>

            <div className={`form-group ${errors.clientPhone ? 'has-error' : ''}`}>
              <label htmlFor="clientPhone">
                <FiPhone size={15} />
                Phone Number
              </label>
              <input
                type="tel"
                id="clientPhone"
                name="clientPhone"
                placeholder="1234567890"
                value={form.clientPhone}
                onChange={handleChange}
              />
              {errors.clientPhone && <span className="field-error">{errors.clientPhone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="notes">
                <FiFileText size={15} />
                Notes <span className="optional">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Any specific topics or questions?"
                value={form.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
              id="submit-booking"
            >
              {submitting ? (
                <span className="btn-loading">
                  <span className="btn-spinner"></span>
                  Processing...
                </span>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
