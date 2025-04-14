import { 
  Title,
} from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { cloudStorage } from '@telegram-apps/sdk-react';
import { Page } from '@/components/Page.tsx';
import { ReminderModal } from '@/components/ReminderModal/ReminderModal';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import './HomePage.css';

interface Reminder {
  id: string;
  text: string;
  date: string;
  time: string;
  created: string;
}

export const HomePage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await cloudStorage.getItem('reminders') || '[]';
      setReminders(JSON.parse(data));
    } catch (error) {
      console.error('Failed to load reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReminder = (reminder: Reminder) => {
    setReminders(prev => [...prev, reminder]);
  };

  return (
    <Page back={false}>
      <div className="home-page">
        {/* Header */}
        <header className="home-page__header">
          <Title level="1" className="home-page__title">
            Reminders
          </Title>
        </header>

        {loading ? (
          <LoadingSpinner />
        ) : reminders.length === 0 ? (
          // Empty State
          <div className="home-page__empty-state">
            {/* Illustration */}
            <div className="home-page__illustration">
              {/* Background Circle */}
              <div className="home-page__background" />

              {/* Sticky Notes */}
              <div className="sticky-note sticky-note--yellow">
                <div className="sticky-note__lines">
                  <div className="sticky-note__line" />
                  <div className="sticky-note__line" />
                </div>
              </div>

              <div className="sticky-note sticky-note--blue">
                <div className="sticky-note__lines">
                  <div className="sticky-note__line" />
                  <div className="sticky-note__line" />
                  <div className="sticky-note__line" />
                </div>
              </div>

              <div className="sticky-note sticky-note--green">
                <div className="sticky-note__lines">
                  <div className="sticky-note__line" />
                  <div className="sticky-note__line sticky-note__line--short" />
                  <div className="sticky-note__line" />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="decorative-element decorative-element--dot" style={{ top: '15%', left: '15%' }} />
              <div className="decorative-element decorative-element--dot" style={{ bottom: '25%', right: '20%' }} />
              <div className="decorative-element decorative-element--wave" style={{ top: '30%', right: '15%' }} />
              <div className="decorative-element decorative-element--wave" style={{ bottom: '20%', left: '20%' }} />
              
              {/* Light Bulb */}
              <div className="decorative-element decorative-element--bulb">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm-1 14v-1h2v1h-2zm3-2h-4v-1h4v1z"/>
                </svg>
              </div>
            </div>

            {/* Empty State Text */}
            <h2 className="home-page__empty-title">
              No reminders
            </h2>
            <p className="home-page__empty-description">
              Create a reminder and it will show up here.
            </p>
          </div>
        ) : (
          // Reminders List
          <div className="home-page__reminders">
            {reminders.map(reminder => (
              <div key={reminder.id} className="reminder-card">
                <div className="reminder-card__content">
                  <p className="reminder-card__text">{reminder.text}</p>
                  <div className="reminder-card__datetime">
                    <time className="reminder-card__date">{reminder.date}</time>
                    <time className="reminder-card__time">{reminder.time}</time>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Navigation */}
        <nav className="bottom-nav">
          <button className="bottom-nav__button">
            <svg className="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="bottom-nav__button">
            <svg className="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </nav>

        {/* FAB Button */}
        <button className="fab" onClick={() => setIsModalOpen(true)}>
          <svg className="fab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Reminder Modal */}
        <ReminderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveReminder}
        />
      </div>
    </Page>
  );
}; 