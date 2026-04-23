export function formatTime(input: string | Date) {
  const d = new Date(input);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(input: string | Date) {
  const d = new Date(input);
  return d.toLocaleDateString('vi-VN');
}

export function todayYmd() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function monthYmd() {
  const d = new Date();
  return d.toISOString().slice(0, 7);
}
