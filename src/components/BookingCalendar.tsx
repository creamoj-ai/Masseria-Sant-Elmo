'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isBefore, startOfToday } from 'date-fns';

interface BookingCalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export default function BookingCalendar({ onDateSelect, selectedDate }: BookingCalendarProps) {
  const [value, setValue] = useState<Date>(selectedDate ? new Date(selectedDate) : new Date());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch('/api/availability');
        const data = await res.json();
        setAvailableDates(data.available_dates || []);
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const handleDateChange = (val: any) => {
    if (val instanceof Date) {
      setValue(val);
      const dateStr = format(val, 'yyyy-MM-dd');
      onDateSelect(dateStr);
    }
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isAvailable = availableDates.includes(dateStr);
    const isSelected = selectedDate === dateStr;
    const isPast = isBefore(date, startOfToday());

    let classes = 'relative';
    if (isSelected) {
      classes += ' bg-verde-salvia text-panna rounded-lg';
    } else if (isAvailable && !isPast) {
      classes += ' hover:bg-oro-vintage/30 cursor-pointer rounded-lg';
    } else if (isPast) {
      classes += ' text-verde-salvia/30 cursor-not-allowed';
    } else {
      classes += ' text-verde-salvia/40 cursor-not-allowed';
    }
    return classes;
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isPast = isBefore(date, startOfToday());
    const isAvailable = availableDates.includes(dateStr);
    return isPast || (!isAvailable && !isPast);
  };

  return (
    <div className="w-full bg-panna-dark/5 rounded-lg p-6 border border-verde-salvia/20">
      <h3 className="text-lg font-light text-verde-salvia mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        Seleziona una data
      </h3>
      {loading ? (
        <div className="text-center py-8 text-verde-salvia font-light">Caricamento...</div>
      ) : (
        <>
          <style>{`
            .react-calendar {
              width: 100%;
              background: transparent;
              border: none;
              font-family: inherit;
              color: #556856;
            }
            .react-calendar__navigation button {
              background: transparent;
              border: none;
              color: #556856;
              cursor: pointer;
              font-size: 0.875rem;
              padding: 0.5rem;
            }
            .react-calendar__tile {
              padding: 0.75rem;
              background: transparent;
              border: 1px solid #556856/10;
              border-radius: 0.375rem;
              font-size: 0.875rem;
              color: #556856;
            }
            .react-calendar__tile:hover {
              background: rgba(201, 168, 118, 0.1);
            }
            .react-calendar__tile--active {
              background: #556856;
              color: #F5F3ED;
              border-color: #556856;
            }
            .react-calendar__tile--disabled {
              color: #556856/40;
              cursor: not-allowed;
            }
          `}</style>
          <Calendar
            onChange={handleDateChange}
            value={value}
            minDate={new Date()}
            locale="it-IT"
            tileClassName={tileClassName}
            tileDisabled={tileDisabled}
          />
        </>
      )}
      {selectedDate && (
        <div className="mt-4 p-3 bg-verde-salvia/5 rounded border border-verde-salvia/30">
          <p className="text-sm text-verde-salvia-dark font-light">Data: {selectedDate}</p>
        </div>
      )}
    </div>
  );
}
