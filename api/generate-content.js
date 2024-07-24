import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  runtime: 'edge', // Specifies the Edge runtime
};

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export default async function handler(req) {
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null);
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'POST' },
    });
  }

  const { prompt } = await req.json();

  const encoder = new TextEncoder();

  // const { prompt } = req.body;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // const stream = await model.generateContentStream(prompt);
  // const response = await result.response;
  // const text = response.text();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(prompt);
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: chunkText })}\n\n`)
          );
        }
      } catch (err) {
        console.error(err);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: 'An error occurred' })}\n\n`
          )
        );
      }
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
