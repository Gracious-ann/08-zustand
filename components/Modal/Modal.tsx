import { createPortal } from 'react-dom';
import css from './Modal.module.css';
import { useEffect } from 'react';

interface ModalProps {
  children: React.ReactNode;
  onCancel: () => void;
}

export default function Modal({ children, onCancel }: ModalProps) {
  const handleBackDrop = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onCancel]);

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackDrop}
      role='dialog'
      aria-modal='true'
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.body
  );
}
