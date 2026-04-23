export function Stats() {
  const stats = [
    ['Phòng đang khả dụng', '12'],
    ['Lịch họp hôm nay', '28'],
    ['Tỷ lệ sử dụng', '82%'],
    ['No-show tuần này', '3']
  ];

  return (
    <section className="stats">
      {stats.map(([label, value]) => (
        <div className="stat" key={label}>
          <small>{label}</small>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}
