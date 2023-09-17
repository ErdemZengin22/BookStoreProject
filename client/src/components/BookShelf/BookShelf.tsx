import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AccessTokenContext } from "../../contexts/AccessTokenContext";
import { Link } from "react-router-dom";

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
  shelf: "wantToRead" | "currentlyReading" | "read";
}
interface ShelfItemProps extends IBook {
  handleShelfChange: (bookId: string, newShelf: string) => void;
  handleBookDeletion: (bookId: string) => void;
}
interface ShelfProps {
  shelfTitle: string;
  books: IBook[];
  handleShelfChange: (bookId: string, newShelf: string) => void;
  handleBookDeletion: (bookId: string) => void;
}

const ShelfItem: React.FC<ShelfItemProps> = ({
  id,
  title,
  authors,
  imageLinks,
  handleShelfChange,
  handleBookDeletion,
}) => {
  const bookDetailLink = `/book/${id}`;
  return (
    <div className="book-shelf-item">
      <div className="book-shelf-item-col">
        <Link to={bookDetailLink}>
          <img
            className="book-cover-image"
            src={imageLinks?.thumbnail ?? "https://placehold.it/150"}
            alt={title}
          />
        </Link>
      </div>
      <div className="book-shelf-item-col">
        <div>
          <Link to={bookDetailLink}>
            <h1>{title ?? "Unknown Title"}</h1>
          </Link>
        </div>
        <div>
          <h2>By {authors ?? "No Subtitle Available"}</h2>
        </div>
        <div>
          <label>Change Shelf:</label>
          <select onChange={(e) => handleShelfChange(id, e.target.value)}>
            <option>Select Shelf</option>
            <option value="wantToRead">Want to Read</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="read">Read</option>
          </select>
        </div>
        <div>
          <button
            className="delete-button"
            onClick={() => handleBookDeletion(id)}
          >
            Remove Book
          </button>
        </div>
      </div>
    </div>
  );
};
const Shelf: React.FC<ShelfProps> = ({
  shelfTitle,
  books,
  handleShelfChange,
  handleBookDeletion,
}) => (
  <div className="category">
    <h2>{shelfTitle}</h2>
    {books.length === 0 ? (
      <div>This Shelf is Empty</div>
    ) : (
      books.map((book) => (
        <ShelfItem
          key={book.id}
          {...book}
          handleShelfChange={handleShelfChange}
          handleBookDeletion={handleBookDeletion}
        />
      ))
    )}
  </div>
);
function BookShelf() {
  const [shelfBooks, setShelfBooks] = useState<{
    wantToRead: IBook[];
    currentlyReading: IBook[];
    read: IBook[];
  }>({
    wantToRead: [],
    currentlyReading: [],
    read: [],
  });
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useContext(AccessTokenContext);

  const fetchBookshelfData = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("User not authenticated");
      }
      const response = await axios.get(`/api/bookshelf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShelfBooks(response.data.books);
    } catch (err) {
      setError((err as any).message || "An error occurred");
    }
  }, [getToken]);

  const handleShelfChange = async (bookId: string, newShelf: string) => {
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
      fetchBookshelfData();
    } catch (err) {
      setError(
        (err as any).message || "An error occurred while updating the shelf"
      );
    }
  };

  useEffect(() => {
    fetchBookshelfData();
  }, [fetchBookshelfData]);

  const handleBookDeletion = async (bookId: string) => {
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
      fetchBookshelfData();
    } catch (err) {
      setError(
        (err as any).message ||
          "An error occurred while deleting the book from the shelf"
      );
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="book-shelf">
      <Shelf
        shelfTitle="Want to Read"
        books={shelfBooks.wantToRead}
        handleShelfChange={handleShelfChange}
        handleBookDeletion={handleBookDeletion}
      />
      <Shelf
        shelfTitle="Currently Reading"
        books={shelfBooks.currentlyReading}
        handleShelfChange={handleShelfChange}
        handleBookDeletion={handleBookDeletion}
      />
      <Shelf
        shelfTitle="Read"
        books={shelfBooks.read}
        handleShelfChange={handleShelfChange}
        handleBookDeletion={handleBookDeletion}
      />
    </div>
  );
}

export default BookShelf;
