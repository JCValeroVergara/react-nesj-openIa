import { useState } from "react";
import { GptMessage, GptOrtographyMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { orthographyUseCase } from '../../../core';

interface Message {
    text: string;
    isGpt: boolean;
    info?: {
        userScore: number;
        errors: string[];
        message: string;
    };
}


export const OrthographyPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePostMessage = async(text: string) => {
        setIsLoading(true);
        setMessages((prevMessages) => [...prevMessages, { text: text, isGpt: false }]);

        const { ok, errors, message, userScore } = await orthographyUseCase(text);
        if (!ok) {
            setMessages((prevMessages) => [...prevMessages, { text: 'No se puedo realizar la corrección', isGpt: true }]);
        } else {
            setMessages((prevMessages) => [...prevMessages, { text: message, isGpt: true, info: { userScore, errors, message } }]);
        }

        setIsLoading(false);

        //TODO: Añadir el mensaje de respuesta Gpt true
    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className=" grid grid-cols-12 gap-2">

                     {/* Bienvenida */}
                    <GptMessage text='Hola, puedes escribir tu texto en español, y te ayudo con las correcciones' />

                    {
                        messages.map((message, index) => (
                            message.isGpt
                                ? <GptOrtographyMessage key={index} errors={message.info!.errors} message={ message.info!.message} userScore={message.info!.userScore} />
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
                    onSendMessage={handlePostMessage}
                    placeholder="Escribe tu texto aquí"
                    dissabledCorrections={true} 
                />
        </div>
    )
}