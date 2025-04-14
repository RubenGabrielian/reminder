import { FC } from 'react';
import './LoadingSpinner.css';

export const LoadingSpinner: FC = () => {
  return (
    <div className="loading-spinner">
      <div className="loading-spinner__circle"></div>
      <p className="loading-spinner__text">Loading reminders...</p>
    </div>
  );
}; 