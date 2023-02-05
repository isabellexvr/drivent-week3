import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotels = await hotelsService.getAllHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    console.log(error)
    if(error.name === "paymentRequiredError") return res.status(402).send(error.message);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;
  try {
    const hotel = await hotelsService.getHotelRooms(Number(hotelId), userId);
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if(error.name === "paymentRequiredError") return res.status(402).send(error.message);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
