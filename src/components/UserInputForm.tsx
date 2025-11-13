import {useState} from 'react';
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
            const response = await fetch(' https://us-central1-fragmeplsdotdev.cloudfunctions.net/submitInput ', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text: sanitized})
            });

            if (!response.ok) console.error(response);

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
