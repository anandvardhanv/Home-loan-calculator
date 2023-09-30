import React from "react";
import logo from "./logo.svg";
import "./Global/global.scss";
import LoanDetails from "./Components/LoanDetails/LoanDetails";
import LoanOverview from "./Components/LoanOverview/LoanOverview";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div>
        <div className="AppHeader">EMI Calculator</div>
        <LoanDetails />
      </div>
    </div>
  );
}

export default App;
