import React, { useEffect, useState } from 'react';
import '../styles/Calendar.css';

function Calendar() {
  const [currentDate, setCurrentDate] = useState({ day: null, month: null, year: null });
  const [displayedDate, setDisplayedDate] = useState({ month: null, year: null });

  useEffect(() => {
    fetch('http://127.0.0.1:8080/current-date')
      .then(response => response.json())
      .then(data => {
        setCurrentDate(data);
        setDisplayedDate({ month: data.month, year: data.year });
      })
      .catch(error => console.error('Error fetching date:', error));
  }, []);

  const daysInMonth = new Date(displayedDate.year, displayedDate.month, 0).getDate();
  const firstDayOfMonth = new Date(displayedDate.year, displayedDate.month - 1, 1).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    let newMonth = displayedDate.month - 1;
    let newYear = displayedDate.year;

    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setDisplayedDate({ month: newMonth, year: newYear });
  };

  const handleNextMonth = () => {
    let newMonth = displayedDate.month + 1;
    let newYear = displayedDate.year;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }

    setDisplayedDate({ month: newMonth, year: newYear });
  };

  const getMonthName = (month) => {
    return new Date(0, month - 1).toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="calendar card">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>‹</button>
        <h3>{getMonthName(displayedDate.month)} {displayedDate.year}</h3>
        <button onClick={handleNextMonth}>›</button>
      </div>
      <div className="weekdays">
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
        <div>Su</div>
      </div>
      <div className="calendar-grid">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="empty"></div>
        ))}
        {daysArray.map((day) => (
          <div
            key={day}
            className={
              day === currentDate.day && displayedDate.month === currentDate.month && displayedDate.year === currentDate.year
                ? 'selected'
                : ''
            }
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
