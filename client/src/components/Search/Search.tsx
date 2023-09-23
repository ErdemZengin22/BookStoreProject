import { useState, useContext, useEffect, useCallback } from "react";
import { AccessTokenContext } from "../../contexts/AccessTokenContext";
import axios from "axios";
import { Link } from "react-router-dom";

// Interface to define the expected structure of a book
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

// Interface to define the expected structure of a book response
interface IbookResponse {
  status: string;
  books: Ibook[];
}

function Search() {
  // Various states to manage books, search queries, messages, and loading status.
  const [books, setBooks] = useState<Ibook[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addedBook, setAddedBook] = useState<{
    id: string;
    shelfName: string;
  } | null>(null);

  const { getToken } = useContext(AccessTokenContext);

  // Handles adding a book to a specific shelf.
  const handleAddToShelf = async (bookId: string, shelfKey: string) => {
    const token = getToken();
    const shelfNames: Record<string, string> = {
      wantToRead: "Want to Read",
      currentlyReading: "Currently Reading",
      read: "Read",
    };
    if (!token) {
      setErrorMessage("User not authenticated");
      return;
    }
    try {
      await axios.put(
        `/api/bookshelf/${bookId}/${shelfKey}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddedBook({ id: bookId, shelfName: shelfNames[shelfKey] });
      setErrorMessage(``);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to add book to shelf.");
      setAddedBook(null);
    }
  };
  
// Fetches books based on the search query.
  const getBooks = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const response = await axios.request<IbookResponse>({
        method: "GET",
        url: `/api/book/search/${searchQuery}`,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const booksData = response.data.books;
      setBooks(booksData);
    } catch (error) {
      console.error(error);
      setErrorMessage("Oh no! An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, getToken]);

  useEffect(() => {
    getBooks();
  }, [getBooks]);

  return (
    <div className="container">
      <div className="search-top">
        <input
          type="text"
          placeholder="Search for books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="search-body">
        {isLoading ? (
          <div className="loading-container">
            <img src="/loading.gif" alt="Loading..." />
          </div>
        ) : (
          books &&
          books.map((book) => {
            const key = `book-${book.id}`;
            const title = `${book.title}`;
            const thumbnail =
              book.imageLinks?.thumbnail || "https://placehold.jp/150x150.png";
            const bookDetailLink = `/book/${book.id}`;
            return (
              <div key={key} className="book-item">
                <Link to={bookDetailLink}>
                  <div>
                    <img src={thumbnail} alt={title} />
                  </div>
                  <div>
                    <h4>{title}</h4>
                  </div>
                </Link>
                <select
                  onChange={(e) => handleAddToShelf(book.id, e.target.value)}
                >
                  <option value="">Add to shelf...</option>
                  <option value="wantToRead">Want to Read</option>
                  <option value="currentlyReading">Currently Reading</option>
                  <option value="read">Read</option>
                </select>
                {addedBook?.id === book.id && (
                  <div className="notification">
                    ✓ This book is added to your{" "}
                    <span>{addedBook.shelfName}</span> shelf successfully!
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default Search;
