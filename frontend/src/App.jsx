import { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input })
    });

    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className="app">
      <h1>Iqra Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button type="submit">Ask</button>
      </form>
      <div className="response">{response}</div>
    </div>
  );
}

export default App;
