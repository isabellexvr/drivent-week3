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

async function getSpecific(hotelId: number) {
  return prisma.hotel.findFirst({
    include: { Rooms: true },
    where: { id: hotelId }
  });
}

const hotelsRepository = {
  getAll,
  getSpecific
};

export default hotelsRepository;

