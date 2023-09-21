const request = require('supertest');
const { app, http, db } = require('../../app');
let server;

describe('Tests de usuarios', () => {
  
  // Antes de todas las pruebas, inicia el servidor
  beforeAll(() => {
    server = http.listen(3001);
  });

  // Cerrar el servidor y la base de datos después de todas las pruebas
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test('crear un nuevo usuario a través de la API', async () => {
    const res = await request(http)
      .post('/api/usuario')
      .send({ username: 'Johncito', email: 'johncito@email.com', password: 'jhon12345' });

    expect(res.statusCode).toEqual(201);
  });
});
