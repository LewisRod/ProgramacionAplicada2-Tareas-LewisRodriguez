import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/db.js";

beforeEach(async () => {
  await prisma.tarea.deleteMany()
  await prisma.usuario.deleteMany()
})

describe("GET /v2/tareas", () => {
  it("si no tiene token rechazala", async () => {
    const res = await request(app).get("/v2/tareas");

    expect(res.statusCode).toBe(401);
  })

  it("si el token es invalido rechazalo", async () => {
    const res = await request(app)
      .get("/v2/tareas")
      .set("Authorization", "Bearer token-falso")

    expect(res.statusCode).toBe(401)
  })

  it("debe solo mostrar las tareas del usuario", async () => {
    const registro = await request(app).post("/auth/registro").send({
      nombre: "probando11",email: "probando111@correo.com",password: "12345"
    })

    const login = await request(app).post("/auth/login").send({
      email: "probando111@correo.com",password: "12345",
    })

    const token = login.body.token;

    expect(registro.statusCode).toBe(201);
    expect(login.statusCode).toBe(200);
    expect(token).toBeDefined();

    const tarea = await request(app)
      .post("/v2/tareas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        titulo: "Tarea aplicada",
      });

    const res = await request(app)
      .get("/v2/tareas")
      .set("Authorization", `Bearer ${token}`);

    expect(tarea.statusCode).toBe(201);
    expect(res.statusCode).toBe(200);

    expect(
      res.body.every((tarea) => tarea.usuarioId === registro.body.id),
    ).toBe(true);

    expect(res.body[0]).toHaveProperty("titulo", "Tarea aplicada");
  })

  it("todas las tareas para verla un admin", async () => {
    const registro = await request(app).post("/auth/registro").send({
      nombre: "klk00",email: "probando9900@correo.com",password: "12341",rol: "admin"
    })

    const login = await request(app).post("/auth/login").send({
      email: "probando9900@correo.com",password: "12341"
    })

    const token = login.body.token;

    expect(registro.statusCode).toBe(201);
    expect(login.statusCode).toBe(200);
    expect(token).toBeDefined();

    const res = await request(app)
      .get("/v2/tareas")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  })
})



describe("DELETE /v2/tareas/:id", () => {
  it("admin puede eliminar cualquier tarea", async () => {
    const usuario = await request(app).post("/auth/registro").send({
      nombre: "Usu1222",email: "usu22@correo.com",password: "4321"
    })

    const loginUsuario = await request(app).post("/auth/login").send({
      email: "usu22@correo.com",
      password: "4321",
    })

    const tokenUsuario = loginUsuario.body.token

    const tarea = await request(app)
      .post("/v2/tareas")
      .set("Authorization", `Bearer ${tokenUsuario}`)
      .send({
        titulo: "Tarea 44",
      })

    const admin = await request(app).post("/auth/registro").send({
      nombre: "Admin4321",email: "admin4321@correo.com",password: "54321",rol: "admin"
    })

    const loginAdmin = await request(app).post("/auth/login").send({
      email: "admin4321@correo.com",password: "54321"
    })

    const tokenAdmin = loginAdmin.body.token;

    const res = await request(app)
      .delete(`/v2/tareas/${tarea.body.id}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(usuario.statusCode).toBe(201);
    expect(admin.statusCode).toBe(201);
    expect(tarea.statusCode).toBe(201);
    expect(loginAdmin.statusCode).toBe(200);
    expect(res.statusCode).toBe(200);
  })

  it("usuario solo elimina su propia tarea", async () => {
    const usuario = await request(app).post("/auth/registro").send({
      nombre: "Usuario123",email: "usuario12340@correo.com",password: "123456"
    })

    const login = await request(app).post("/auth/login").send({
      email: "usuario12340@correo.com",password: "123456"
    })

    const token = login.body.token;

    const tarea = await request(app)
      .post("/v2/tareas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        titulo: "Mi tarea22"
      })

    const res = await request(app)
      .delete(`/v2/tareas/${tarea.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(usuario.statusCode).toBe(201);
    expect(login.statusCode).toBe(200);
    expect(tarea.statusCode).toBe(201);
    expect(res.statusCode).toBe(200);
  })
  

  it("debe rechazar al usuario que intenta eliminar una tarea ajena", async () => {
    const usuario1 = await request(app).post("/auth/registro").send({
      nombre: "Usuario Uno",email: "usuario9@correo.com", password: "123456"
    })

    const login1 = await request(app).post("/auth/login").send({
      email: "usuario9@correo.com",password: "123456"
    })

    const token1 = login1.body.token;

    const tarea = await request(app)
      .post("/v2/tareas")
      .set("Authorization", `Bearer ${token1}`)
      .send({
        titulo: "Tarea de usuario Uno",
      })

    const usuario2 = await request(app).post("/auth/registro").send({
      nombre: "Usuario Dos",email: "usuario12@correo.com",password: "123456",
    });

    const login2 = await request(app).post("/auth/login").send({
      email: "usuario12@correo.com",password: "123456"
    });

    const token2 = login2.body.token;

    const res = await request(app)
      .delete(`/v2/tareas/${tarea.body.id}`)
      .set("Authorization", `Bearer ${token2}`)

    expect(usuario1.statusCode).toBe(201)
    expect(usuario2.statusCode).toBe(201)
    expect(tarea.statusCode).toBe(201)
    expect(res.statusCode).toBe(403)
  })


  it("no se elimina una tarea sin token", async () => {
    const res = await request(app).delete("/v2/tareas/1")
    expect(res.statusCode).toBe(401);
  })
})
