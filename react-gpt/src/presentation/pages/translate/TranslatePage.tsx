
import { useState } from "react";
import { GptMessage, MyMessage, TextMessageBoxSelect, TypingLoader } from '../../components';
import { translateTextUseCase } from '../../../core';


interface Message {
    text: string;
    isGpt: boolean;
}


const languages = [
    { id: 'alemán', text: 'Alemán' },
    { id: 'árabe', text: 'Árabe' },
    { id: 'bengalí', text: 'Bengalí' },
    { id: 'francés', text: 'Francés' },
    { id: 'hindi', text: 'Hindi' },
    { id: 'inglés', text: 'Inglés' },
    { id: 'japonés', text: 'Japonés' },
    { id: 'mandarín', text: 'Mandarín' },
    { id: 'portugués', text: 'Portugués' },
    { id: 'ruso', text: 'Ruso' },
];


export const TranslatePage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePost =async (text: string, selectedOption: string) => {
        setIsLoading(true);

        const newMessage = `Traduce: "${text}" al idioma ${selectedOption}`;

        setMessages((prevMessages) => [...prevMessages, { text: newMessage, isGpt: false }]);

        const { ok, message } = await translateTextUseCase(text, selectedOption);

        setIsLoading(false);

        if (!ok) {
            return alert(message);
        }

        setMessages((prevMessages) => [...prevMessages, { text: message, isGpt: true }]);
    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className=" grid grid-cols-12 gap-2">

                     {/* Bienvenida */}
                    <GptMessage text='¡Hola! Soy un traductor automático. ¿En qué puedo ayudarte?' />

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
                <TextMessageBoxSelect
                    onSendMessage={handlePost}
                    placeholder="Escribe tu texto aquí"
                    options={languages}
                />
        </div>
    )
}