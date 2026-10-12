import { useState } from "react";
function Signup () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [message, setMessage] = useState("");


  async function handleSubmit(e) {
    e.preventDefault();

    const errors = [];

    if (username.trim() === "" || password === "" || confPassword === "") {
      errors.push("Fields cannot be blank.");
    }

    if (password !== confPassword) {
      errors.push("Passwords must be identical.");
    }

    if (username.trim() !== "") {
      try {
        const checkResponse = await fetch("http://localhost:3000/check-username", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username })
        });

        if (!checkResponse.ok) {
          errors.push(await checkResponse.text());
        }
      } catch {
        setMessage("Could not contact the server.");
        return;
      }
    }

    if (errors.length > 0) {
      setMessage(errors.join("\n"));
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.text();
      setMessage(data);
    } catch {
      setMessage("Could not contact the server.");
    }
  }

  return (
    <div className="signbox">
      <h1>Sign up</h1>
      <form className = "signform" onSubmit={handleSubmit}>
        <label htmlFor="user">Username:</label><br/>
        <input className="textbox" type="text" id="user" name="username"
               value={username} onChange={(e) => setUsername(e.target.value)}/><br/>
        <label htmlFor="password">Password:</label><br/>
        <input className="textbox" type="password" id="password" name="password"
               value={password} onChange={(e) => setPassword(e.target.value)}/><br/>
        <label htmlFor="confpassword">Confirm Password:</label><br/>
        <input className="textbox" type="password" id="confpassword" name="confpassword"
        value={confPassword} onChange={(e) => setConfPassword(e.target.value)}/><br/>
        <button className="button" type="submit">Sign Up</button>
      </form>
      <p style={{ whiteSpace: "pre-line" }}>{message}</p>
    </div>
  )
}

export default Signup