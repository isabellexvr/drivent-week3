import { prisma } from "@/config";
import faker from "@faker-js/faker";
import dayjs from "dayjs";
import { Prisma, PrismaPromise } from "@prisma/client";
import { Hotel } from "@prisma/client";

export function createHotel(): Prisma.Prisma__HotelClient<Hotel> {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.abstract(),
      updatedAt: dayjs().toDate()
    }
  });
}

export function createRooms( hotelId: number ): PrismaPromise<Prisma.BatchPayload> {
  return prisma.room.createMany({
    data: [
      {
        name: faker.name.findName(),
        capacity: faker.datatype.number(),
        hotelId,
        updatedAt: dayjs().toDate()
      },
      {
        name: faker.name.findName(),
        capacity: faker.datatype.number(),
        hotelId,
        updatedAt: dayjs().toDate()
      },
      {
        name: faker.name.findName(),
        capacity: faker.datatype.number(),
        hotelId,
        updatedAt: dayjs().toDate()
      }
    ]
  });
}
