import React from 'react';
import styles from "./App.module.css";
import { BrowserRouter } from 'react-router-dom';
import { Router } from "./router/Router"

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Router />
      </div>
    </BrowserRouter>
  );
}


export default App;
