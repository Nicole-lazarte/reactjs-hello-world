import { useState, useEffect } from "react";
import { useOutletContext, useParams, useNavigat, Link, Outlet} from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import uuid from "react-uuid";
import React from "react";



function edits() {
    const [sortedNotes, setNotes] = useOutletContext();
    const { id } = useParams();
    const note = sortedNotes.find((note) => note.id === id);
    const [body, setBody] = useState(note.body);
    const [when, setWhen] = useState(note.userDate);
    const [title, setTitle] = useState(note.title);
  
    const navigate = useNavigate(); // add this hook to use navigation
  
    const onDeleteNote = (noteId) => {
      const answer = window.confirm("Are you sure?");
      if (answer) {
        var tb_del = sortedNotes.filter(({ id }) => id !== noteId);
        setNotes(tb_del);
      }
      if (tb_del.length > 0) {
        navigate(`/Preview/${tb_del[0].id}`, { replace: true });
      }
      if (tb_del.length === 0) {
        navigate(`/`, { replace: true });
      }
    };
  
    const onSaveNote = (title, body, when) => {
      const note = sortedNotes.find((note) => note.id === id);
      note.title = title;
      note.body = body;
      note.bodyPreview = body;
      note.userDate = when;
      localStorage.setItem("localNotes", JSON.stringify(sortedNotes)); // update notes in local storage
      navigate(`/preview/${note.id}`, { replace: true });
    };
  
    if (!note) {
      return (
        <div className="no-active-note">Select a note or create a new one </div>
      );
    }
  
    return (
      <div id="mainbar">
        <div id="mainbar-header">
          <h1 id="mainbar-title">
            <input
              type="text"
              id="mainbar-title-input"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              autoFocus
            />
          </h1>
          <div id="mainbar-buttons">
            <button
              id="save_button"
              onClick={() => onSaveNote(title, body, when)}
            >
              save
            </button>
            <button id="delete_button" onClick={(e) => onDeleteNote(note.id)}>
              delete
            </button>
          </div>
        </div>
        <div id="mainbar-edit">
          <div id="date">
            <input
              type="datetime-local"
              id="date"
              value={when}
              onChange={(e) => {
                setWhen(e.target.value);
              }}
            />
          </div>
  
          <div id="mainbar-content">
            <ReactQuill
              theme="snow"
              value={body}
              onChange={setBody}
              defaultValue={note.body}
            />
          </div>
        </div>
      </div>
    );
  }
  

  function layout() {
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
  
    var onAddNote = () => {
      let now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      let date = now.toISOString().slice(0, 16);
  
      var newNote = {
        id: uuid(),
        title: "Untitled Note",
        body: "",
        bodyPreview: "",
        lastModified: Date.now(),
        userDate: date,
      };
  
      setNotes([newNote, ...notes]);
      setActiveNote(newNote.id);
      navigate(`/Edit/${newNote.id}`, { replace: true }); // <--- this is the line that does the magic
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

  function previews() {
    const { id } = useParams();
    const [notesObjects, setNotes] = useOutletContext();
  
    const navigate = useNavigate();
    const note = notesObjects.find((note) => note.id === id);
    if (!note) {
      navigate(`/`, { replace: true });
    }
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
  
    const formatDate = (when) => {
      const formatted = new Date(when).toLocaleString("en-US", options);
      if (formatted === "Invalid Date") {
        return "";
      }
      return formatted;
    };
  
    const onDeleteNote = (noteId) => {
      const answer = window.confirm("Are you sure?");
      if (answer) {
        setNotes(notesObjects.filter(({ id }) => id !== noteId));
      }
    };
  
    return (
      <div id="mainbar">
        <div className="app-main">
          <div className="app-main-note-edit">
            <div id="mainbar-header">
              <h1 id="mainbar-title">
                {note.title && note.title.substr(0, 100)} {"..."}
              </h1>
              <div id="mainbar-buttons">
                <Link key={note.id} to={"/Edit/" + note.id} id="edit-link">
                  <button id="save_button">Edit</button>
                </Link>
                <Link>
                  <button
                    id="delete_button"
                    onClick={(e) => onDeleteNote(note.id)}
                  >
                    delete
                  </button>
                </Link>
              </div>
            </div>
            <div id="mainbar-edit">
              <div id="date">{formatDate(note.userDate)}</div>
  
              <div
                id="mainbar-content"
                dangerouslySetInnerHTML={{ __html: note.body }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function emptyNote() {
    return (
      <div className="no-active-note">Select a note or create a new one </div>
    );
  }

