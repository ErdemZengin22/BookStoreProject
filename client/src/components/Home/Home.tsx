import { useState, useContext, useEffect, useCallback } from "react";
import { AccessTokenContext } from "../../contexts/AccessTokenContext";
import axios from "axios";
import { Link } from "react-router-dom";

interface Ibook {
  id: string;
  title: string;
  subtitle: string;
  authors: string[];
  description: string;
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
  [key: string]: any;
}

interface IbookResponse {
  status: string;
  books: Ibook[];
}

function Home() {
  const [books, setbooks] = useState<Ibook[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  /**
   * Getting access token from the Context API
   */
  const {getToken} = useContext(AccessTokenContext);

  const getbooks = useCallback(async () => {
    try {
      const response = await axios.request<IbookResponse>({
        method: "GET",
        url: "/api/book/search/bookTitle",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const booksData = response.data.books;
      setbooks(booksData);
    } catch (error) {
      console.error(error);
      setErrorMessage("Oh no! An unexpected error occurred.");
    }
  }, [getToken]);

  useEffect(() => {
    getbooks();
  }, [getbooks]);
  return (
    <div className="container">
      <div className="home-body">
      {books.map((book) => {
        const key = `book-${book.id}`;
        const title = `${book.title}`;
        const thumbnail = book.imageLinks?.thumbnail || "https://placehold.jp/150x150.png";
        const bookDetailLink = `/book/${book.id}`;
        return (
          <div key={key} className="book-item">
            <Link to={bookDetailLink}>
            <div><img src={thumbnail} alt={title} /></div>
            <div><h4>{title}</h4></div>
            </Link>
          </div>
        );
      })}
      </div>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default Home;
