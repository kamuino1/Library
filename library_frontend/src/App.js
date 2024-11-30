import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import SignUp from "./Pages/Register.js";
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
import AddBook from "./Pages/Dashboard/AdminDashboard/Components/Books/AddBook.js";
import UpdateBook from "./Pages/Dashboard/AdminDashboard/Components/Books/UpdateBook.js";
import ManageBook from "./Pages/Dashboard/AdminDashboard/Components/Books/ManageBook.js";
import AddTransaction from "./Pages/Dashboard/AdminDashboard/Components/AddTransaction";
import AddMember from "./Pages/Dashboard/AdminDashboard/Components/AddMember";
import GetMember from "./Pages/Dashboard/AdminDashboard/Components/GetMember";
import Return from "./Pages/Dashboard/AdminDashboard/Components/Return";

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
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard@member"
            element={
              user ? (
                user.isAdmin === false ? (
                  <MemberDashboard />
                ) : (
                  <Navigate to="/dashboard@admin" />
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
                  <Navigate to="/dashboard@member" />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          >
            <Route path="managebook" element={<ManageBook />} />
            <Route path="addbook" element={<AddBook />} />
            <Route path="updatebook/:id" element={<UpdateBook />} />
            <Route path="addtransaction" element={<AddTransaction />} />
            <Route path="addmember" element={<AddMember />} />
            <Route path="getmember" element={<GetMember />} />
            <Route path="returntransaction" element={<Return />} />
          </Route>
          <Route path="/books" element={<Allbooks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
