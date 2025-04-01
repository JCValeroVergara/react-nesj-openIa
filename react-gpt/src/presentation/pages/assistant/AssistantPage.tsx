import { useEffect, useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';
import { createThreadUseCase, postQuestionUseCase } from '../../../core';



interface Message {
    text: string;
    isGpt: boolean;
}

export const AssistantPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const [threadId, setThreadId] = useState<string>();


    useEffect(() => {
        const threadId = localStorage.getItem('threadId');
        if (threadId) {
            setThreadId(threadId);
        } else {
            createThreadUseCase()
                .then( id => {
                    setThreadId(id);
                    localStorage.setItem('threadId', id);
                })
        }
    }, []);

    useEffect(() => {
        if (threadId) {
            setMessages((prevMessages) => [ ...prevMessages, { text:`Número de thread ${threadId}`, isGpt: true }]);
        }
    }, [threadId]);


    const handlePost = async (text: string) => {

        if( !threadId ) return;

        setIsLoading(true);
        setMessages((prevMessages) => [...prevMessages, { text: text, isGpt: false }]);

        //TODO: Use case to call the API

        const replies = await postQuestionUseCase(threadId, text)

        setIsLoading(false);

        //TODO: Añadir el mensaje de respuesta Gpt true

        for( const reply of replies ) {
            for (const message of reply.content) {
                setMessages((prevMessages) => [...prevMessages, { text: message, isGpt: ( reply.role === 'assistant'), info: reply }]);
            }
        }
    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className=" grid grid-cols-12 gap-2">

                     {/* Bienvenida */}
                    <GptMessage text='Hola, soy tu asistente virtual Sam. ¿En qué puedo ayudarte hoy?'/>

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
                    placeholder="Escribe tu texto aquí"
                    dissabledCorrections={true} 
                />
        </div>
    )
}