import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase } from './use-case';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';

@Injectable()
export class GptService {

    private openai = new OpenAI( {
        apiKey:process.env.OPENAI_API_KEY,
    });

    // private readonly ollamaUrl = process.env.OLLAMA_URL;

    // Solo va a llamar casos de uso

    async orthographyCheck( orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase( this.openai,{ 
            prompt: orthographyDto.prompt
        });
    }

    async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, { prompt });
    
    }
    async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openai, { prompt });
    }
}
