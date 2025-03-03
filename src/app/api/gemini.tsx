import { GoogleGenerativeAI } from "@google/generative-ai";

type Gemini = {
  prompt: string;
};

export async function Gemini({prompt}: Gemini) {
  const keyTest = process.env.NEXT_PUBLIC_API_KEY;

  console.log("API: ", keyTest)

  if (!keyTest) {
    throw new Error("Chave de API não encontrada. Verifique seu arquivo .env.");
  }

  console.log("Minha chave de API foi carregada com sucesso.");

  const genAI = new GoogleGenerativeAI(keyTest);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    throw error;
  }
}