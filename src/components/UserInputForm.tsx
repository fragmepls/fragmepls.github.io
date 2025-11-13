import {useState} from 'react';
import {collection, addDoc, serverTimestamp} from 'firebase/firestore';
import {db} from '../firebase';
import '../styles/UserInputForm.css';

function UserInputForm() {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedInput = input.trim();
        if (!trimmedInput) {
            setStatus('Please enter something');
            return;
        }
        if (trimmedInput.length > 500) {
            setStatus('Message too long (max 500 characters)');
            return;
        }

        const sanitized = trimmedInput.replace(/[<>]/g, '');

        try {
            await addDoc(collection(db, 'userInputs'), {
                text: sanitized,
                timestamp: serverTimestamp()
            });

            setStatus('Sent successfully c:');
            setInput('');
        } catch (error) {
            setStatus('Something went wrong :c');
            console.error(error);
        }
    };

    return (
        <form className="user-input-form" onSubmit={handleSubmit}>
            {status && <p>{status}</p>}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell me something..."
            />
            <button type="submit">Send</button>
        </form>
    );
}

export default UserInputForm;
