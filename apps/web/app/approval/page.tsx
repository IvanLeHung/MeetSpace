'use client';

import { useEffect, useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { apiGet, apiPatch } from '@/lib/api';

type Booking = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  room: { name: string };
  createdBy: { fullName: string };
};

type User = {
  id: string;
  fullName: string;
  role: string;
};

export default function ApprovalPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [approvers, setApprovers] = useState<User[]>([]);
  const [selectedApprover, setSelectedApprover] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    const [bookingData, users] = await Promise.all([apiGet<Booking[]>('/bookings'), apiGet<User[]>('/users')]);
    const filteredApprovers = users.filter((u) => u.role === 'APPROVER' || u.role === 'ADMIN');
    setApprovers(filteredApprovers);
    setSelectedApprover(filteredApprovers[0]?.id || '');
    setBookings(bookingData.filter((b) => b.status === 'PENDING'));
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id: string, decision: 'APPROVED' | 'REJECTED') {
    if (!selectedApprover) return;

    await apiPatch(`/bookings/${id}/decision`, {
      approverId: selectedApprover,
      decision,
      comment: decision === 'APPROVED' ? 'Approved from demo UI' : 'Rejected from demo UI'
    });

    setMessage(`Đã ${decision === 'APPROVED' ? 'duyệt' : 'từ chối'} booking`);
    load();
  }

  return (
    <PageShell pathname="/approval" title="Phê duyệt phòng họp">
      <section className="card">
        <div className="sectionTitle">
          <div>
            <h3>Yêu cầu chờ duyệt</h3>
            <div className="sub">Dành cho APPROVER và ADMIN</div>
          </div>

          <select className="input" style={{ maxWidth: 280 }} value={selectedApprover} onChange={(e) => setSelectedApprover(e.target.value)}>
            {approvers.map((user) => (
              <option key={user.id} value={user.id}>{user.fullName}</option>
            ))}
          </select>
        </div>

        {message ? <p className="sub" style={{ color: '#fff' }}>{message}</p> : null}

        <table className="table">
          <thead>
            <tr>
              <th>Cuộc họp</th>
              <th>Thời gian</th>
              <th>Người tạo</th>
              <th>Phòng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.title}</td>
                <td>{new Date(booking.startTime).toLocaleString('vi-VN')}</td>
                <td>{booking.createdBy.fullName}</td>
                <td>{booking.room.name}</td>
                <td><span className="pill warn">{booking.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn" onClick={() => decide(booking.id, 'APPROVED')}>Duyệt</button>
                    <button className="btn secondary" onClick={() => decide(booking.id, 'REJECTED')}>Từ chối</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </PageShell>
  );
}
