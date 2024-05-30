import {BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import BoardList from "./view/boardList.js";
import BoardEdit from "./view/boardEdit.js";
import BoardView from "./view/boardView.js";
import BoardWrite from "./view/boardWrite.js";


function App() {
  return (
    <Routes>
      <Route path="/" element={<BoardList />} />
      <Route path="/boardwrite" element={<BoardWrite />} />
      <Route path="/boardview/:boardIdx" element={<BoardView />} />
      <Route path="/boardview/:boardIdx/boardEdit" element={<BoardEdit />} />
    </Routes>
  );
}

export default App;