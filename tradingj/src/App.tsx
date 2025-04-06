import { useState } from "react";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  // Thay invoke bằng logic giả lập
  async function greet() {
    setGreetMsg(`Hello, ${name}! This is a Next.js app.`);
  }

  return (
    <main className="container">
      <h1>Welcome to Next.js + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
          <img src="/next.svg" className="logo next" alt="Next.js logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          <img src="/react.svg" className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Vite, Next.js, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
    </main>
  );
}

export default App;