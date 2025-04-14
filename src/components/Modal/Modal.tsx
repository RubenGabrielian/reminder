import { FC, ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const Modal: FC<ModalProps> = ({ children, isOpen, onClose, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${className}`} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}; 