import { BrowserRouter } from "react-router-dom";
import { AccessTokenProvider } from "./contexts/AccessTokenContext";
import Content from './Content';

function App() {
  return (
    <BrowserRouter>
      <AccessTokenProvider>
      <Content />
      </AccessTokenProvider>
    </BrowserRouter>
  );
}

export default App;
