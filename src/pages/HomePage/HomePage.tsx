import { 
  Title,
} from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { cloudStorage, isMiniAppDark, useSignal } from '@telegram-apps/sdk-react';
import { Page } from '@/components/Page.tsx';
import { ReminderModal } from '@/components/ReminderModal/ReminderModal';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { ConfirmModal } from '@/components/ConfirmModal/ConfirmModal';
import { mockReminders } from '@/mocks/reminders';
import './HomePage.css';

// Add Telegram WebApp type declaration
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        showAlert: (message: string) => void;
      };
    };
  }
}

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
  const [isLoading, setIsLoading] = useState(true);
  const isDark = useSignal(isMiniAppDark);
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [notifiedReminders, setNotifiedReminders] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Add theme class to body
    document.body.className = isDark ? 'dark' : 'light';
  }, [isDark]);

  const checkReminders = useCallback(async () => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const currentDate = now.toISOString().split('T')[0];

    reminders.forEach(async (reminder) => {
      if (reminder.date === currentDate && reminder.time === currentTime) {
        // Check if we've already notified for this reminder
        if (!notifiedReminders.has(reminder.id)) {
          // Show notification using Telegram's notification system
          window.Telegram.WebApp.showAlert(reminder.text);

          // Mark as notified
          setNotifiedReminders(prev => {
            const newSet = new Set(prev);
            newSet.add(reminder.id);
            return newSet;
          });

          // If using cloudStorage, mark as notified there too
          if (!isUsingMockData) {
            try {
              const existingData = await cloudStorage.getItem('notifiedReminders') || '[]';
              const notifiedIds = JSON.parse(existingData);
              notifiedIds.push(reminder.id);
              await cloudStorage.setItem('notifiedReminders', JSON.stringify(notifiedIds));
            } catch (error) {
              console.error('Failed to save notified reminder:', error);
            }
          }
        }
      }
    });
  }, [reminders, notifiedReminders, isUsingMockData]);

  useEffect(() => {
    // Load notified reminders from cloudStorage
    const loadNotifiedReminders = async () => {
      if (!isUsingMockData) {
        try {
          const data = await cloudStorage.getItem('notifiedReminders') || '[]';
          const notifiedIds = JSON.parse(data);
          setNotifiedReminders(new Set(notifiedIds));
        } catch (error) {
          console.error('Failed to load notified reminders:', error);
        }
      }
    };

    loadNotifiedReminders();
  }, [isUsingMockData]);

  useEffect(() => {
    // Set up interval to check reminders every minute
    const intervalId = setInterval(checkReminders, 60000);
    
    // Initial check
    checkReminders();

    return () => clearInterval(intervalId);
  }, [checkReminders]);

  useEffect(() => {
    const loadReminders = async () => {
      try {
        setIsLoading(true);
        const userData = await cloudStorage.getItem('user');
        
        if (userData) {
          const data = await cloudStorage.getItem('reminders') || '[]';
          setReminders(JSON.parse(data));
          setIsUsingMockData(false);
        } else {
          setReminders(mockReminders);
          setIsUsingMockData(true);
        }
      } catch (error) {
        console.error('Failed to load reminders:', error);
        setReminders(mockReminders);
        setIsUsingMockData(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadReminders();
  }, []);

  const handleSaveReminder = async (reminder: Reminder) => {
    try {
      if (!isUsingMockData) {
        // Save to cloudStorage if using real data
        const existingData = await cloudStorage.getItem('reminders') || '[]';
        const reminders = JSON.parse(existingData);
        reminders.push(reminder);
        await cloudStorage.setItem('reminders', JSON.stringify(reminders));
      }
      
      // Update state
      setReminders(prev => [...prev, reminder]);
    } catch (error) {
      console.error('Failed to save reminder:', error);
    }
  };

  const handleDeleteReminder = async () => {
    if (!reminderToDelete) return;

    try {
      if (!isUsingMockData) {
        // Update cloudStorage if using real data
        const updatedReminders = reminders.filter(r => r.id !== reminderToDelete.id);
        await cloudStorage.setItem('reminders', JSON.stringify(updatedReminders));
      }
      
      // Update state
      setReminders(prev => prev.filter(r => r.id !== reminderToDelete.id));
      setReminderToDelete(null);
    } catch (error) {
      console.error('Failed to delete reminder:', error);
    }
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

        {isLoading ? (
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
                  <div className="reminder-card__footer">
                    <div className="reminder-card__datetime">
                      <time className="reminder-card__date">{reminder.date}</time>
                      <time className="reminder-card__time">{reminder.time}</time>
                    </div>
                    <button 
                      className="reminder-card__delete"
                      onClick={() => setReminderToDelete(reminder)}
                      aria-label="Delete reminder"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={!!reminderToDelete}
          onClose={() => setReminderToDelete(null)}
          onConfirm={handleDeleteReminder}
          title="Delete Reminder"
          message="Are you sure you want to delete this reminder? This action cannot be undone."
        />
      </div>
    </Page>
  );
}; 