'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const roles = [
  ['EMPLOYEE', 'Nhân viên'],
  ['APPROVER', 'Người duyệt'],
  ['ADMIN', 'Admin']
];

export function RoleSwitcher() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get('role') || 'EMPLOYEE';

  function setRole(role: string) {
    const next = new URLSearchParams(params.toString());
    next.set('role', role);
    router.push(`?${next.toString()}`);
  }

  return (
    <div className="roleSwitch">
      {roles.map(([value, label]) => (
        <button
          key={value}
          className={`roleBtn ${current === value ? 'active' : ''}`}
          onClick={() => setRole(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
