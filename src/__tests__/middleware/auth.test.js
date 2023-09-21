const authMiddleware = require('../../middleware/auth');
const jwt = require('jsonwebtoken');

describe('Auth middleware', () => {
    it('verifica el token de autenticación y establece req.user', () => {
      // Crear objetos de solicitud y respuesta simulados
      const mockReq = {
        header: jest.fn().mockReturnValue('Bearer some_token_here')
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      const mockNext = jest.fn();
  
      // Simular la función verify de jwt para que devuelva un payload fijo
      jest.spyOn(jwt, 'verify').mockReturnValue({ some: 'payload' });
  
      // Llama al middleware
      authMiddleware(mockReq, mockRes, mockNext);
  
      // Verificar si el middleware funciona como se esperaba
      expect(mockReq.user).toEqual({ some: 'payload' });
      expect(mockNext).toHaveBeenCalled();
    });
  });

