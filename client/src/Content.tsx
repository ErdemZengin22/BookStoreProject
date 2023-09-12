import { useContext } from "react";
import { AccessTokenContext } from "./contexts/AccessTokenContext";
import Header from "./components/Header/Header";
import Router from "./components/Routing/Router";

function Content() {
  const { hasToken } = useContext(AccessTokenContext);

  return (
    <>
      {hasToken() && <Header />}
      <Router />
    </>
  );
}

export default Content;