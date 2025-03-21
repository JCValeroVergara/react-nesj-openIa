import { useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';
import { prosConsUseCase } from '../../../core';


interface Message {
    text: string;
    isGpt: boolean;
}


export const ProsConsPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePost = async( text: string ) => {

        setIsLoading(true);
        setMessages( (prev) => [...prev, { text: text, isGpt: false }] );

        //TODO: UseCase
        const { ok, content } = await prosConsUseCase( text );
        setIsLoading(false);

        if ( !ok ) return;


        setMessages( (prev) => [...prev, { text: content, isGpt: true }] );

    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className=" grid grid-cols-12 gap-2">

                     {/* Bienvenida */}
                    <GptMessage text='Hola, puedes escribir tu pregunta aquí y te ayudaré a encontrar los pros y contras de tu pregunta.' />

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
                    onSendMessage={handlePost}
                    placeholder="Escribe aquí lo que quieras saber"
                    dissabledCorrections={true} 
                />
        </div>
    )
}