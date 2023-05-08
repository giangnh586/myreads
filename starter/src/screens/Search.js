import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { search, update } from "../BooksAPI";

function Search() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useMemo(() => {
    if (query === "") {
      setBooks([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      setLoading(true);
      setError(false);
      search(query, 100)
        .then((data) => {
          if (data && data.items) {
            setBooks([]);
            setError(true);
          } else {
            setBooks(data || []);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setError(true);
          setLoading(false);
        });
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const addBook = (book) => {
    console.log(book);
    update(book, book.shelf)
      .then((data) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const onChangeBookShelf = (book, shelf) => {
    setBooks(prevBooks => 
      prevBooks.map(item => item.id === book.id ? { ...item, shelf } : item)
    );
  };

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link className="close-search" to={"/"}>
          Close
        </Link>
        <div className="search-books-input-wrapper">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="search-books-results">
        {loading && <div>Loading...</div>}
        {error && (
          <div>Error occurred while fetching book data. Please try again.</div>
        )}
        {!loading && !error && (
          <ol className="books-grid">
            {books.map((book) =>
              book.imageLinks && book.authors ? (
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
                        onClick={() => addBook(book)}
                      ></div>
                      <div className="book-shelf-changer">
                      <select defaultValue={book.shelf ? book.shelf : 'none'}
                      onChange={(e) => onChangeBookShelf(book, e.target.value)}>
                        <option value="move" disabled>
                          Move to...
                        </option>
                        <option value="currentlyReading">
                          Currently Reading
                        </option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                    </div>
                    <div className="book-title">{book.title}</div>
                    <div className="book-authors">{book.authors}</div>
                  </div>
                </li>
              ) : null
            )}
          </ol>
        )}
      </div>
    </div>
  );
}

export default React.memo(Search);
