import { useEffect, useState } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';
import './Toast.css';

const ICONS = {
  success: <FiCheck />,
  error: <FiX />,
  warning: <FiAlertCircle />,
  info: <FiInfo />,
};

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type} ${isExiting ? 'toast-exit' : ''}`} id="toast">
      <span className="toast-icon">{ICONS[type]}</span>
      <p className="toast-message">{message}</p>
      <button
        className="toast-close"
        onClick={() => {
          setIsExiting(true);
          setTimeout(onClose, 300);
        }}
      >
        <FiX size={16} />
      </button>
    </div>
  );
};

export default Toast;
