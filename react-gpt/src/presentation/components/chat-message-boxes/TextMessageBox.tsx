import { FormEvent, useState } from "react";

interface Props {
    onSendMessage: (message: string) => void;
    placeholder?: string;
    dissabledCorrections?: boolean;
}

export const TextMessageBox = ({onSendMessage, placeholder, dissabledCorrections = false}:Props) => {

    const [message, setMessage] = useState(''); 

    const handleSendMessage = (event:FormEvent<HTMLFormElement>) => {

        if (message.trim().length === 0) return;

        onSendMessage(message);
        setMessage('');

        event.preventDefault();
        console.log('handleSendMessage');
    }

    return (
        <form
            onSubmit={handleSendMessage}
            className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4 "
        >

            <div className="flex-grow">
                <div className="relative w-full">

                    <input
                        type="text"
                        autoFocus
                        name="message"
                        className="flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
                        placeholder={placeholder}
                        autoComplete={ dissabledCorrections ? 'on' : 'off'}
                        autoCorrect={ dissabledCorrections ? 'on' : 'off'}
                        spellCheck={ dissabledCorrections ? true : false}
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        />
                </div>
            </div>

            <div className="ml-4">
                <button 
                    className="btn-primary"
                >
                    <span className="mr-2">Enviar</span>
                    <i className="fa-regular fa-paper-plane"></i>
                </button>
            </div>
        </form>
    )
}