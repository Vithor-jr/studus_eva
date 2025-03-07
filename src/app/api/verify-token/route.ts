import { NextResponse } from 'next/server';
import { verifyToken } from '@/functions/verifyToken';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
				
    if (!token) {
      return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    return NextResponse.json({ user, message: 'Autenticado com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao verificar autenticação' }, { status: 500 });
  }
}