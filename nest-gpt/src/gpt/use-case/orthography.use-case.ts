import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const orthographyCheckUseCase = async( ollamaUrl:string, options: Options) => {

    const { prompt } = options;

    const response = await fetch(ollamaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "llama3", // Modelo de Ollama
            prompt: `
            Te serán proveídos textos en español con posibles errores ortográficos y gramaticales.
            Las palabras deben existir en el diccionario de la RAE.
            Debes responder en formato JSON.
            Tu tarea es corregirlos y retornar información sobre las soluciones.
            También debes dar un porcentaje de acierto del usuario.

            Si no hay errores, debes retornar un mensaje de felicitaciones.

            Ejemplo de respuesta:
            {
                "userScore": number,
                "errors": string[], // ['error->corrección']
                "message": string // Usa emojis para dar felicitaciones
            }

            Texto del usuario:
            ${prompt}
            `,
            stream: false
        })
    });

    const jsonResponse = await response.json();

    try {
        // Expresión regular para extraer el contenido JSON
        const jsonMatch = jsonResponse.response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No se encontró un JSON válido en la respuesta.");
        }
    const parsedData = JSON.parse(jsonMatch[0]);

    // Asegurar que la respuesta tiene el rol "system"
    return {
        role: 'system',
        data: parsedData,
    };
    } catch (error) {
        console.error("Error al parsear JSON:", error);
        return { error: "No se pudo interpretar la respuesta de Ollama." };
    }

}