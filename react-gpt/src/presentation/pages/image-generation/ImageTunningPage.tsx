
import { useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, GptMessageImage, GptMessageSelectableImage } from '../../components';
import { imageGenerationUseCase, imageVariationUseCase } from '../../../core';



interface Message {
    text: string;
    isGpt: boolean;
    info?: {
        imageUrl?: string;
        alt?: string;
    }
}



export const ImageTunningPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const [originalImageAndMask, setOriginalImageAndMask] = useState({
        original: undefined as string | undefined,
        mask: undefined as string | undefined,
    })
    const handlePost = async (text: string) => {
        setIsLoading(true);
        setMessages((prevMessages) => [...prevMessages, { text: text, isGpt: false }]);

        const { original, mask } = originalImageAndMask;

        const imageInfo = await imageGenerationUseCase(text, original, mask);
        setIsLoading(false);

        if (!imageInfo) {
            return setMessages((prevMessages) => [...prevMessages, { text: "Lo siento, no he podido generar la imagen.", isGpt: true }]);
        }

        setMessages((prevMessages) => [...prevMessages, { text: text, isGpt: true, info:{ imageUrl: imageInfo.url, alt: imageInfo.alt} }]);


        //TODO: Añadir el mensaje de respuesta Gpt true
    }

    
    const handleVariation = async () => { 
        setIsLoading(true);

        const response = await imageVariationUseCase(originalImageAndMask.original!);
        setIsLoading(false);

        if (!response) return;

        setMessages((prevMessages) => [...prevMessages, { text: "Aquí tienes la variación de la imagen", isGpt: true, info:{ imageUrl: response.url, alt: response.alt} }]);
        
    }

    return (
        <>
            {
                originalImageAndMask.original && (
                    <div className='fixed flex flex-col items-center top-10 right-10 z-10 fade-in'>
                        <span>Editando</span>
                        <img src={ originalImageAndMask.mask ?? originalImageAndMask.original} alt="Imegen original" className='boder rounded-xl w-32 h-32 object-contain' />
                        <button
                            className='btn-primary mt-2'
                            onClick={handleVariation}
                        >
                            Generar variación
                        </button>

                    </div>
                )
            }
            <div className="chat-container">
                <div className="chat-messages">
                    <div className=" grid grid-cols-12 gap-2">

                        {/* Bienvenida */}
                        <GptMessage text="Hola, soy tu asistente de generación de imágenes. ¿Qué imagen te gustaría crear?" />

                        {
                            messages.map((message, index) => (
                                message.isGpt
                                // ? <GptMessageImage
                                ? <GptMessageSelectableImage
                                        key={index} text={message.text} imageUrl={message.info?.imageUrl!} alt={message.info?.alt!}
                                        onImageSelected={(maskUrl) => setOriginalImageAndMask({ original: message.info?.imageUrl!, mask: maskUrl })} />
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
        </>
    )
}