import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: Request, {params}: {params: Promise<{id: string}>}) {
  try {
    const id = (await params).id

    const userId = parseInt(id, 10)

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }

    const response = await fetch(`https://${process.env.API_URL}/conversations/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar conversas');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
