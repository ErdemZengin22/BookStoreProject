import { useContext} from "react";
import { AccessTokenContext } from "../../contexts/AccessTokenContext";

function Header() {
	const { logout} = useContext(AccessTokenContext);
return (
	<nav className="nav-cont">
		<div className="inner-container">
		<div className="nav-column">My BookShelf</div>
		<div className="nav-column">Search</div>
		<div className="nav-column"><button
          type="button"
          className="btn btn-primary mb-2"
          onClick={() => logout()}
        >
          Logout
        </button></div>
		</div>
	</nav>
);
};

export default Header;