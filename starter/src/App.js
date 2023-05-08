import "./App.css";
import { BrowserRouter, Route } from 'react-router-dom';
import Shelf from "./screens/Shelf";
import Search from "./screens/Search";
import Book from "./screens/Book";

function App() {
  return (
    <div className="app">
     <BrowserRouter>
      <div>
        <Route exact path="/" component={Shelf} />
        <Route path="/search" component={Search} />
        <Route path="/book/:id" component={Book} />
      </div>
    </BrowserRouter>
    </div>
  );
}

export default App;
