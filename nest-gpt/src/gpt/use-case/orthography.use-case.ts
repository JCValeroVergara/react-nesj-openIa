import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const orthographyCheckUseCase = async( openai:OpenAI, options: Options) => {

    const { prompt } = options;

    const completion = await openai.chat.completions.create({
        messages: [
            {
            role: "system", 
            content: "Eres un asistente muy útil" 
            },
            {
            role: "user",
            content: prompt
            }
        ],
        model: "gpt-4o-mini",
    });

    return completion.choices[0];

}