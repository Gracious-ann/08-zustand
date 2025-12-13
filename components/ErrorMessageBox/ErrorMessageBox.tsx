import { useEffect, useState } from 'react';
import css from './ErrorMessageBox.module.css';

interface ErrorMessageProps {
  message?: string;
  duration?: number;
  onClose?: () => void;
}

function ErrorMessageBox({
  message = 'There was an error, please try again...',
  duration = 1000,
  onClose,
}: ErrorMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={css.backdrop}>
      <p className={css.text}>{message}</p>
    </div>
  );
}

export default ErrorMessageBox;
