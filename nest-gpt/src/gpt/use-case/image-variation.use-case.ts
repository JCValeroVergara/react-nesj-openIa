import OpenAI from 'openai';
import * as fs from 'fs';
import { downloadAsImagePng } from 'src/helpers';


interface Options {
    baseImage: string;
}


export const imageVariationUseCase = async (openai: OpenAI, options: Options) => { 
    const { baseImage } = options;
    
    const pngImagePath = await downloadAsImagePng(baseImage, true);

    const response = await openai.images.createVariation({
        model: 'dall-e-2',
        image: fs.createReadStream(pngImagePath),
        n: 1,
        size: '1024x1024',
        response_format: 'url',
    });

    const newImage = await downloadAsImagePng(response.data[0].url, false);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${newImage}`;

    return {
        url: url,
        openAIUrl: response.data[0].url,
        revise_prompt: response.data[0].revised_prompt,
    }
}