import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MemberDashboard from "./Pages/Dashboard/MemberDashboard/MemberDashboard.js";
import Allbooks from "./Pages/Allbooks";
import Header from "./Components/Header";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard/AdminDashboard.js";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext.js";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signin"
            element={
              user ? (
                user.isAdmin ? (
                  <Navigate to="/dashboard@admin" />
                ) : (
                  <Navigate to="/dashboard@member" />
                )
              ) : (
                <Signin />
              )
            }
          />
          <Route
            path="/dashboard@member"
            element={
              user ? (
                user.isAdmin === false ? (
                  <MemberDashboard />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/dashboard@admin"
            element={
              user ? (
                user.isAdmin === true ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/books" element={<Allbooks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
