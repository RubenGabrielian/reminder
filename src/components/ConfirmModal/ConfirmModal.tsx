import { FC } from 'react';
import { Modal } from '@/components/Modal/Modal';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="confirm-modal">
      <div className="confirm-modal__content">
        <h3 className="confirm-modal__title">{title}</h3>
        <p className="confirm-modal__message">{message}</p>
        <div className="confirm-modal__actions">
          <button 
            className="confirm-modal__button confirm-modal__button--cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="confirm-modal__button confirm-modal__button--delete"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}; 