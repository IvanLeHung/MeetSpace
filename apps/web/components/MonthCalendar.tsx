import { formatDate } from '@/lib/date';

type Booking = {
  id: string;
  title: string;
  startTime: string;
};

export function MonthCalendar({ bookings }: { bookings: Booking[] }) {
  const current = new Date();
  const year = current.getFullYear();
  const month = current.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grouped = new Map<string, Booking[]>();
  for (const booking of bookings) {
    const key = new Date(booking.startTime).toISOString().slice(0, 10);
    grouped.set(key, [...(grouped.get(key) || []), booking]);
  }

  return (
    <div className="calendarMonth">
      {Array.from({ length: daysInMonth }).map((_, i) => {
        const d = new Date(year, month, i + 1);
        const key = d.toISOString().slice(0, 10);
        const dayBookings = grouped.get(key) || [];
        return (
          <div key={key} className="calendarDay">
            <strong>{formatDate(d)}</strong>
            <div className="dayEvents">
              {dayBookings.slice(0, 3).map((event) => (
                <div key={event.id} className="eventChip">{event.title}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
