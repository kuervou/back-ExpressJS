/* eslint-disable no-console */
const request = require('supertest')
const { app } = require('../../app')
const clienteService = require('../../services/clienteService.js')
const { generateTokenForTesting } = require('../utils')

// Mocks
// eslint-disable-next-line no-undef
const ClienteMock = {
    nombre: 'John',
    apellido: 'Doe',
    telefono: '123456789',
    cuenta: 100,
    toJSON: function () {
        return {
            nombre: this.nombre,
            apellido: this.apellido,
            telefono: this.telefono,
            cuenta: this.cuenta,
        }
    },
}

clienteService.getClientes = jest.fn().mockResolvedValue([ClienteMock.toJSON()])
clienteService.getClienteById = jest.fn((id) => {
    if (id === '1') {
        return Promise.resolve(ClienteMock.toJSON())
    } else {
        return Promise.resolve(null)
    }
})
clienteService.crearCliente = jest.fn().mockResolvedValue(true)
clienteService.updateCliente = jest.fn().mockResolvedValue([1]) // Suponemos que retorna el número de registros actualizados
clienteService.deleteCliente = jest.fn().mockResolvedValue(1) // Suponemos que retorna el número de registros eliminados

describe('clienteController Tests', () => {
    let authToken

    // Esto se ejecutará antes de cada prueba
    beforeEach(() => {
        authToken = `Bearer ${generateTokenForTesting()}`
    })

    // Test para getClientes
    it('should return a list of clients', async () => {
        const res = await request(app)
            .get('/api/clientes')
            .set('Authorization', authToken)
        expect(res.statusCode).toEqual(200)

        expect(res.body).toEqual([ClienteMock.toJSON()])
    })

    // Test para getClienteById
    it('should return a client by ID', async () => {
        const res = await request(app)
            .get('/api/clientes/1')
            .set('Authorization', authToken)
        expect(res.statusCode).toEqual(200)

        expect(res.body).toEqual(ClienteMock.toJSON())
    })

    it('should return 404 if client is not found by ID', async () => {
        const res = await request(app)
            .get('/api/clientes/2')
            .set('Authorization', authToken)
        expect(res.statusCode).toEqual(404)
    })

    // Test para crearCliente
    it('should create a client', async () => {
        const res = await request(app)
            .post('/api/clientes')
            .set('Authorization', authToken)
            .send({
                nombre: 'John',
                apellido: 'Does',
                telefono: '123456789',
            })
        expect(res.statusCode).toEqual(201)
        expect(res.body.message).toEqual('Cliente creado')
    })

    // Test para updateCliente
    it('should update a client', async () => {
        const res = await request(app)
            .put('/api/clientes/1')
            .set('Authorization', authToken)
            .send({
                nombre: 'John',
                apellido: 'Doe Updated',
                telefono: '123456789',
                cuenta: 200,
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual('Cliente actualizado')
    })

    it('should return 404 if client to update is not found', async () => {
        clienteService.updateCliente.mockResolvedValue([0])
        const res = await request(app)
            .put('/api/clientes/2')
            .set('Authorization', authToken)
            .send({
                nombre: 'John',
                apellido: 'Doe Updated',
                telefono: '123456789',
                cuenta: 200,
            })
        expect(res.statusCode).toEqual(404)
    })

    // Test para deleteCliente
    it('should delete a client', async () => {
        const res = await request(app)
            .delete('/api/clientes/1')
            .set('Authorization', authToken)
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual('Cliente eliminado')
    })

    it('should return 404 if client to delete is not found', async () => {
        clienteService.deleteCliente.mockResolvedValue(0)
        const res = await request(app)
            .delete('/api/clientes/2')
            .set('Authorization', authToken)
        expect(res.statusCode).toEqual(404)
    })
})
