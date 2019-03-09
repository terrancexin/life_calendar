import React, { useEffect, useState} from 'react';

import '../styles/events.css';
import spinner from '../assets/spinner.gif';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEventsAPI();
  }, []);

  if (loading) {
    return <img className="spinner" src={spinner} alt="spinner" />
  } else if (!events.length) {
    return <div className="no-events">No Life Events here.. go do something!</div>
  }

  return (
    <ul className="events">
      {events.map((event) => {
        const { id, colorId, summary, startTime, endTime, month, day, date, isToday, allDay } = event;

        return (
          <li className="event" key={id}>
            <div className={`date-col ${isToday || ''}`}>
              <div className="day">{day}</div>
              <div className="month-date"><div className="month">{month}</div><div className="date">{date}</div></div>
            </div>
            <div className={`color color-${colorId}`}></div>
            <div className="time-col">
              {allDay ? 'All day' : `${startTime} - ${endTime}`}
            </div>
            <div className="summary-col">{summary}</div>
          </li>
        )
      })}
    </ul>
  )

  async function fetchEventsAPI() {
    setLoading(true);
    const res = await fetch('/calendar-events');
    const events = await res.json();

    setLoading(false);
    setEvents(events)
  }
}