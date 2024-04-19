import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export default async (req, res) => {
  const { prompt } = req.body;

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json(text);
  } catch (error) {
    res.status(500).send({ error: 'failed to fetch data' });
  }
};
