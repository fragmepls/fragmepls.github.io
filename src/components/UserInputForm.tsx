import {useState} from 'react';
import {collection, addDoc, serverTimestamp} from 'firebase/firestore';
import {db} from '../firebase';
import '../styles/UserInputForm.css';

function UserInputForm() {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'userInputs'), {
                text: input,
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
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell me something..."
            />
            <button type="submit">Submit</button>
            {status && <p>{status}</p>}
        </form>
    );
}

export default UserInputForm;
