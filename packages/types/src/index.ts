export type Role = 'EMPLOYEE' | 'APPROVER' | 'ADMIN';

export type BookingStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'CHECKED_IN'
  | 'EXPIRED';

export interface MeetingRoomDto {
  id: string;
  name: string;
  location: string;
  floor: string;
  capacity: number;
  status: string;
  amenities: string[];
}

export interface BookingDto {
  id: string;
  title: string;
  description?: string | null;
  roomId: string;
  createdById: string;
  startTime: string;
  endTime: string;
  attendeeCount: number;
  status: BookingStatus;
  requiresApproval: boolean;
}
