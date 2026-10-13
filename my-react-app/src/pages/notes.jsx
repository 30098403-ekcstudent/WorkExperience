import { useState, useEffect } from "react";



function Notes() {
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/notes")
      .then(response => {
        if (!response.ok) {
          throw new Error("Could not retrieve notes.");
        }
        return response.json();
      })
      .then(data => setNotes(data))
      .catch(error => console.error(error));
  }, []);


  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/notes/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }

      setNotes(currentNotes =>
        currentNotes.filter(note => note.id !== id)
      );
    } catch (error) {
      console.error("Could not delete note:", error);
      window.alert("Could not delete the note. Please try again.");
    }
  }

  function startEditing(note) {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  async function handleSaveEdit(id) {
    try {
      const response = await fetch(`http://localhost:3000/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent
        })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }

      setNotes(currentNotes =>
        currentNotes.map(note =>
          note.id === id
            ? { ...note, title: editTitle, content: editContent }
            : note
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Could not update note:", error);
      window.alert("Could not save changes. Please try again.");
    }
  }


  return (
    <div className="note">
      <h1>Saved Notes</h1>

      {notes.map(note => (
        <div className="note-card" key={note.id}>
          {editingId === note.id ? (
            <>
              <input
                className="textbox"
                type="text"
                value={editTitle}
                onChange={event => setEditTitle(event.target.value)}
                required
              />

              <br />

              <textarea
                className="textbox note-content"
                value={editContent}
                onChange={event => setEditContent(event.target.value)}
                rows={8}
                required
              />

              <br />

              <button
                className="button"
                type="button"
                onClick={() => handleSaveEdit(note.id)}
              >
                Save Changes
              </button>

              {" "}

              <button
                className="button"
                type="button"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h2>{note.title}</h2>

              <p className="note-text">{note.content}</p>

              <button
                className="button"
                type="button"
                onClick={() => startEditing(note)}
              >
                Edit
              </button>

              {" "}

              <button
                className="button"
                type="button"
                onClick={() => handleDelete(note.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Notes;