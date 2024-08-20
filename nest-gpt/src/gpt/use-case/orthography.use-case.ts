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
            content: `
            Té serán proveidos textos en español con posible errores ortográficos y gramaticales,
            Las palabras deben existir en el diccionario de la RAE,
            debes responder en formato JSON,
            tu tarea es corregirlos y retornar información soluciones,
            también debes dar un porcentaje de acierto por el usuario.

            si no hay errores, debes retornar un mensaje de felicitaciones.

            Ejemplo de respuesta:
            {
                userScore: number,
                errors: string[], // ['error->corrección']
                message: string, // Usa emojis para dar felicitaciones
            }
            `
            },
            {
            role: "user",
            content: prompt
            }
        ],
        model: "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 150
    });

    return JSON.parse(completion.choices[0].message.content);

}