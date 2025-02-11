import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../Login/Login";
import Home from "../Home/Home";
import FileNotFound from "../FileNotFound/FileNotFound";
import BookDetails from "../BookDetails/BookDetails";
import BookShelf from "../BookShelf/BookShelf";
import Search from "../Search/Search";

function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/book/:bookId" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
      <Route path="/bookshelf" element={<ProtectedRoute><BookShelf /></ProtectedRoute>} />
      <Route path="*" element={<ProtectedRoute><FileNotFound /></ProtectedRoute>} />
    </Routes>
  );
}

export default Router;
