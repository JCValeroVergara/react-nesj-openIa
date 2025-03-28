import * as path from 'path';
import * as fs from 'fs';

import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, textToAudioUseCase, translateTextUseCase } from './use-case';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';

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

    async translateText({ prompt, lang }: TranslateDto) {
        return await translateTextUseCase(this.openai, { prompt, lang });
    }

    async textToAudio({ prompt, voice }: TextToAudioDto) { 
        return await textToAudioUseCase(this.openai, { prompt, voice });
    }

    async textToAudioGetter(filedId: string) {
        
        const filePath = path.resolve(__dirname, `../../generated/audios`, `${filedId}.mp3`);

        const wasFound = fs.existsSync(filePath);
        if (!wasFound) throw new NotFoundException(`File ${filedId} not found`);

        return filePath;
    }


}
