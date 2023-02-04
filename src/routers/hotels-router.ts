import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getAllHotels, getHotelRooms } from "@/controllers/hotels-controller";
import { validateParams } from "@/middlewares";
import { hotelIdSchema } from "@/schemas";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getAllHotels)
  .get("/:hotelId", validateParams(hotelIdSchema), getHotelRooms);

export { hotelsRouter };
