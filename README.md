# Installation

Follow these steps to install the project:

    Clone the repository:

```
git clone https://github.com/ErdemZengin22/BookStoreProject.git
cd BookStoreProject
```

    Install dependencies:

```
npm install
```

# Description

This project is a virtual bookshelf where users can search for books and add them to their personal shelves. Users can categorize books into three distinct shelves: Want to Read, Currently Reading, and Read. They can also remove books or change the shelf category of a book.
Components

# 1. Login Component

This component provides a user-friendly interface that facilitates user authentication. On successful login, the component fetches and stores an authentication token (JWT) which can be used for subsequent authenticated requests.

## Features:

	  Utilizes the AccessTokenContext to get the login method for updating the JWT token in the context.
    Utilizes the useNavigate hook from react-router-dom to programmatically navigate the user.
    Contains form input fields for the username and password.
    Handles the login process, making an HTTP POST request to /api/signin.
    Upon a successful login, the JWT token is saved and the user is redirected.
    Handles errors, displaying specific error messages either for invalid credentials or other unexpected issues.
    Features a loading state to prevent multiple submissions and inform the user that a process is ongoing.

## Technologies:

    Authentication: Upon form submission, a POST request is sent to the /api/signin endpoint to authenticate the user using their provided username and password.
    Context Interaction: Uses the AccessTokenContext to set the JWT token once received.
    Navigation: On successful authentication, the user is navigated to the /bookshelf page.
    Error Handling: Comprehensive error handling is included, catering for potential invalid credentials or other unexpected server responses.

# 2. BookShelf Component

This component displays all the books a user has added to their personal shelves, categorized into the three shelf types.

## Features:

    Shows books under each shelf category.
    Allows the user to change a book's shelf or remove a book from the shelf.

## Technologies:

    Uses React's useState, useEffect, useContext, and useCallback for managing state and side effects.
    Utilizes axios for API calls.
    Routes handled by react-router-dom.

# 3. BookDetails Component

Displays detailed information about a specific book.

## Features:

    Provides comprehensive details about the book including authors, publisher, published date, and more.
    Allows the user to add the book to a shelf or remove it if it's already added.
    Displays current shelf status of the book.

## Technologies:

    Uses React's useState, useEffect, and useContext for managing state and side effects.
    Utilizes axios for API calls.
    Routes and URL parameters managed using react-router-dom.

# 4. Search Component
Allows users to search for books by entering a query. It displays the search results and provides an option to add a selected book to one of their shelves.

## Features:

    Book Search: The component sends a GET request to /api/book/search/{searchQuery} upon detecting changes to the search input.
    Adding to Shelf: For every displayed book result, users can add the book to one of their personal shelves. This action sends a PUT request to /api/bookshelf/{bookId}/{shelfKey}.
    Context Interaction: Retrieves the user's JWT token from AccessTokenContext for authenticated requests.
    Dynamic Feedback: Informs the user when a book has been successfully added to a shelf.


# Technologies Used in the Project

    React - for building the UI components.
    axios - for making HTTP requests.
    react-router-dom - for handling routing within the application.
    Context API - for managing global state, particularly authentication tokens.