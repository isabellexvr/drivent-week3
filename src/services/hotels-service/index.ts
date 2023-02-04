import { notFoundError } from "@/errors";
import { Hotel } from "@prisma/client";
import hotelsRepository from "@/repositories/hotels-repository";

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

async function getHotelRooms(hotelId: number) {
  const hotelRooms = await hotelsRepository.getSpecific(hotelId);
  if(!hotelRooms) throw notFoundError();
  return hotelRooms;
}

const hotelsService = {
  getAllHotels,
  getHotelRooms
};

export default hotelsService;
