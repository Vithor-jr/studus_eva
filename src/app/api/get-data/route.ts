import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      console.error('Token não encontrado');
      throw new Error('Token não encontrado');
    }

    console.log('Token encontrado:', token);

    const apiUrl = `https://${process.env.API_URL}/user/dados`;
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
      throw new Error('Erro ao obter dados do usuário');
    }

    const dadosUsuario = await response.json();
    console.log('Dados do usuário:', dadosUsuario);

    return NextResponse.json(dadosUsuario);
  } catch (error) {
    console.error('Erro no servidor:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}