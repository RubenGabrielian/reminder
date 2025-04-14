import { FC } from 'react';
import { Button, Textarea } from '@telegram-apps/telegram-ui';
import { Modal } from '@/components/Modal/Modal';
import './ReminderModal.css';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: { text: string; date: string; time: string }) => void;
}

export const ReminderModal: FC<ReminderModalProps> = ({ isOpen, onClose, onSave }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSave({
      text: formData.get('text') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="reminder-modal"
    >
      <form onSubmit={handleSubmit} className="reminder-modal__form">
        <h2 className="reminder-modal__title">New Reminder</h2>
        
        <div className="reminder-modal__input-group">
          <Textarea
            name="text"
            placeholder="Write your reminder..."
            required
            className="reminder-modal__textarea"
          />
        </div>

        <div className="reminder-modal__input-group reminder-modal__datetime">
          <div className="reminder-modal__date">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              required
              className="reminder-modal__input"
            />
          </div>

          <div className="reminder-modal__time">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              required
              className="reminder-modal__input"
            />
          </div>
        </div>

        <div className="reminder-modal__actions">
          <Button
            type="button"
            onClick={onClose}
            className="reminder-modal__button reminder-modal__button--cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="reminder-modal__button reminder-modal__button--save"
          >
            Save Reminder
          </Button>
        </div>
      </form>
    </Modal>
  );
}; 