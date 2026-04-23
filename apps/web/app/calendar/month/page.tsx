import { PageShell } from '@/components/PageShell';
import { MonthCalendar } from '@/components/MonthCalendar';
import { apiGet } from '@/lib/api';
import { monthYmd } from '@/lib/date';

export default async function MonthPage() {
  const bookings = await apiGet<any[]>(`/bookings?month=${monthYmd()}`);

  return (
    <PageShell pathname="/calendar/month" title="Lịch tháng">
      <section className="card">
        <h3>Lịch tháng tổng quan</h3>
        <div className="sub">Quan sát mật độ sử dụng phòng và booking theo ngày</div>
        <MonthCalendar bookings={bookings} />
      </section>
    </PageShell>
  );
}
