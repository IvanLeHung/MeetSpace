import { PageShell } from '@/components/PageShell';
import { Stats } from '@/components/Stats';
import { RoomGrid } from '@/components/RoomGrid';
import { Timeline } from '@/components/Timeline';
import { RoomStatusGrid } from '@/components/RoomStatusGrid';
import { apiGet } from '@/lib/api';

export default async function HomePage({ searchParams }: { searchParams: { role?: string } }) {
  const role = searchParams.role || 'EMPLOYEE';
  const isAdmin = role === 'ADMIN';

  const [rooms, bookings] = await Promise.all([
    apiGet<any[]>('/rooms'),
    apiGet<any[]>(`/bookings?date=${new Date().toISOString().slice(0, 10)}`)
  ]);

  // Group bookings by room for RoomStatusGrid
  const roomsWithBookings = rooms.map(room => ({
    ...room,
    bookings: bookings.filter(b => b.roomId === room.id)
  }));

  return (
    <PageShell pathname="/" title={isAdmin ? "Dashboard Quản trị" : "Tổng quan cá nhân"}>
      <Stats />

      {isAdmin && <RoomStatusGrid rooms={roomsWithBookings} />}

      <div className="grid2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <section className="card">
            <h3>Lịch họp hôm nay</h3>
            <div className="sub">Tất cả cuộc họp đang diễn ra trong hệ thống</div>
            <Timeline bookings={bookings} />
          </section>

          <section className="card">
            <h3>Danh sách phòng họp</h3>
            <div className="sub">Chi tiết sức chứa và trang thiết bị</div>
            <RoomGrid rooms={rooms} />
          </section>
        </div>

        <section className="card">
          <div className="sectionTitle">
            <h3>Phòng được đặt nhiều</h3>
            <div className="pill ok">Thống kê</div>
          </div>
          <div className="sub">Dữ liệu 30 ngày qua</div>
          <div className="formGrid" style={{ gap: 12 }}>
            {rooms.map((room, i) => (
              <div key={room.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                <span><strong>{i + 1}.</strong> {room.name}</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{Math.floor(Math.random() * 20) + 5} lần</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
