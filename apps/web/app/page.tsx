import { PageShell } from '@/components/PageShell';
import { Stats } from '@/components/Stats';
import { RoomGrid } from '@/components/RoomGrid';
import { Timeline } from '@/components/Timeline';
import { apiGet } from '@/lib/api';

export default async function HomePage() {
  const [rooms, bookings] = await Promise.all([
    apiGet<any[]>('/rooms'),
    apiGet<any[]>(`/bookings?date=${new Date().toISOString().slice(0, 10)}`)
  ]);

  return (
    <PageShell pathname="/" title="Tổng quan">
      <Stats />

      <div className="grid2">
        <section className="card">
          <h3>Phòng họp nổi bật</h3>
          <div className="sub">Xem nhanh tình trạng phòng, sức chứa và tiện ích</div>
          <RoomGrid rooms={rooms} />
        </section>

        <section className="card">
          <h3>Lịch hôm nay</h3>
          <div className="sub">Timeline cuộc họp trong ngày</div>
          <Timeline bookings={bookings} />
        </section>
      </div>
    </PageShell>
  );
}
