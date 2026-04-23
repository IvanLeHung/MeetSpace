import { formatTime } from '@/lib/date';

type Booking = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  createdBy: { fullName: string };
};

type Room = {
  id: string;
  name: string;
  bookings: Booking[];
};

export function RoomStatusGrid({ rooms }: { rooms: Room[] }) {
  const now = new Date();

  const getStatus = (roomBookings: Booking[]) => {
    const current = roomBookings.find(b => {
      const start = new Date(b.startTime);
      const end = new Date(b.endTime);
      return now >= start && now <= end;
    });

    const next = roomBookings
      .filter(b => new Date(b.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

    return { current, next };
  };

  return (
    <div className="card">
      <h3>Trạng thái phòng họp (Thời gian thực)</h3>
      <div className="sub">Theo dõi ai đang sử dụng và lịch tiếp theo</div>
      
      <table className="table">
        <thead>
          <tr>
            <th>Phòng họp</th>
            <th>Đang diễn ra</th>
            <th>Lịch tiếp theo</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => {
            const { current, next } = getStatus(room.bookings);
            return (
              <tr key={room.id}>
                <td>
                  <strong>{room.name}</strong>
                </td>
                <td>
                  {current ? (
                    <div>
                      <div className="pill ok" style={{ display: 'inline-block', marginBottom: 4 }}>Đang bận</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{current.title}</div>
                      <div className="sub" style={{ marginBottom: 0 }}>
                        {current.createdBy.fullName} ({formatTime(current.startTime)} - {formatTime(current.endTime)})
                      </div>
                    </div>
                  ) : (
                    <span className="pill" style={{ background: '#f1f5f9', color: '#64748b' }}>Đang trống</span>
                  )}
                </td>
                <td>
                  {next ? (
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{next.title}</div>
                      <div className="sub" style={{ marginBottom: 0 }}>
                        {next.createdBy.fullName} ({formatTime(next.startTime)} - {formatTime(next.endTime)})
                      </div>
                    </div>
                  ) : (
                    <span className="sub">Không có lịch</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
