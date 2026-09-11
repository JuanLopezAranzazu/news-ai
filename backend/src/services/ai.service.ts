import { groq, GROQ_MODEL } from "@/lib/groq";
import { prisma } from "@/lib/prisma";

interface ClassifyAndSummarizeInput {
  title: string;
  content: string;
  categoryNames: string[];
}

interface ClassifyAndSummarizeOutput {
  summary: string;
  category: string;
}

/**
 * Pide al modelo un resumen breve y una categoría, en un único llamado
 * estructurado como JSON para minimizar latencia y costo.
 */
export async function classifyAndSummarize(
  input: ClassifyAndSummarizeInput
): Promise<ClassifyAndSummarizeOutput> {
  const { title, content, categoryNames } = input;

  const truncatedContent = content.slice(0, 8000);

  const systemPrompt = `Eres un asistente editorial especializado en noticias en español.
Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin markdown, con esta forma exacta:
{"summary": string, "category": string}

Reglas:
- "summary": resumen objetivo de 3 a 5 frases, en español neutro, sin opiniones ni relleno.
- "category": elige EXACTAMENTE una de estas categorías (usa el texto tal cual, sin traducir ni inventar otras): ${categoryNames.join(", ")}.
  Si ninguna aplica claramente, usa "${categoryNames[categoryNames.length - 1] ?? "Mundo"}".`;

  const userPrompt = `Título: ${title}\n\nContenido:\n${truncatedContent}`;

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  let parsed: { summary?: string; category?: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { summary: raw.trim(), category: categoryNames[0] ?? "Mundo" };
  }

  const category = categoryNames.includes(parsed.category ?? "")
    ? (parsed.category as string)
    : categoryNames[categoryNames.length - 1] ?? "Mundo";

  return {
    summary: (parsed.summary ?? "").trim() || "No se pudo generar un resumen.",
    category,
  };
}

/**
 * Genera resumen + categoría para una noticia ya guardada en la base de
 * datos, y persiste ambos resultados (Summary y Category relacionada).
 */
export async function processNewsWithAi(newsId: string) {
  const news = await prisma.news.findUniqueOrThrow({ where: { id: newsId } });
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const categoryNames = categories.map((c) => c.name);

  const { summary, category } = await classifyAndSummarize({
    title: news.title,
    content: news.content,
    categoryNames,
  });

  const matchedCategory = categories.find((c) => c.name === category);

  const [, updatedNews] = await prisma.$transaction([
    prisma.summary.upsert({
      where: { newsId },
      update: { content: summary },
      create: { newsId, content: summary },
    }),
    prisma.news.update({
      where: { id: newsId },
      data: { categoryId: matchedCategory?.id },
      include: { summary: true, category: true, source: true },
    }),
  ]);

  return updatedNews;
}
