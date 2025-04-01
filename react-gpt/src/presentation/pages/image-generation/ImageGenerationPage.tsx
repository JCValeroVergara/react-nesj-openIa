import { useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, GptMessageImage } from '../../components';
import { imageGenerationUseCase } from '../../../core';



interface Message {
    text: string;
    isGpt: boolean;
    info?: {
        imageUrl?: string;
        alt?: string;
    }
}



export const ImageGenerationPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePost = async (text: string) => {
        setIsLoading(true);
        setMessages((prevMessages) => [...prevMessages, { text: text, isGpt: false }]);

        const imageInfo = await imageGenerationUseCase(text);
        setIsLoading(false);

        if (!imageInfo) {
            return setMessages((prevMessages) => [...prevMessages, { text: "Lo siento, no he podido generar la imagen.", isGpt: true }]);
        }

        setMessages((prevMessages) => [...prevMessages, { text: text, isGpt: true, info:{ imageUrl: imageInfo.url, alt: imageInfo.alt} }]);

        //TODO: Añadir el mensaje de respuesta Gpt true
    }


    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className=" grid grid-cols-12 gap-2">

                     {/* Bienvenida */}
                    <GptMessage text="Hola, soy tu asistente de generación de imágenes. ¿Qué imagen te gustaría crear?" />

                    {
                        messages.map((message, index) => (
                            message.isGpt
                                ? <GptMessageImage key={index} text={message.text} imageUrl={message.info?.imageUrl!} alt={message.info?.alt!} />
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
                <TextMessageBox
                    onSendMessage={handlePost}
                    placeholder="Escribe tu texto aquí"
                    dissabledCorrections={true} 
                />
        </div>
    )
}