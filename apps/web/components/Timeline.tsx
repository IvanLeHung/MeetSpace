import { formatTime } from '@/lib/date';

type Booking = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  room: { name: string };
  attendeeCount: number;
};

export function Timeline({ bookings }: { bookings: Booking[] }) {
  const statusClass = (status: string) => {
    if (status === 'APPROVED' || status === 'CHECKED_IN') return 'ok';
    if (status === 'REJECTED' || status === 'CANCELLED') return 'bad';
    return 'warn';
  };

  return (
    <div className="timeline">
      {bookings.map((booking) => (
        <div key={booking.id} className="timelineItem">
          <div><strong>{formatTime(booking.startTime)}</strong></div>
          <div>
            <strong>{booking.title}</strong>
            <div className="sub" style={{ marginBottom: 0 }}>
              {booking.room.name} • {booking.attendeeCount} người • {formatTime(booking.endTime)}
            </div>
          </div>
          <span className={`pill ${statusClass(booking.status)}`}>{booking.status}</span>
        </div>
      ))}
    </div>
  );
}
