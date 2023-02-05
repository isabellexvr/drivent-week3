import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

async function getAll(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

type HotelRooms = Hotel & {
    id: number,
    name: string,
    capacity: number,
    hotelId: number,
    createdAt: Date,
    updatedAt: Date
  }

async function getSpecificWithRooms(hotelId: number) {
  return prisma.hotel.findFirst({
    include: { Rooms: true },
    where: { id: hotelId }
  });
}

async function getEnrolledUser(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: { Ticket: { 
      select: { 
        status: true, 
        TicketType: {
          select: { 
            includesHotel: true,
            isRemote: true
          }
        }
      }
    }
    }
  });
}

const hotelsRepository = {
  getAll,
  getSpecificWithRooms,
  getEnrolledUser
};

export default hotelsRepository;

