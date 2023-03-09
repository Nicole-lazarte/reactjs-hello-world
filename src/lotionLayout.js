import uuid from "react-uuid";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function lotionLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notes, setNotes] = useState(
    localStorage.notes ? JSON.parse(localStorage.notes) : []
  );
  const [activeNote, setActiveNote] = useState(false);
  const navigate = useNavigate();
  const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleDarkModeClick = () => {
    setIsDarkMode(!isDarkMode);
    const root = document.documentElement;
    root.classList.toggle("dark-mode");
  };

  const hideSideBar = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("hide");
  };

  const onAddNote = () => {
    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let date = now.toISOString().slice(0, 16);

    const newNote = {
      id: uuid(),
      title: "Untitled Note",
      body: "",
      bodyPreview: "",
      lastModified: Date.now(),
      userDate: date,
    };

    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
    navigate(`/editing/${newNote.id}`, { replace: true });
  };

  const onDeleteNote = (noteId) => {
    const answer = window.confirm("Are you sure?");
    if (answer) {
      const filteredNotes = notes.filter((note) => note.id !== noteId);
      setNotes(filteredNotes);
      setActiveNote(false);
      localStorage.setItem("notes", JSON.stringify(filteredNotes));
      if (filteredNotes.length > 0) {
        navigate(`/preview/${filteredNotes[0].id}`, { replace: true });
      } else {
        navigate(`/`, { replace: true });
      }
    }
  };

  return (
    <>
      <div className="Headbar">
        <div id="title_bar">
          <button id="hide_sidebar" onClick={hideSideBar}>
            &#9776;{" "}
          </button>

          <div id="center_text">
            <h1> Lotion </h1>
            <p id="subheading">
              {" "}
              Notion's budget-friendly and slightly greasier cousin!{" "}
            </p>
          </div>

          <button id="dark_mode" onClick={handleDarkModeClick}>
            &#9681;
          </button>
        </div>
      </div>
      <div id="container">
        <div id="sidebar">
          <div className="app-sidebar-header">
            <h1>Notes</h1>
            <button onClick={onAddNote}>+</button>
          </div>
          <div className="app-sidebar-notes">
            {sortedNotes.map(({ id, title, body, lastModified }, i) => (
              <div
                className={`app-sidebar-note ${id === activeNote && "active"}`}
                key={id}
                onClick={() => {
                  navigate(`/preview/${id}`, { replace: true });
                  setActiveNote(id);
                }}
              >
                <div className="sidebar-note-title">
                  <strong>{title && title.substr(0, 50)}</strong>
                </div>

                <p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: body && body.substr(0, 200) + "...",
                    }}
                  ></div>
                </p>
                <small className="note-meta">
                  Last Modified{" "}
                  {new Date(lastModified).toLocaleDateString("en-CA", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            ))}
          </div>
        </div>
        <Outlet context={[sortedNotes, setNotes, activeNote, setActiveNote]} />
      </div>
    </>
  );
}
export default lotionLayout;