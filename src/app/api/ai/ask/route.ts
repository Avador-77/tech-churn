import { NextResponse } from 'next/server';

const GEMINI_MODELS = [
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
];

export async function POST(req: Request) {
  try {
    const { articleTitle, articleSummary, articleContent, category, question } = await req.json();

    if (!question || !articleTitle) {
      return NextResponse.json(
        { error: 'Missing required parameters: question and articleTitle' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (apiKey && !apiKey.includes('your_gemini_api_key')) {
      // Try active Gemini models in sequence
      for (const model of GEMINI_MODELS) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `You are TechChurn AI, an expert technology assistant. Answer the user's specific question directly, concisely, and naturally based on the article provided.

ARTICLE DETAILS:
Title: ${articleTitle}
Category: ${category}
Summary: ${articleSummary}
Content: ${articleContent}

USER'S SPECIFIC QUESTION: ${question}

INSTRUCTIONS:
1. Directly answer the user's question using information from the article.
2. Speak in a warm, conversational, friendly tone.
3. DO NOT use markdown header tags (### or ##) or bullet symbols (* or -).
4. Keep the answer clear and easy to read.`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  maxOutputTokens: 800,
                  temperature: 0.3,
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            let replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (replyText) {
              // Strip raw markdown headers and asterisks
              replyText = replyText.replace(/#{1,6}\s?/g, '').replace(/\*{1,2}/g, '');
              return NextResponse.json({ answer: replyText, source: `gemini-live (${model})` });
            }
          } else {
            const errJson = await response.json().catch(() => null);
            console.warn(`Gemini model ${model} failed with status ${response.status}:`, errJson?.error?.message);
          }
        } catch (modelErr) {
          console.warn(`Gemini fetch error for model ${model}:`, modelErr);
        }
      }
    }

    // Dynamic Context-Aware Fallback Engine (Answers specific questions using article text matching)
    const qLower = question.toLowerCase();
    const contentSentences = articleContent.split(/[\n\.]+/).map((s: string) => s.trim()).filter(Boolean);

    // Find sentences matching user's keywords
    const keywords = qLower.split(/\s+/).filter((w: string) => w.length > 3 && !['what', 'where', 'when', 'which', 'about', 'this', 'that', 'with', 'from', 'have', 'does', 'more', 'tell'].includes(w));
    
    const matchingSentences = contentSentences.filter((sentence: string) => {
      const sLower = sentence.toLowerCase();
      return keywords.some((kw: string) => sLower.includes(kw));
    });

    let responseText = '';

    if (matchingSentences.length > 0) {
      responseText = `Regarding your question about "${question}":\n\n` +
        `${matchingSentences.slice(0, 3).join('. ')}.\n\n` +
        `This directly relates to the main story "${articleTitle}" in ${category}.`;
    } else if (qLower.includes('explain') || qLower.includes('simply') || qLower.includes('what is')) {
      responseText = `Here is a clear breakdown of "${articleTitle}":\n\n` +
        `This story covers key developments in ${category}:\n\n` +
        `${articleSummary}\n\n` +
        `In simple terms, ${articleContent.split('. ')[0]}. This helps solve core bottlenecks in technical performance and scalability.`;
    } else if (qLower.includes('why') || qLower.includes('important') || qLower.includes('significance')) {
      responseText = `This story is important because it addresses major challenges in the ${category} space.\n\n` +
        `Specifically, ${articleSummary} By advancing this, technology teams can build safer, faster, and more scalable solutions.`;
    } else if (qLower.includes('impact') || qLower.includes('effect') || qLower.includes('future')) {
      responseText = `Regarding the real-world impact, we will likely see rapid adoption among tech pioneers in ${category}.\n\n` +
        `Over time, ${articleSummary.replace(/The new|The latest/, 'this advancement')} will influence next-generation standards and systems.`;
    } else {
      responseText = `To answer your question about "${question}":\n\n` +
        `Based on the article "${articleTitle}", ${articleSummary}\n\n` +
        `The story highlights that ${articleContent.slice(0, 260)}...`;
    }

    return NextResponse.json({
      answer: responseText,
      source: 'built-in-context-engine',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error processing AI query';
    console.error('AI ask route error:', err);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
