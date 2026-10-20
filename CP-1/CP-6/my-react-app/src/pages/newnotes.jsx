
import { useState } from "react";

function NewNotes() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");


async function handleSubmit(event) {
  event.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/notes", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        content: content
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data);
      setTitle("");
      setContent("");
      setMessage(data.message);
    } else {
      console.error("Could not save note:", data);
    }
  } catch (error) {
    console.error("Could not contact the server:", error);
  }
}


  return (
    <div className="note">
      <h1>New Note</h1>

      <form className="signform" onSubmit={handleSubmit}>
        <label htmlFor="note-title">Title:</label>
        <br />
        <input
          className="textbox"
          type="text"
          id="note-title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <br />

        <label htmlFor="note-content">Content:</label>
        <br />
        <textarea
          className="textbox note-content"
          id="note-content"
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={8}
          required
        />
        <br />

        <button className="button" type="submit">
          Save Note
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default NewNotes;