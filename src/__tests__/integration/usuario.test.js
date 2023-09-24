const request = require('supertest')
const { app, http, db } = require('../../app')
let server

describe('Pruebas de usuario', () => {
    beforeAll(() => {
        server = http.listen(3002)
    })

    afterAll(async () => {
        await db.sequelize.close()
        server.close()
    })

    test('iniciar sesión y acceder con autenticación', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'John', password: '12345' })

        const token = res.body.token

        const res2 = await request(app)
            .get('/api/mesas')
            .set('Authorization', `Bearer ${token}`)

        expect(res2.statusCode).toEqual(200)
    })
})
