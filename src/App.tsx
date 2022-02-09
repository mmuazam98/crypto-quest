import { makeStyles } from "@mui/styles";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import Home from "./pages/Home";
import "./App.css";
import Header from "./components/Header";
import CoinPage from "./pages/CoinPage";
import Alert from "./components/Alert";

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#14161a",
    color: "white",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coins/:id" element={<CoinPage />} />
        </Routes>
      </div>
      <Alert />
    </Router>
  );
}

export default App;
