import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAll, update } from "../BooksAPI";
import { useHistory } from "react-router-dom";

function Shelf() {
  const [books, setBooks] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAll();
        setBooks(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBooks();
  }, []);

  const onMoveShelf = useCallback(async (book, newShelf) => {
    try {
      await update(book, newShelf);
      const data = await getAll();
      setBooks(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  function handleNavigate(bookId) {
    history.push(`/book/${bookId}`);
  }

  function getBooksByShelf(shelfName) {
    return books
      .filter((book) => book.shelf === shelfName)
      .map((book) => (
        <li key={book.id}>
          <div className="book">
            <div className="book-top">
              <div
                className="book-cover"
                style={{
                  width: 128,
                  height: 193,
                  backgroundImage: `url(${book.imageLinks.thumbnail})`,
                }}
                onClick={() => handleNavigate(book.id)}
              ></div>
              <div className="book-shelf-changer">
                <select
                  defaultValue={book.shelf}
                  onChange={(e) => onMoveShelf(book, e.target.value)}
                >
                  <option value="move" disabled>
                    Move to...
                  </option>
                  <option value="currentlyReading">Currently Reading</option>
                  <option value="wantToRead">Want to Read</option>
                  <option value="read">Read</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
            <div className="book-title">{book.subtitle}</div>
            <div className="book-authors">{book.authors.join(", ")}</div>
          </div>
        </li>
      ));
  }

  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          <div className="bookshelf">
            <h2 className="bookshelf-title">Currently Reading</h2>
            <div className="bookshelf-books">
              <ol className="books-grid">
                {getBooksByShelf("currentlyReading")}
              </ol>
            </div>
          </div>
          <div className="bookshelf">
            <h2 className="bookshelf-title">Want to Read</h2>
            <div className="bookshelf-books">
              <ol className="books-grid">{getBooksByShelf("wantToRead")}</ol>
            </div>
          </div>
          <div className="bookshelf">
            <h2 className="bookshelf-title">Read</h2>
            <div className="bookshelf-books">
              <ol className="books-grid">{getBooksByShelf("read")}</ol>
            </div>
          </div>
        </div>
      </div>
      <div className="open-search">
        <Link to={"/search"}>Add a book</Link>
      </div>
    </div>
  );
}

export default Shelf;
