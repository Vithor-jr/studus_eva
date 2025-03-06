import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET( req: Request,
  { params }: { params: Promise<{ id: string }>}
) {
  try {
    const token = (await cookies()).get('token')?.value;
    
		if (!token) {
      return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }

    const id =  (await params).id

		const conversationId = parseInt(id, 10);

		if (isNaN(conversationId)) {
			return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
		}


    const apiUrl = `https://${process.env.API_URL}/messages/${conversationId}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const message = await response.json();
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
