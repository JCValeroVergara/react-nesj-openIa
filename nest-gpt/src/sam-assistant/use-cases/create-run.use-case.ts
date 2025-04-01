import OpenAI from 'openai';

interface Options {
    threadId: string;
    assistanId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
    const { threadId, assistanId = process.env.ASSISTANT_ID } = options;

    const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistanId,
    });

    return run;
}