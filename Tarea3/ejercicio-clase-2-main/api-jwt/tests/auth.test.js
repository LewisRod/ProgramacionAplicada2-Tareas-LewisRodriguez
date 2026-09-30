import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/db.js"

beforeEach(async () => {
  await prisma.tarea.deleteMany()
  await prisma.usuario.deleteMany()
})

describe("POST /auth/registro", () => {
  it("registrar usuario", async () => {
    const res = await request(app).post("/auth/registro").send({
      nombre: "prueba usuario23",email: "usuario2323@correo.com",password: "2200221"
    })

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("nombre", "prueba usuario23");
    expect(res.body).not.toHaveProperty("password");
  })

  it("rechazar email duplicado", async () => {
    await request(app).post("/auth/registro").send({
      nombre: "Usuario probar",email: "duplicado@correo.com",password: "123456"
    })

    const res = await request(app).post("/auth/registro").send({
      nombre: "Usuario probar",
      email: "duplicado@correo.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
  });

  it("si no tiene email rechazarlo", async () => {
    const res = await request(app).post("/auth/registro").send({
      nombre: "Usuario14",password: "123456",
    });

    expect(res.statusCode).toBe(400);
  })

  it("si no tiene la contraseña rechazarlo", async () => {
    const res = await request(app).post("/auth/registro").send({
      nombre: "Usuario Test",email: "sinpassword@correo.com"
    });

    expect(res.statusCode).toBe(400);
  })
})


describe("POST /auth/login", () => {
  it("inicio sesion correctamente", async () => {
    await request(app).post("/auth/registro").send({
      nombre: "Usuario probar",email: "usu1@correo.com",password: "1234"
    })

    const res = await request(app).post("/auth/login").send({
      email: "usu1@correo.com",
      password: "1234",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  })

  it("contrasena incorrecta rechazar", async () => {
    await request(app).post("/auth/registro").send({
      nombre: "Usuario Password",email: "prueba222@correo.com",password: "1234"
    })

    const res = await request(app).post("/auth/login").send({
      email: "prueba222@correo.com",
      password: "12345",
    });

    expect(res.statusCode).toBe(401);
  })

  it("si existe el gmail rechazalo", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "emailquenoexiste@correo.com",password: "123456"
    })

    expect(res.statusCode).toBe(401);
  })

  it("debe rechazarse si no tiene datos", async () => {
    const res = await request(app).post("/auth/login").send({})
    expect(res.statusCode).toBe(400);
  })
})
