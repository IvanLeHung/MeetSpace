'use client';

import { useEffect, useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { apiGet, apiPost } from '@/lib/api';
import { todayYmd } from '@/lib/date';

type Room = {
  id: string;
  name: string;
  capacity: number;
};

type User = {
  id: string;
  fullName: string;
};

export default function BookingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: 'Họp kick-off dự án',
    description: 'Trao đổi scope và phân công',
    roomId: '',
    createdById: '',
    date: todayYmd(),
    startTime: '10:00',
    endTime: '11:00',
    attendeeCount: 8,
    requiresApproval: false
  });

  useEffect(() => {
    Promise.all([apiGet<Room[]>('/rooms'), apiGet<User[]>('/users')]).then(([roomData, userData]) => {
      setRooms(roomData);
      setUsers(userData);
      setForm((prev) => ({
        ...prev,
        roomId: roomData[0]?.id || '',
        createdById: userData[0]?.id || ''
      }));
    });
  }, []);

  async function submit() {
    setMessage('');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        roomId: form.roomId,
        createdById: form.createdById,
        attendeeCount: Number(form.attendeeCount),
        requiresApproval: form.requiresApproval,
        startTime: new Date(`${form.date}T${form.startTime}:00`).toISOString(),
        endTime: new Date(`${form.date}T${form.endTime}:00`).toISOString()
      };

      const created = await apiPost<any>('/bookings', payload);
      setMessage(`Đặt phòng thành công: ${created.title}`);
    } catch (error: any) {
      setMessage(`Lỗi: ${error.message}`);
    }
  }

  return (
    <PageShell pathname="/booking" title="Đặt phòng">
      <div className="grid2">
        <section className="card">
          <h3>Tạo lịch họp mới</h3>
          <div className="sub">Chọn phòng, thời gian và người tạo booking</div>

          <div className="formGrid">
            <div>
              <label className="sub" style={{ display: 'block', marginBottom: 8 }}>Tên cuộc họp</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="VD: Họp kick-off dự án" />
            </div>

            <div>
              <label className="sub" style={{ display: 'block', marginBottom: 8 }}>Mục đích cuộc họp</label>
              <textarea className="input" style={{ minHeight: 80 }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Nhập nội dung ngắn gọn..." />
            </div>

            <div className="row2">
              <div>
                <label className="sub" style={{ display: 'block', marginBottom: 8 }}>Phòng họp</label>
                <select className="input" value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })}>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>{room.name} ({room.capacity} người)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="sub" style={{ display: 'block', marginBottom: 8 }}>Người đặt</label>
                <select className="input" value={form.createdById} onChange={(e) => setForm({ ...form, createdById: e.target.value })}>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.fullName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row2">
              <div>
                <label className="sub" style={{ display: 'block', marginBottom: 8 }}>Ngày họp</label>
                <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="sub" style={{ display: 'block', marginBottom: 8 }}>Số người tham dự</label>
                <input className="input" type="number" min={1} value={form.attendeeCount} onChange={(e) => setForm({ ...form, attendeeCount: Number(e.target.value) })} />
              </div>
            </div>

            <div className="row2">
              <div>
                <label className="sub" style={{ display: 'block', marginBottom: 8 }}>Giờ bắt đầu</label>
                <select className="input" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}>
                  {Array.from({ length: 22 }).map((_, i) => {
                    const h = Math.floor(i / 2) + 8;
                    const m = i % 2 === 0 ? '00' : '30';
                    const time = `${h.toString().padStart(2, '0')}:${m}`;
                    return <option key={time} value={time}>{time}</option>;
                  })}
                </select>
              </div>
              <div>
                <label className="sub" style={{ display: 'block', marginBottom: 8 }}>Giờ kết thúc</label>
                <select className="input" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}>
                  {Array.from({ length: 22 }).map((_, i) => {
                    const h = Math.floor((i + 1) / 2) + 8;
                    const m = (i + 1) % 2 === 0 ? '00' : '30';
                    const time = `${h.toString().padStart(2, '0')}:${m}`;
                    return <option key={time} value={time}>{time}</option>;
                  })}
                </select>
              </div>
            </div>

            <div>
              <label className="sub" style={{ display: 'block', marginBottom: 12 }}>Thiết bị cần thiết</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {['Máy chiếu', 'Màn hình', 'Whiteboard', 'Video Conf', 'Loa', 'Micro'].map(item => (
                  <label key={item} style={{ display: 'flex', gap: 8, fontSize: 14, alignItems: 'center', cursor: 'pointer' }}>
                    <input type="checkbox" /> {item}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ padding: '12px 0' }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 500, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.requiresApproval}
                  onChange={(e) => setForm({ ...form, requiresApproval: e.target.checked })}
                />
                Yêu cầu phê duyệt từ cấp trên
              </label>
            </div>

            <button className="btn" style={{ width: '100%', padding: '14px' }} onClick={submit}>Gửi yêu cầu đặt phòng</button>

            {message ? <div className="pill ok" style={{ textAlign: 'center', marginTop: 12 }}>{message}</div> : null}
          </div>
        </section>

        <section className="card">
          <h3>Xem trước booking</h3>
          <div className="sub">Thông tin xác nhận trước khi gửi</div>
          <div className="featureGrid">
            <div className="featureItem">
              <strong>Tiêu đề</strong>
              <p>{form.title}</p>
            </div>
            <div className="featureItem">
              <strong>Ngày giờ</strong>
              <p>{form.date} • {form.startTime} - {form.endTime}</p>
            </div>
            <div className="featureItem">
              <strong>Số người</strong>
              <p>{form.attendeeCount}</p>
            </div>
            <div className="featureItem">
              <strong>Luồng xử lý</strong>
              <p>{form.requiresApproval ? 'PENDING → APPROVER' : 'APPROVED ngay nếu không xung đột'}</p>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
