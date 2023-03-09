import { BrowserRouter, Routes, Route } from "react-router-dom";
import lotionLayout from "./lotionLayout.js";
import preview from "./preview.js";
import editing from "./editing.js";
import emptyNote from "./emptyNote.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<lotionLayout />} exact>
          <Route path="/" element={<emptyNote />} exact />
          <Route path="/preview/:id" element={<preview />} />
          <Route path="/editing/:id" element={<editing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;