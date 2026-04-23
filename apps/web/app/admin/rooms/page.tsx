import { PageShell } from '@/components/PageShell';
import { apiGet } from '@/lib/api';

export default async function AdminRoomsPage() {
  const rooms = await apiGet<any[]>('/rooms');

  return (
    <PageShell pathname="/admin/rooms" title="Quản lý phòng họp">
      <section className="card">
        <div className="sectionTitle">
          <div>
            <h3>Danh sách phòng họp</h3>
            <div className="sub">Màn hình dành cho quản lý phòng họp / admin</div>
          </div>
          <button className="btn">+ Thêm phòng</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Tên phòng</th>
              <th>Vị trí</th>
              <th>Tầng</th>
              <th>Sức chứa</th>
              <th>Thiết bị</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.location}</td>
                <td>{room.floor}</td>
                <td>{room.capacity}</td>
                <td>{room.amenities.join(', ')}</td>
                <td><span className="pill ok">ACTIVE</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </PageShell>
  );
}
