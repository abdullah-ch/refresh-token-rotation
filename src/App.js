import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
