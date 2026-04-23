import { PrismaClient, Role, BookingStatus, ApprovalDecision } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.approval.deleteMany();
  await prisma.checkin.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.roomAmenity.deleteMany();
  await prisma.meetingRoom.deleteMany();
  await prisma.user.deleteMany();

  const employee = await prisma.user.create({
    data: {
      email: 'employee@meetspace.local',
      fullName: 'Nguyen Van A',
      role: Role.EMPLOYEE,
      department: 'Product'
    }
  });

  const approver = await prisma.user.create({
    data: {
      email: 'approver@meetspace.local',
      fullName: 'Le Minh B',
      role: Role.APPROVER,
      department: 'Operations'
    }
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@meetspace.local',
      fullName: 'Tran Thu C',
      role: Role.ADMIN,
      department: 'Admin'
    }
  });

  const room1 = await prisma.meetingRoom.create({
    data: {
      name: 'Phòng họp lớn khối 1',
      location: 'Tòa nhà A',
      floor: '1',
      capacity: 20,
      description: 'Phòng họp lớn đầy đủ thiết bị',
      amenities: {
        create: [{ name: 'Máy chiếu' }, { name: 'Video Conf' }, { name: 'Loa' }]
      }
    }
  });

  const room2 = await prisma.meetingRoom.create({
    data: {
      name: 'Phòng họp nhỏ khối 1',
      location: 'Tòa nhà A',
      floor: '1',
      capacity: 8,
      description: 'Phòng họp nhỏ cho team',
      amenities: {
        create: [{ name: 'Màn hình' }, { name: 'Whiteboard' }]
      }
    }
  });

  const room3 = await prisma.meetingRoom.create({
    data: {
      name: 'Phòng họp lớn khối 2',
      location: 'Tòa nhà B',
      floor: '2',
      capacity: 25,
      description: 'Phòng họp lớn khối 2 hiện đại',
      amenities: {
        create: [{ name: 'Máy chiếu' }, { name: 'Màn hình' }, { name: 'Micro' }]
      }
    }
  });

  const room4 = await prisma.meetingRoom.create({
    data: {
      name: 'Phòng khánh tiết',
      location: 'Tòa nhà A',
      floor: '1',
      capacity: 15,
      description: 'Phòng tiếp khách VIP',
      amenities: {
        create: [{ name: 'Nội thất cao cấp' }, { name: 'Loa' }, { name: 'Micro' }]
      }
    }
  });

  const now = new Date();
  
  // Bookings for Room 1 (Current & Next)
  const r1_start1 = new Date(now); r1_start1.setHours(9, 0, 0);
  const r1_end1 = new Date(now); r1_end1.setHours(11, 0, 0);
  const r1_start2 = new Date(now); r1_start2.setHours(13, 0, 0);
  const r1_end2 = new Date(now); r1_end2.setHours(14, 30, 0);

  // Bookings for Room 2 (Current)
  const r2_start1 = new Date(now); r2_start1.setHours(8, 30, 0);
  const r2_end1 = new Date(now); r2_end1.setHours(10, 30, 0);

  // Bookings for Room 4 (Next)
  const r4_start1 = new Date(now); r4_start1.setHours(14, 0, 0);
  const r4_end1 = new Date(now); r4_end1.setHours(16, 0, 0);

  await prisma.booking.create({
    data: {
      title: 'Họp giao ban khối 1',
      description: 'Họp đầu tuần',
      roomId: room1.id,
      createdById: employee.id,
      startTime: r1_start1,
      endTime: r1_end1,
      attendeeCount: 15,
      status: BookingStatus.APPROVED,
      requiresApproval: false
    }
  });

  await prisma.booking.create({
    data: {
      title: 'Họp dự án Website',
      description: 'Review thiết kế',
      roomId: room1.id,
      createdById: employee.id,
      startTime: r1_start2,
      endTime: r1_end2,
      attendeeCount: 10,
      status: BookingStatus.APPROVED,
      requiresApproval: false
    }
  });

  await prisma.booking.create({
    data: {
      title: 'Brainstorming Team',
      description: 'Lên ý tưởng mới',
      roomId: room2.id,
      createdById: employee.id,
      startTime: r2_start1,
      endTime: r2_end1,
      attendeeCount: 5,
      status: BookingStatus.APPROVED,
      requiresApproval: false
    }
  });

  await prisma.booking.create({
    data: {
      title: 'Tiếp đối tác nước ngoài',
      description: 'Ký kết hợp đồng',
      roomId: room4.id,
      createdById: approver.id,
      startTime: r4_start1,
      endTime: r4_end1,
      attendeeCount: 10,
      status: BookingStatus.APPROVED,
      requiresApproval: true
    }
  });

  console.log('Seed completed');
  console.log({ employee, approver, admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
