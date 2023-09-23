import { useContext, useState, FormEvent } from "react";
import { AccessTokenContext } from "../../contexts/AccessTokenContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  // Utilize context and hooks to manage login state, navigation, and form inputs.
  const { login } = useContext(AccessTokenContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission for login.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // Make the POST request to authenticate the user.
      const response = await axios.request({
        method: "POST",
        url: "/api/signin",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          username,
          password,
        },
      });
      const { token } = response.data;
      if (!token) throw Error("Missing JWT token");
      login(token);
      navigate("/bookshelf", { replace: true });
    } catch (error) {
      console.error(error);
      // Handle potential errors, like invalid credentials or server issues.
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrorMessage("Invalid username or password");
      } else setErrorMessage("We are sorry, unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="inner-container">
        <h1>Login</h1>
        <form className="form-inline" method="POST" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="mr-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              required={true}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="mr-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            Login
          </button>
        </form>
        {isLoading && <p>Loading ...</p>}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
export default Login;
