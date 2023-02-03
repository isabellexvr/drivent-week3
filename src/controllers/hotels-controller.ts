import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getAllHotels(_req: Request, res: Response) {
  try {
    const hotels = await hotelsService.getAllHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getHotelRooms(_req: Request, res: Response) {
  const { hotelId } = _req.params;
  try {
    const hotel = await hotelsService.getHotelRooms(hotelId);
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

