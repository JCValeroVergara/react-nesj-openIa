import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-case';

@Injectable()
export class GptService {

    // Solo va a llamar casos de uso

    async orthographyCheck() {
        return await orthographyCheckUseCase();
    }
}
