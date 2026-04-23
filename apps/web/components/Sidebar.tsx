import Link from 'next/link';

export function Sidebar({ pathname }: { pathname: string }) {
  const items = [
    ['/', '🏠 Tổng quan'],
    ['/booking', '📅 Đặt phòng'],
    ['/calendar/month', '🗓️ Lịch tháng'],
    ['/calendar/day', '🕐 Lịch ngày'],
    ['/approval', '✅ Phê duyệt'],
    ['/admin/rooms', '🛠️ Quản lý phòng']
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandBadge">M</div>
        <div className="brandMeta">
          <h1>MeetSpace</h1>
          <p>Book room easy</p>
        </div>
      </div>

      <div className="navList">
        {items.map(([href, label]) => (
          <Link key={href} href={href} className={`navLink ${pathname === href ? 'active' : ''}`}>
            {label}
          </Link>
        ))}
      </div>

      <div className="sideCard">
        <h3>Role hỗ trợ</h3>
        <ul>
          <li>Nhân viên: đặt phòng, xem lịch</li>
          <li>Người duyệt: approve / reject</li>
          <li>Admin: quản lý phòng và theo dõi vận hành</li>
        </ul>
      </div>
    </aside>
  );
}
