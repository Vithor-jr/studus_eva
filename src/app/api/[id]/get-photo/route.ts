import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id =  (await params).id

  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      console.error('Token não encontrado');
      throw new Error('Token não encontrado');
    }

    console.log('Token encontrado:', token);

    const apiUrl = `https://${process.env.API_URL}/user/${userId}/photo-url`;
    console.log('Fazendo requisição para:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na requisição:', errorText);
      throw new Error('Erro ao obter foto do usuário');
    }

    const photoUsuario = await response.json();
    console.log('Resposta da API externa:', photoUsuario);

    return NextResponse.json(photoUsuario);
  } catch (error) {
    console.error('Erro no servidor:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}