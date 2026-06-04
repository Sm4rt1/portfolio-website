"use client";

import { useState } from "react";

const suggestedQuestions = [
  "Почему кандидат подходит под AI-вакансию?",
  "Какие проекты у кандидата самые релевантные?",
  "С каким стеком он работал?",
  "Расскажи про AI Portfolio Assistant",
  "Какие задачи он может закрывать в команде?",
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAssistant(question?: string) {
    const finalMessage = question || message;

    if (!finalMessage.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: finalMessage }),
      });

      const data = await response.json();
      setAnswer(data.answer);
      setMessage(finalMessage);
    } catch {
      setAnswer("Не получилось получить ответ. Попробуй ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-8 rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-300">
          AI-портфолио под вакансию
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          Спросите AI-помощника обо мне
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-neutral-300">
          Помощник отвечает на вопросы о моём опыте, проектах, навыках,
          технологиях и релевантности AI-вакансии.
        </p>

        <div className="w-full rounded-3xl border border-neutral-800 bg-neutral-900 p-4 shadow-2xl">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") askAssistant();
              }}
              placeholder="Например: почему ты подходишь под эту вакансию?"
              className="flex-1 rounded-2xl border border-neutral-700 bg-neutral-950 px-5 py-4 text-white outline-none placeholder:text-neutral-500 focus:border-neutral-400"
            />

            <button
              onClick={() => askAssistant()}
              disabled={loading}
              className="rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Думаю..." : "Спросить"}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                onClick={() => askAssistant(question)}
                className="rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:border-neutral-400 hover:text-white"
              >
                {question}
              </button>
            ))}
          </div>

          {answer && (
            <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-950 p-5 text-left text-neutral-200">
              <p className="whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>

        <div className="mt-10 grid w-full gap-4 text-left md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
            <h2 className="mb-2 font-semibold">AI-фокус</h2>
            <p className="text-sm text-neutral-400">
              Помощник использует мини-базу знаний и отвечает только по данным
              о кандидате.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
            <h2 className="mb-2 font-semibold">Проекты</h2>
            <p className="text-sm text-neutral-400">
              Опыт раскрывается через задачи, решения, стек и результат.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
            <h2 className="mb-2 font-semibold">Релевантность</h2>
            <p className="text-sm text-neutral-400">
              Сайт показывает, почему опыт подходит именно под AI-вакансию.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}