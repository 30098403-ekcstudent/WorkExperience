function Login () {
  return (
    <div className="signbox">
      <h1>Log in</h1>
      <form className = "signform">
        <label htmlFor="user">Username:</label><br/>
        <input className="textbox" type="text" id="user" name="username"/><br/>
        <label htmlFor="password">Password:</label><br/>
        <input className="textbox" type="password" id="password" name="password"/><br/>
        <button className="button">Log in</button>
      </form>
    </div>
  )
}

export default Login