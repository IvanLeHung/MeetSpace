import { formatTime } from '@/lib/date';

type Booking = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  room: { name: string };
  status: string;
};

export function DaySchedule({ bookings }: { bookings: Booking[] }) {
  const hours = Array.from({ length: 12 }).map((_, i) => `${String(i + 7).padStart(2, '0')}:00`);

  return (
    <div className="daySchedule">
      <div className="hourCol">
        {hours.map((hour) => (
          <div key={hour} className="hourBlock">{hour}</div>
        ))}
      </div>

      <div className="scheduleCol">
        {hours.map((hour) => {
          const items = bookings.filter((b) => formatTime(b.startTime).startsWith(hour.slice(0, 2)));
          return (
            <div key={hour} className="scheduleItem">
              {items.length === 0 ? (
                <span className="sub">Trống</span>
              ) : (
                items.map((item) => (
                  <div key={item.id}>
                    <strong>{item.title}</strong>
                    <div className="sub" style={{ marginBottom: 0 }}>
                      {item.room.name} • {formatTime(item.startTime)} - {formatTime(item.endTime)} • {item.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
