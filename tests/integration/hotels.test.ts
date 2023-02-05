import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import app, { init } from "@/app";
import { createUser } from "../factories";
import * as jwt from "jsonwebtoken";
import { cleanDb, generateValidToken } from "../helpers";
import { generateCPF, getStates } from "@brazilian-utils/brazilian-utils";
import { prisma } from "@/config";
import dayjs from "dayjs";

const server = supertest(app);

beforeAll(async () => {
  await init();
  await prisma.hotel.createMany({
    data: [
      {
        id: 1,
        name: "Plaza Driven.t",
        image: "https://thumbs.dreamstime.com/b/hotel-sign-16711677.jpg",
        updatedAt: dayjs().toDate()
      },
      {
        id: 2,
        name: "Another Hotel",
        image: "https://thumbs.dreamstime.com/b/hotel-sign-16711677.jpg",
        updatedAt: dayjs().toDate()
      }
    ]
  });
  await prisma.room.createMany({
    data: [
      {
        id: 1,
        name: "Quarto 01",
        capacity: 3,
        hotelId: 1,
        updatedAt: dayjs().toDate()
      },
      {
        id: 2,
        name: "Quarto Principal",
        capacity: 4,
        hotelId: 2,
        updatedAt: dayjs().toDate()
      },
      {
        id: 3,
        name: "Quarto 02",
        capacity: 5,
        hotelId: 1,
        updatedAt: dayjs().toDate()
      }
    ]
  });
  await prisma.ticketType.createMany({
    data: [
      {
        id: 1,
        name: "Tipo Presencial com Hotel",
        price: 200,
        isRemote: false,
        includesHotel: true,
        updatedAt: dayjs().toDate()
      },
      {
        id: 1,
        name: "Tipo Presencial sem Hotel",
        price: 200,
        isRemote: false,
        includesHotel: false,
        updatedAt: dayjs().toDate()
      },
      {
        id: 1,
        name: "Tipo Remoto sem Hotel",
        price: 200,
        isRemote: true,
        includesHotel: false,
        updatedAt: dayjs().toDate()
      }
    ]
  });
});

afterAll(async () => {
  await cleanDb();
});



describe("GET /hotels", async () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  const token = await generateValidToken();

  it("should respond with status 404 if there are no hotels on database or user is not enrolled", async () => {
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
  });

  it("should respond with status 402 if there is an enrollment, but there's no ticket", async () => {
    await server.post("/enrollments").set("Authorization", `Bearer ${token}`).send({ 
      name: faker.name.findName(), cpf: generateCPF(),
      birthday: faker.date.past().toISOString(),
      phone: "(21) 98999-9999",
      address: {
        cep: "90830-563",
        street: faker.address.streetName(),
        city: faker.address.city(),
        number: faker.datatype.number().toString(),
        state: faker.helpers.arrayElement(getStates()).code,
        neighborhood: faker.address.secondaryAddress(),
        addressDetail: faker.lorem.sentence(),
      },
    });
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(402);
  });

  it("should respond with status 402 if there's a ticket, but it is not paiyed yet", async () => {  
    await server.post("/tickets").send({ ticketTypeId: 1 });
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(402);
  });

  it("should respond with status 200 and array of hotels if valid token, enrollment exists, ticket exists and it's paied.", async () => {
    await server.post("/payments/process").send({
      ticketId: 1,
      cardData: {
        issuer: "VISA",
        number: "2343234534431",
        expirationDate: "2029-02-05T18:58:47.473Z",
        cvv: 234
      }
    });
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          image: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      ])
    );
  });
}); 

describe("GET /hotels/:hotelId", async () => {

})