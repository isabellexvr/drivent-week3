import { notFoundError } from '@/errors';
import { hotelsRouter } from '@/routers';
import { Hotel } from "@prisma/client";

async function getAllHotels(): Promise<Hotel[]> {
  const hotels = await hotelsRepository.getAll();
  if(!hotels) throw notFoundError();
  return hotels;
}

type HotelRooms = Hotel & {
    id: number,
    name: string,
    capacity: number,
    hotelId: number,
    createdAt: Date,
    updatedAt: Date
  }

async function getHotelRooms(hotelId: number): Promise<HotelRooms> {
  const hotelRooms = await hotelsRepository.getSpecific(hotelId);
  if(!hotelRooms) throw notFoundError();
  return hotelRooms;
}
