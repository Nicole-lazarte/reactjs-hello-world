import { useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function editing() {
    const [sortedNotes, setNotes] = useOutletContext();
    const { id } = useParams();
  
    // Find the note with the matching id
    const note = sortedNotes.find((note) => note.id === id);
  
    useEffect(() => {
      setBody(note.body);
      setWhen(note.userDate);
      setTitle(note.title);
    }, [note]);
  
    const navigate = useNavigate(); // add this hook to use navigation
  
    const onDeleteNote = (noteId) => {
      const answer = window.confirm("Are you sure?");
      if (answer) {
        var tb_del = sortedNotes.filter(({ id }) => id !== noteId);
        setNotes(tb_del);
      }
      if (tb_del.length > 0) {
        navigate(`/preview/${tb_del[0].id}`, { replace: true });
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
  
  export default editing;
  
