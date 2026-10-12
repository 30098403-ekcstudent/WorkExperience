import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (username.trim() === "" || password === "") {
      setMessage("Please enter both your username and password.");
      return;
    }

    fetch("http://localhost:3000/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(async response => {
      const data = await response.text();
      setMessage(data);

      if (response.ok) {
        const userResponse = await fetch("http://localhost:3000/me", {
          credentials: "include"
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          onLogin(userData);
        }
      }
    })
    .catch(() => setMessage("Could not contact the server."));
  }

  return (
    <div className="signbox">
      <h1>Log in</h1>
      <form className="signform" onSubmit={handleSubmit}>
        <label htmlFor="user">Username:</label><br/>
        <input
          className="textbox"
          type="text"
          id="user"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br/>
        <label htmlFor="password">Password:</label><br/>
        <input
          className="textbox"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <button className="button">Log in</button>
      </form>
      <p>{message}</p>
    </div>
  )
}

export default Login