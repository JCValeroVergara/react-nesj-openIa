import OpenAI from 'openai';

interface Options {
    threadId: string;
    runId: string;
}


export const checkCompleteStatusUseCase = async (openai: OpenAI, options: Options) => {
    
    const { threadId, runId } = options;

    const runStatus = await openai.beta.threads.runs.retrieve(
        threadId,
        runId,
    )

    if( runStatus.status === 'completed' ) {
        return runStatus;
    }

    // esperar 1.5 segundos antes de verificar novamente
    await new Promise(resolve => setTimeout(resolve, 1500));

    return await checkCompleteStatusUseCase(openai, options);

}