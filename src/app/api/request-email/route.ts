import { NextResponse } from "next/server";

export async function POST(req: Request){
	try {
		const body = await req.json();

		const apiResponse = await fetch('https://auth-api-delta.vercel.app/request-password-reset', {
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
		return NextResponse.json(data, { status: apiResponse.status });

	} catch (error) {
		return NextResponse.json({ error: `Erro ao conectar com a API: ${error}` }, { status: 500 });
	}
}