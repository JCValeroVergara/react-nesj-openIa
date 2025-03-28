

import { useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxSelect, GptMessageAudio } from '../../components';
import { textToAudioUseCase } from '../../../core/use-cases/text-to-audio.use-case';



const voices = [
    { id: 'nova', text: 'Nova' },
    { id: 'alloy', text: 'Alloy' },
    { id: 'echo', text: 'Echo' },
    { id: 'fable', text: 'Fable' },
    { id: 'onyx', text: 'Onyx' },
    { id: 'shimmer', text: 'Shimmer' },
];

interface TextMessage {
    text: string;
    isGpt: boolean;
    type: 'text';
}

interface AudioMessage {
    text: string;
    isGpt: boolean;
    audio: string;
    type: 'audio';
}

type Message = TextMessage | AudioMessage;


export const TextToAudioPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePost = async (text: string, selectedVoice: string) => {
        setIsLoading(true);
        setMessages((prevMessages) => [...prevMessages, { text: text, isGpt: false, type: 'text' }]);

        
        const { ok, message, audioUrl } = await textToAudioUseCase(text, selectedVoice);

        setIsLoading(false);

        if (!ok) return;
        setMessages((prevMessages) => [...prevMessages, { text: `${ selectedVoice} - ${ message }`, isGpt: true, audio: audioUrl!, type: 'audio' }]);



        //TODO: Añadir el mensaje de respuesta Gpt true
    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className=" grid grid-cols-12 gap-2">

                     {/* Bienvenida */}
                    <GptMessage text='Hola, soy tu asistente de voz con AI. ¿En qué puedo ayudarte hoy?' />

                    {
                        messages.map((message, index) => (
                            message.isGpt ? (
                                message.type === 'audio' ? (
                                    <GptMessageAudio key={index} text={message.text} audio={message.audio} />
                                ) : (
                                    <MyMessage key={index} text={message.text} />
                                )
                            ) : (
                                <MyMessage key={index} text={message.text} />
                            )
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
                <TextMessageBoxSelect
                    onSendMessage={handlePost}
                    placeholder="Escribe tu texto aquí"
                    options={voices}
                />
        </div>
    )
}