import { PageShell } from '@/components/PageShell';
import { DaySchedule } from '@/components/DaySchedule';
import { apiGet } from '@/lib/api';

export default async function DayPage() {
  const bookings = await apiGet<any[]>(`/bookings?date=${new Date().toISOString().slice(0, 10)}`);

  return (
    <PageShell pathname="/calendar/day" title="Lịch ngày full màn hình">
      <section className="card">
        <h3>Lịch theo giờ</h3>
        <div className="sub">Màn hình chi tiết 1 ngày cho điều phối và vận hành</div>
        <DaySchedule bookings={bookings} />
      </section>
    </PageShell>
  );
}
