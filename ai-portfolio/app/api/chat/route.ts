import { NextResponse } from "next/server";
import OpenAI from "openai";
import { profile } from "@/data/profile";

const client = new OpenAI({
  apiKey: process.env.YA_API_KEY,
	baseURL: process.env.AGENT_URL,
	defaultHeaders: {
		'OpenAI-Project': process.env.AGENT_ID
	}
});

const allowedKeywords = [
  "опыт",
  "проект",
  "проекты",
  "стек",
  "технологии",
  "навыки",
  "резюме",
  "вакансия",
  "портфолио",
  "кандидат",
  "контакты",
  "github",
  "telegram",
  "email",
  "ai",
  "ии",
  "llm",
  "frontend",
  "backend",
  "react",
  "next",
  "typescript",
];

function isRelevantQuestion(message: string) {
  const normalized = message.toLowerCase();

  return allowedKeywords.some((keyword) =>
    normalized.includes(keyword.toLowerCase())
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { answer: "Напиши вопрос о кандидате, его опыте или проектах." },
        { status: 400 }
      );
    }

    if (!isRelevantQuestion(message)) {
      return NextResponse.json({
        answer:
          "Я могу отвечать только на вопросы о кандидате, его опыте, проектах, навыках и релевантности вакансии.",
      });
    }

    const context = JSON.stringify(profile, null, 2);

    const response = await client.responses.create({
      prompt: {
        id: 'fvt9fcm10n88dhtbgqc9'
      },
      input: `
      Контекст о кандидате:
      ${context}

      Вопрос пользователя:
      ${message}
      `,
    });

    console.log(response.output_text);

    return NextResponse.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        answer:
          "Произошла ошибка при обращении к AI. Попробуй ещё раз позже.",
      },
      { status: 500 }
    );
  }
}