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

  const lotus = await prisma.meetingRoom.create({
    data: {
      name: 'Lotus Room',
      location: 'Head Office',
      floor: '8',
      capacity: 12,
      description: 'Premium room with large TV',
      amenities: {
        create: [{ name: 'TV 75"' }, { name: 'Zoom Room' }, { name: 'Whiteboard' }]
      }
    }
  });

  const sky = await prisma.meetingRoom.create({
    data: {
      name: 'Sky Room',
      location: 'Head Office',
      floor: '10',
      capacity: 20,
      description: 'Large room for demos and cross-functional meetings',
      amenities: {
        create: [{ name: 'Projector' }, { name: 'Conference Mic' }, { name: 'Speaker' }]
      }
    }
  });

  const focus = await prisma.meetingRoom.create({
    data: {
      name: 'Focus 3',
      location: 'Head Office',
      floor: '5',
      capacity: 6,
      description: 'Small collaboration room',
      amenities: {
        create: [{ name: '4K Display' }, { name: 'Whiteboard' }]
      }
    }
  });

  const now = new Date();
  const start1 = new Date(now);
  start1.setHours(9, 0, 0, 0);
  const end1 = new Date(now);
  end1.setHours(10, 0, 0, 0);

  const start2 = new Date(now);
  start2.setHours(11, 0, 0, 0);
  const end2 = new Date(now);
  end2.setHours(12, 0, 0, 0);

  const start3 = new Date(now);
  start3.setHours(15, 30, 0, 0);
  const end3 = new Date(now);
  end3.setHours(16, 30, 0, 0);

  const booking1 = await prisma.booking.create({
    data: {
      title: 'Daily Product Sync',
      description: 'Team daily standup',
      roomId: lotus.id,
      createdById: employee.id,
      startTime: start1,
      endTime: end1,
      attendeeCount: 8,
      status: BookingStatus.APPROVED,
      requiresApproval: false
    }
  });

  const booking2 = await prisma.booking.create({
    data: {
      title: 'Client Demo',
      description: 'Cross-team client demo',
      roomId: sky.id,
      createdById: employee.id,
      startTime: start2,
      endTime: end2,
      attendeeCount: 14,
      status: BookingStatus.PENDING,
      requiresApproval: true
    }
  });

  await prisma.booking.create({
    data: {
      title: 'Design Review',
      description: 'Review mockups and flows',
      roomId: focus.id,
      createdById: employee.id,
      startTime: start3,
      endTime: end3,
      attendeeCount: 5,
      status: BookingStatus.PENDING,
      requiresApproval: false
    }
  });

  await prisma.approval.create({
    data: {
      bookingId: booking2.id,
      approverId: approver.id,
      decision: ApprovalDecision.APPROVED,
      comment: 'Approved for client meeting'
    }
  });

  await prisma.checkin.create({
    data: {
      bookingId: booking1.id,
      checkedInById: employee.id,
      method: 'MANUAL'
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
