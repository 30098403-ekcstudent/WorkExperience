import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";

function App() {
  const [DOM1Text, setDOM1Text] = useState("DOM1 code affects me!");
  const [DOM2Text, setDOM2Text] = useState("DOM2 code affects me!");
  const [coffeeData, setCoffeeData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);


  function myFunction(){
    setDOM1Text("DOM1 code works!");
    setDOM2Text("DOM2 code works!");
  }
  const baseURL = 'https://api.sampleapis.com/coffee/hot';
  useEffect(() => {
    fetch(baseURL)
      .then(resp => resp.json())
      .then(data => setCoffeeData(data));
  }, [])

  useEffect(() => {
    fetch("http://localhost:3000/me", {
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) return null;
        return response.json();
      })
      .then(data => {
        if (data) setCurrentUser(data);
      })
      .catch(error => {
        console.error("Could not check login status:", error);
      });
  }, []);

  return (
    <BrowserRouter>
      <Navbar
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
      />
      <Routes>
        <Route path="/" element={
          <>
            <div className="box-content">
              <p id="DOM1">{DOM1Text}</p>
              <p id="DOM2">{DOM2Text}</p>
              <button type="button" onClick={myFunction}>Press me!</button>
            </div>

            <table id="coffeetable">
              <tbody>
                {coffeeData.map(coffee => (
                  <tr key={coffee.id}>
                    <td>{coffee.title}</td>
                    <td>
                      {typeof coffee.ingredients === "string"
                        ? coffee.ingredients
                        : Object.values(coffee.ingredients).join(", ")}
                    </td>
                    <td>{coffee.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        } />

        <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );

}


export default App