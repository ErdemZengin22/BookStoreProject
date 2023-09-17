import { useContext } from "react";
import { AccessTokenContext } from "../../contexts/AccessTokenContext";
import { Link } from "react-router-dom";

function Header() {
  const { logout } = useContext(AccessTokenContext);
  return (
    <nav className="nav-cont">
      <div className="inner-container">
        <div className="nav-column">
          <Link to="/bookshelf">My BookShelf</Link>
        </div>
        <div className="nav-column">
          <Link to="/search">Search</Link>
        </div>
        <div className="nav-column">
          <button
            type="button"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
