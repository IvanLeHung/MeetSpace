export function Stats() {
  const stats = [
    ['Phòng họp', '12', '🏢'],
    ['Đang sử dụng', '5', '⚡'],
    ['Cuộc họp hôm nay', '18', '📅'],
    ['Tỷ lệ sử dụng', '72%', '📈']
  ];

  return (
    <section className="stats">
      {stats.map(([label, value, icon]) => (
        <div className="stat" key={label} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 24, opacity: 0.8 }}>{icon}</div>
          <small>{label}</small>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}
