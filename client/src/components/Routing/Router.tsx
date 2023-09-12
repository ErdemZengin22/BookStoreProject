import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../Login/Login";
import Home from "../Home/Home";
import FileNotFound from "../FileNotFound/FileNotFound";
import BookDetails from "../BookDetails/BookDetails";

function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
      <Route path="*" element={<ProtectedRoute><FileNotFound /></ProtectedRoute>}/>
      <Route path="/book/:bookId" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
    </Routes>
  );
}

export default Router;
