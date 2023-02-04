import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }
  let hotel = await prisma.hotel.findFirst();
  if (!hotel) {
    hotel = await prisma.hotel.create({
      data: {
        id: 1,
        name: "Plaza Drivent",
        image: "https://img.freepik.com/vetores-gratis/fundo-de-fachada-plana-hotel_23-2148157379.jpg?w=2000"
      },
    });
    await prisma.room.createMany({
      data: [
        {
        id: 1,
        name: "Quarto 1",
        capacity: 4,
        hotelId: 1
      },
      {
        id: 2,
        name: "Quarto 2",
        capacity: 3,
        hotelId: 1
      }
    ]
    })
  }

  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
