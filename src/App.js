import { BrowserRouter, Routes, Route } from "react-router-dom";
import layout from "./lotion.js";
import previews from "./lotion.js";
import edits from "./lotion.js";
import emptyNote from "./lotion.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<layout />} exact>
          <Route path="/" element={<emptyNote />} exact />
          <Route path="/Preview/:id" element={<previews />} />
          <Route path="/Edit/:id" element={<edits />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;