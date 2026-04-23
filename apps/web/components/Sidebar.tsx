'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function Sidebar({ pathname }: { pathname: string }) {
  const params = useSearchParams();
  const role = params.get('role') || 'EMPLOYEE';
  const isAdmin = role === 'ADMIN' || role === 'APPROVER';

  const items = [
    ['/', '📊 Tổng quan'],
    ['/booking', '📅 Đặt phòng'],
    ['/calendar/month', '🗓️ Lịch tháng'],
    ['/calendar/day', '🕐 Lịch ngày'],
  ];

  if (isAdmin) {
    items.push(['/approval', '✅ Phê duyệt']);
    items.push(['/admin/rooms', '🛠️ Quản lý phòng']);
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandBadge">M</div>
        <div className="brandMeta">
          <h1>MeetSpace</h1>
          <p>Book room easy</p>
        </div>
      </div>

      <nav className="navList">
        {items.map(([href, label]) => (
          <Link key={href} href={`${href}?role=${role}`} className={`navLink ${pathname === href ? 'active' : ''}`}>
            {label}
          </Link>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        <div className="navLink" style={{ borderTop: '1px solid var(--border)', borderRadius: 0, padding: '20px 0' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e2e8f0', display: 'grid', placeItems: 'center', fontWeight: 600 }}>
            {role[0]}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
              {role === 'ADMIN' ? 'Trần Thu C' : role === 'APPROVER' ? 'Lê Minh B' : 'Nguyễn Văn A'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              {role === 'ADMIN' ? 'Quản trị viên' : role === 'APPROVER' ? 'Người phê duyệt' : 'Nhân viên'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
