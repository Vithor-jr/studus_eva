import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const apiResponse = await fetch('https://auth-api-delta.vercel.app/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      if (apiResponse.status === 400) {
        return NextResponse.json({ error: `Erro de validação: ${errorText}` }, { status: 400 });
      } else if (apiResponse.status === 401) {
        return NextResponse.json({ error: `Token expirado ou inválido.` }, { status: 401 });
      }
      return NextResponse.json({ error: `Erro ao conectar com a API: ${errorText}` }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: apiResponse.status });

  } catch (error) {

    return NextResponse.json({ error: `Erro ao conectar com a API: ${error}` }, { status: 500 });
  }
}
