import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'Aplicação protegida';

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Erro ao verificar o token:', error);
    return null; 
  }
}