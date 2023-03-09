function emptyNote({ message = "Select a note or create a new one" }) {
    return (
      <div className="no-active-note">{message}</div>
    );
  }
  export default emptyNote;