import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axios.get(`/api/book/${bookId}`);
        setBook(response.data.book);
      } catch (err) {
        setError((err as any).message || "An error occurred");
      }
    };

    fetchBookData();
  }, [bookId]);

  if (error) return <div>Error: {error}</div>;
  if (!book) return <div>Loading...</div>;

  return (
    <div className="book-details">
			<div className="book-detail-top">
				<div>
				<img src={book.imageLinks?.thumbnail ?? "https://placehold.jp/150x150.png"} alt={book.title} />
				</div>
      <div>
			<h1>{book.title ?? "Unknown Title"}</h1>
      <h2>{book.subtitle ?? "No Subtitle Available"}</h2>
      <div>
        <strong>Authors:</strong> {book.authors?.join(', ') ?? "Unknown Author"}
      </div>
      <div>
        <strong>Publisher:</strong> {book.publisher ?? "Unknown Publisher"}
      </div>
      <div>
        <strong>Published Date:</strong> {book.publishedDate ?? "Unknown Date"}
      </div>
      <div>
        <strong>ISBN:</strong> {book.industryIdentifiers?.find(ident => ident.type === 'ISBN_13')?.identifier ?? "Unknown ISBN"}
      </div>
      <div>
        <strong>Page Count:</strong> {book.pageCount ?? "Unknown Page Count"}
      </div>
      <div>
        <strong>Dimensions:</strong> {book.dimensions?.height ?? "Unknown Height"} x {book.dimensions?.width ?? "Unknown Width"} x {book.dimensions?.thickness ?? "Unknown Thickness"}
      </div>
      <div>
        <strong>Average Rating:</strong> {book.averageRating ?? "Unknown Rating"} ({book.ratingsCount ?? "No"} ratings)
      </div>
			</div>
			</div>

      <div className="book-detail-bottom">
      <p>{book.description}</p>

      <div>
        <a href={book.previewLink} target="_blank" rel="noopener noreferrer">Preview the book</a>
      </div>
			</div>

    </div>
  );
}

export default BookDetails;
