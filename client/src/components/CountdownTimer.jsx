import React, { useState, useEffect } from 'react';

// Live-switching tabular-nums countdown logic driving the urgency color reservation
export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [urgencyState, setUrgencyState] = useState('safe'); 

  useEffect(() => {
    const updateCountdown = () => {
      const msLeft = new Date(targetDate) - new Date();
      if (msLeft <= 0) {
        setTimeLeft('EXPIRED');
        setUrgencyState('expired');
        return;
      }

      const hours = Math.floor(msLeft / (1000 * 60 * 60));
      const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((msLeft % (1000 * 60)) / 1000);

      setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);

      const totalMinutes = Math.floor(msLeft / (1000 * 60));

      if (totalMinutes < 15) {
        setUrgencyState('critical');
      } else if (totalMinutes < 60) {
        setUrgencyState('warning');
      } else {
        setUrgencyState('safe');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Exact urgency tokens driving both text color and semantic styling
  const styles = {
    safe: 'text-urgency-safe font-semibold',
    warning: 'text-urgency-warning font-bold bg-urgency-pendingBg px-1 rounded',
    critical: 'text-urgency-critical font-extrabold bg-urgency-escalatedBg px-1 rounded animate-pulse',
    expired: 'text-urgency-expired font-bold line-through',
  };

  return (
    <span className={`tabular-nums ${styles[urgencyState]}`}>
      {timeLeft}
    </span>
  );
}
