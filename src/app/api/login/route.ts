import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiResponse = await fetch(`http://${process.env.API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return NextResponse.json({ error: `Erro ao conectar com a API: ${errorText}` }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    const { access_token } = data;

    const response = NextResponse.json({ message: 'Login realizado com sucesso!' });

    response.cookies.set('token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', 
      path: '/',
      maxAge: 60 * 60 * 24 * 7, 
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: `Erro ao conectar com a API: ${error}` }, { status: 500 });
  }
}
