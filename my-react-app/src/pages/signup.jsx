import { useState } from "react";
function Signup () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    console.log(username);
    console.log(password);
    console.log(confPassword);

    if (username === "" || password === "" || confPassword === "") {
      setMessage("Fields cannot be blank.")
      console.log("blank field");
      return;
    }
    if (password !== confPassword) {
      setMessage("Passwords must be identical.");
      console.log("mismatched passwords");
      return;
    }
    else {
      console.log("passwords identical");
    }

    fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(response => response.text())
    .then(data => console.log(data))
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
      <p>{message}</p>
    </div>
  )
}

export default Signup