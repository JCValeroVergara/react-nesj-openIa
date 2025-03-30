

import { useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxFile } from '../../components';
import { audioToTextUseCase } from '../../../core';

interface Message {
    text: string;
    isGpt: boolean;
}


export const AudioToTextPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePost = async(text: string, audioFile: File) => {
        setIsLoading(true);
        setMessages((prevMessages) => [...prevMessages, { text: text, isGpt: false }]);

        //TODO: Use case to call the API
        const response = await audioToTextUseCase(audioFile, text)
        setIsLoading(false);

        if (!response) {
            setIsLoading(false);
            setMessages((prev) => [
                ...prev,
                { text: "Error: No se pudo obtener una respuesta válida.", isGpt: true }
            ]);
            return;
        }

        const gptMessage = `
## Transcripción:
__Duración:__ ${ Math.round( response.duration )  } segundos
## El texto es:
${ response.text }
`


        setMessages( (prev) => [
            ...prev,
            { text: gptMessage, isGpt: true }
        ]);

    for( const segment of response.segments ) {
        const segmentMessage = `
__De ${ Math.round( segment.start ) } a ${ Math.round( segment.end ) } segundos:__
${ segment.text }
`

        setMessages( (prev) => [
            ...prev,
            { text: segmentMessage, isGpt: true }
        ]);
        }
    }
    

    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className=" grid grid-cols-12 gap-2">

                     {/* Bienvenida */}
                    <GptMessage text='Hola, que audio quieres convertir a texto?' />

                    {
                        messages.map((message, index) => (
                            message.isGpt
                                ? <GptMessage key={index} text={message.text} />
                                : <MyMessage key={index} text={message.text} />
                        ))
                    }
    
                {/* Loader */}
                {isLoading &&(
                    <div className=" col-start-1 col-end-12">
                        <TypingLoader className="fade-in"/>
                    </div>
                )}
            </div>
            </div>
                <TextMessageBoxFile
                    onSendMessage={handlePost}
                    placeholder="Escribe tu texto aquí"
                    dissabledCorrections={true} 
                    aceptedFiles = "audio/*"
                />
        </div>
    )
}