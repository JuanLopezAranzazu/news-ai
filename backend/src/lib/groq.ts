import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  console.warn("[groq] GROQ_API_KEY no está definido. Las llamadas a la IA fallarán.");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
