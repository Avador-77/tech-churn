import { NextResponse } from 'next/server';

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
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
                      text: `You are TechChurn AI, a friendly, conversational, and highly knowledgeable tech assistant. 
Answer the user's question about the following technology article in a warm, natural, and conversational tone.

ARTICLE DETAILS:
Title: ${articleTitle}
Category: ${category}
Summary: ${articleSummary}
Content: ${articleContent}

USER QUESTION: ${question}

IMPORTANT FORMATTING RULES:
1. Speak naturally as a helpful tech expert in clear conversational paragraphs.
2. DO NOT use markdown headers (no ### or ##), bold asterisks (no **), bullet asterisks (no *), or hashtag symbols.
3. Keep the language simple, engaging, and easy to read without raw technical markup symbols.`,
                    },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.4,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          let replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            // Clean up any accidental markdown symbols
            replyText = replyText.replace(/#{1,6}\s?/g, '').replace(/\*{1,2}/g, '');
            return NextResponse.json({ answer: replyText, source: 'gemini-live' });
          }
        }
      } catch (geminiError) {
        console.error('Gemini API call failed, falling back to conversational context engine:', geminiError);
      }
    }

    // Conversational fallback engine (completely clean of ### and * symbols)
    const qLower = question.toLowerCase();
    let responseText = '';

    if (qLower.includes('explain') || qLower.includes('simply') || qLower.includes('what is')) {
      responseText = `Here is a simple breakdown of "${articleTitle}":\n\n` +
        `This story from ${category} is about how ${articleSummary.toLowerCase()}\n\n` +
        `In simple terms, ${articleContent.split('. ')[0]}. This is a big step forward because it helps solve real bottlenecks in performance and practical everyday use.`;
    } else if (qLower.includes('why') || qLower.includes('important') || qLower.includes('significance')) {
      responseText = `This story is really important because it addresses major challenges in the ${category} space.\n\n` +
        `Specifically, ${articleSummary} By making progress here, developers and technology teams can create much faster, safer, and more scalable tools for everyone.`;
    } else if (qLower.includes('impact') || qLower.includes('effect') || qLower.includes('future')) {
      responseText = `In terms of real-world impact, we will likely see early tech adopters jump on this right away in the ${category} industry.\n\n` +
        `Over time, ${articleSummary.replace(/The new|The latest/, 'this innovation')} is expected to set new standards for next-generation hardware and software.`;
    } else if (qLower.includes('remember') || qLower.includes('summary') || qLower.includes('takeaway')) {
      responseText = `Here are the main things to keep in mind about this story:\n\n` +
        `First, the article "${articleTitle}" highlights a major shift in ${category}.\n\n` +
        `Second, the core breakthrough is that ${articleSummary.toLowerCase()}\n\n` +
        `Overall, it shows where the tech industry is heading next!`;
    } else {
      responseText = `That's a great question about "${articleTitle}".\n\n` +
        `Based on the article, ${articleSummary}\n\n` +
        `The story notes that ${articleContent.slice(0, 250)}... It really highlights how fast things are moving in ${category}.`;
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
