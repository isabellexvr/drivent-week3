import { notFoundError } from "@/errors";
import { Hotel } from "@prisma/client";
import hotelsRepository from "@/repositories/hotels-repository";
import { paymentRequiredError } from "@/errors/payment-required-error";

async function getAllHotels(userId: number): Promise<Hotel[]> {
  await checkEnrollment(userId);
  const hotels = await hotelsRepository.getAll();
  if(!hotels) throw notFoundError();
  return hotels;
}

async function getHotelRooms(hotelId: number, userId: number) {
  await checkEnrollment(userId);
  const hotelRooms = await hotelsRepository.getSpecificWithRooms(hotelId);
  if(!hotelRooms) throw notFoundError();
  return hotelRooms;
}

async function checkEnrollment(userId: number) {
  const user = await hotelsRepository.getEnrolledUser(userId);
  if(!user) throw notFoundError();
  if( user.Ticket[0].status === "RESERVED" || user.Ticket[0].TicketType.isRemote || !user.Ticket[0].TicketType.includesHotel ) throw paymentRequiredError();
}

const hotelsService = {
  getAllHotels,
  getHotelRooms
};

export default hotelsService;
