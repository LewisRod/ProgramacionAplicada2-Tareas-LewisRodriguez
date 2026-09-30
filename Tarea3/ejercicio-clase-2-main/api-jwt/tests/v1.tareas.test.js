import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/db.js";

beforeEach(async () => {
  await prisma.tarea.deleteMany()
  await prisma.usuario.deleteMany()
});

describe("GET /v1/tareas", () => {
  it("si la api key es valida obtener api key valida", async () => {
    const res = await request(app)
      .get("/v1/tareas")
      .set("x-api-key", process.env.API_KEY);

    expect(res.statusCode).toBe(200);
  })

  it("sino tiene api key debe rechazar la peticion", async () => {
    const res = await request(app).get("/v1/tareas");
    expect(res.statusCode).toBe(401)
  })

  it("si tiene la api key incorrecta tiene que rechazar la peticion", async () => {
    const res = await request(app)
      .get("/v1/tareas")
      .set("x-api-key", "api-key-falsa");

    expect(res.statusCode).toBe(401);
  })
})

describe("POST /v1/tareas", () => {
it("crea una tarea", async () => {
  const usuario = await request(app).post("/auth/registro").send({
    nombre: "Usuario V1",email: "usuario-v1@correo.com",password: "123456"
  })

  const res = await request(app)
    .post("/v1/tareas")
    .set("x-api-key", process.env.API_KEY)
    .send({
      titulo: "prueba99",
      usuarioId: usuario.body.id,
    });

  expect(usuario.statusCode).toBe(201);
  expect(res.statusCode).toBe(201);
})

  it("rechazar una tarea sin titulo", async () => {
    const res = await request(app)
      .post("/v1/tareas")
      .set("x-api-key", process.env.API_KEY)
      .send({
        usuarioId: 1,
      })

    expect(res.statusCode).toBe(400)
  })

  it("rechazar la peticion que no tenga api key", async () => {
    const res = await request(app).post("/v1/tareas").send({
      titulo: "probar",usuarioId: 1
    });

    expect(res.statusCode).toBe(401);
  })
})
