import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const openai_main = async (prompt,instruction) =>{
    const response = await client.responses.create({
        model: 'gpt-4.1-mini',
        instructions: instruction,
        input: prompt
    });
    return response.output_text;
}