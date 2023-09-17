import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AccessTokenContext } from "../../contexts/AccessTokenContext";
import axios from "axios";

interface IBook {
  id: string;
  title: string;
  subtitle: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  industryIdentifiers: Array<{ type: string; identifier: string }>;
  pageCount: number;
  printedPageCount: number;
  dimensions: {
    height: string;
    width: string;
    thickness: string;
  };
  printType: string;
  averageRating: number;
  ratingsCount: number;
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
}

function BookDetails() {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<IBook | null>(null);
  const [userShelf, setUserShelf] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useContext(AccessTokenContext);
  const [shelfChangedTo, setShelfChangedTo] = useState<string | null>(null);
  const shelfDisplayNames: { [key: string]: string } = {
    wantToRead: "Want to Read",
    currentlyReading: "Currently Reading",
    read: "Read",
  };

  useEffect(() => {
    const determineBookShelf = (bookshelfData: any) => {
      for (const shelf in bookshelfData.books) {
        if (bookshelfData.books[shelf].some((b: IBook) => b.id === bookId)) {
          return shelf;
        }
      }
      return null;
    };
    const fetchBookDataAndShelf = async () => {
      try {
        const bookResponse = await axios.get(`/api/book/${bookId}`);
        setBook(bookResponse.data.book);

        const shelfResponse = await axios.get("/api/bookshelf", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const shelf = determineBookShelf(shelfResponse.data);
        setUserShelf(shelf);
      } catch (err) {
        setError((err as any).message || "An error occurred");
      }
    };

    fetchBookDataAndShelf();
  }, [bookId, getToken]);

  const handleShelfChange = async (newShelf: string) => {
    const token = getToken();
    if (!token) {
      setError("User not authenticated");
      return;
    }
    try {
      await axios.put(
        `/api/bookshelf/${bookId}/${newShelf}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShelfChangedTo(newShelf);
      setUserShelf(newShelf);
    } catch (err) {
      setError(
        (err as any).message || "An error occurred while updating the shelf"
      );
    }
  };

  const handleBookDeletion = async () => {
    const token = getToken();
    if (!token) {
      setError("User not authenticated");
      return;
    }
    try {
      await axios.delete(`/api/bookshelf/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserShelf(null);
      setShelfChangedTo(null);
    } catch (err) {
      setError(
        (err as any).message || "An error occurred while deleting the book"
      );
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!book) return <div>Loading...</div>;

  return (
    <div className="book-details">
      <div className="book-detail-top">
        <div>
          <img
            src={
              book.imageLinks?.thumbnail ?? "https://placehold.jp/150x150.png"
            }
            alt={book.title}
          />
        </div>
        <div>
          <h1>{book.title ?? "Unknown Title"}</h1>
          <h2>{book.subtitle ?? "No Subtitle Available"}</h2>
          <div>
            <strong>Authors:</strong>{" "}
            {book.authors?.join(", ") ?? "Unknown Author"}
          </div>
          <div>
            <strong>Publisher:</strong> {book.publisher ?? "Unknown Publisher"}
          </div>
          <div>
            <strong>Published Date:</strong>{" "}
            {book.publishedDate ?? "Unknown Date"}
          </div>
          <div>
            <strong>ISBN:</strong>{" "}
            {book.industryIdentifiers?.find((ident) => ident.type === "ISBN_13")
              ?.identifier ?? "Unknown ISBN"}
          </div>
          <div>
            <strong>Page Count:</strong>{" "}
            {book.pageCount ?? "Unknown Page Count"}
          </div>
          <div>
            <strong>Dimensions:</strong>{" "}
            {book.dimensions?.height ?? "Unknown Height"} x{" "}
            {book.dimensions?.width ?? "Unknown Width"} x{" "}
            {book.dimensions?.thickness ?? "Unknown Thickness"}
          </div>
          <div>
            <strong>Average Rating:</strong>{" "}
            {book.averageRating ?? "Unknown Rating"} (
            {book.ratingsCount ?? "No"} ratings)
          </div>
        </div>
      </div>

      <div className="book-detail-bottom">
        <p>{book.description}</p>
        {userShelf && (
          <div className="current-shelf">
            ** This book is currently in your{" "}
            <span>{shelfDisplayNames[userShelf!]}</span> shelf.
          </div>
        )}

        <div>
          <label>{userShelf ? "Change Shelf:" : "Add to My BookShelf:"}</label>
        </div>
        <div>
          <select onChange={(e) => handleShelfChange(e.target.value)}>
            <option>Select Shelf</option>
            <option value="wantToRead">Want to Read</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="read">Read</option>
          </select>
        </div>
        <div>
          {userShelf && (
            <button className="delete-button" onClick={handleBookDeletion}>
              Remove From My BookShelf
            </button>
          )}
        </div>
        {shelfChangedTo && (
          <div className="notification">
            ✓ This book is added to your{" "}
            <span>{shelfDisplayNames[shelfChangedTo]}</span> shelf.
          </div>
        )}
        <div>
          <a href={book.previewLink} target="_blank" rel="noopener noreferrer">
            Preview the book
          </a>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
