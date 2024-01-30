import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./style/global.css";
import App from "./App";

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

ReactDOM.render(app, document.getElementById("root"));
