import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { downloadAsImagePng, downloadBase64ImageAsPng } from 'src/helpers';



interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
    }

export const imageGenerationUseCase = async (openai: OpenAI, options: Options) => { 
    
    const { prompt, originalImage, maskImage } = options;

    //Todo: check if originalImage and maskImage
    if (!originalImage || !maskImage) {
        const response = await openai.images.generate({
            prompt: prompt,
            model: 'dall-e-3',
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            response_format: 'url',
        });
    
        //Todo: Guardar la imagen en FS
        const fileName = await downloadAsImagePng(response.data[0].url)
        const url = `${ process.env.SERVER_URL }/gpt/image-generation/${fileName}`;
    
        return {
            url: url,
            openAIUrl: response.data[0].url,
            revised_prompt: response.data[0].revised_prompt,
        }
    }

    const pngImagePath = await downloadAsImagePng(originalImage, true);
    const maskPath = await downloadBase64ImageAsPng(maskImage, true);

    const responser = await openai.images.edit({
        model:'dall-e-2',
        prompt: prompt,
        image: fs.createReadStream(pngImagePath),
        mask: fs.createReadStream(maskPath),
        n: 1,
        size: '1024x1024',
        response_format: 'url',
    });

    const fileName = await downloadAsImagePng(responser.data[0].url);
    const publicUrl = `${ process.env.SERVER_URL }/gpt/image-generation/${fileName}`;

    return {
        url: publicUrl,
        openAIUrl: responser.data[0].url,
        revised_prompt: responser.data[0].revised_prompt,
    }


}