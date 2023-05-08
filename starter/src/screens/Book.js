import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { get } from "../BooksAPI";
import { useHistory } from "react-router-dom";

function Book() {
  const history = useHistory();

  const location = useLocation();
  const id = location.pathname.split("/").pop();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleGoBack = () => {
    history.goBack();
  };

  useEffect(() => {
    get(id)
      .then((data) => {
        if (data) {
          setBook(data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  // Show loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message
  if (error) {
    return <div>Error occurred while fetching book data</div>;
  }

  return (
    <div className="detail-books">
      <div className="close-search" onClick={handleGoBack}>
        Close
      </div>
      <ol className="books-grid">
        <li key={book.id}>
          <div className="book">
            <div className="book-top">
              <div
                className="book-cover"
                style={{
                  width: 128,
                  height: 193,
                  backgroundImage: book?.imageLinks?.thumbnail
                    ? `url(${book?.imageLinks?.thumbnail})`
                    : null,
                }}
              ></div>
            </div>
            <div className="book-title">{book.title}</div>
            <div className="book-authors">{book.authors}</div>
            <div className="book-description">{book.description}</div>
          </div>
        </li>
      </ol>
    </div>
  );
}

export default Book;
