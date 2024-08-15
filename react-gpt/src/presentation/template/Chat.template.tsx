import { useState } from "react";
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../components"

interface Message {
    text: string;
    isGpt: boolean;
}


export const ChatTemplate = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePostMessage = (message: string) => {
        setIsLoading(true);
        setMessages((prevMessages) => [...prevMessages, { text: message, isGpt: false }]);

        //TODO: Use case to call the API

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
                <TextMessageBox
                    onSendMessage={handlePostMessage}
                    placeholder="Escribe tu texto aquí"
                    dissabledCorrections={true} 
                />
        </div>
    )
}