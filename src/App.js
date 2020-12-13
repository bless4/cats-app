import React from "react";
import { Router, Route } from "react-router-dom";
import { photosStore } from "./utils/store";
import history from './utils/history'
import TopBar from "./components/TopBar";
import HomePage from "./pages/homepage/HomePage";
import CatPage from "./pages/catpage/CatPage";

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <TopBar />
        <Route
          exact
          path="/"
          component={props => (
            <HomePage {...props} photosStore={photosStore} />
          )}
        />
        <Route
          path="/upload"
          component={props => (
            <CatPage {...props} photosStore={photosStore} />
          )}
        />
      </Router>
    </div>
  );
}
export default App;