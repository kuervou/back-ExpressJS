const { Usuario } = require("../../models");
const { db } = require("../../../config/config");

// Limpieza después de todas las pruebas
afterAll(done => {
  db.end(err => {
    if (err) throw err;
    done();  // Llamar a 'done' para indicar que hemos terminado
  });
});

test('crear un nuevo usuario', async () => {
  const usuario = await Usuario.create({ username: 'John', email: 'john@email.com', password: '12345' });
  expect(usuario.username).toBe('John');
});
