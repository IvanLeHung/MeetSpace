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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <section className="card">
            <h3>Lịch hôm nay</h3>
            <div className="sub">Timeline cuộc họp trong ngày</div>
            <Timeline bookings={bookings} />
          </section>

          <section className="card">
            <h3>Phòng họp nổi bật</h3>
            <div className="sub">Xem nhanh tình trạng phòng, sức chứa và tiện ích</div>
            <RoomGrid rooms={rooms} />
          </section>
        </div>

        <section className="card">
          <div className="sectionTitle">
            <h3>Phòng được đặt nhiều</h3>
            <select className="input" style={{ width: 'auto', padding: '4px 10px', fontSize: 12 }}>
              <option>Tháng này</option>
              <option>Tuần này</option>
            </select>
          </div>
          <div className="sub">Dựa trên dữ liệu 30 ngày gần nhất</div>
          <div className="formGrid" style={{ gap: 12 }}>
            {[
              ['Phòng Lotus 1', '22 lần'],
              ['Phòng Ocean', '18 lần'],
              ['Phòng Sunflower', '15 lần'],
              ['Phòng Rose', '10 lần']
            ].map(([name, count], i) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                <span><strong>{i + 1}.</strong> {name}</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{count}</span>
              </div>
            ))}
          </div>
          <button className="btn secondary" style={{ width: '100%', marginTop: 20 }}>Xem báo cáo chi tiết</button>
        </section>
      </div>
    </PageShell>
  );
}
