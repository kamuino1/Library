import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "semantic-ui-react";

function Statistics() {
  const [mostBorrowedBooks, setMostBorrowedBooks] = useState([]);
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Id, setId] = useState("books");

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchMostBorrowedBooks = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/stats/list-most-borrowed-books`
      );
      setMostBorrowedBooks(response.data);
    } catch (err) {
      setError("Lỗi khi tải danh sách sách được mượn nhiều nhất.");
      console.error(err);
    }
  };

  const fetchMostActiveUsers = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/stats/list-most-active-users`
      );
      setMostActiveUsers(response.data);
    } catch (err) {
      setError("Lỗi khi tải danh sách người dùng mượn sách nhiều nhất.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMostBorrowedBooks();
    fetchMostActiveUsers();
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const dropdownOptions = [
    {
      key: "books",
      text: "Thống kê theo sách mượn nhiều nhất",
      value: "books",
    },
    {
      key: "users",
      text: "Thống kê theo người dùng mượn nhiều nhất",
      value: "users",
    },
  ];

  return (
    <div className="container ">
      <h1>Thống kê thư viện</h1>
      <label className="form-label" htmlFor="borrowerId">
        Loại thống kê<span className="text-danger">*</span>
      </label>
      <br />
      <div className="semanticdropdown">
        <Dropdown
          placeholder="Chọn loại thống kê"
          fluid
          search
          selection
          value={Id}
          options={dropdownOptions}
          onChange={(event, data) => setId(data.value)}
          className="form-control"
        />
      </div>

      <div style={Id === "books" ? { display: "none" } : {}}>
        <h2>Thống kê sách mượn nhiều nhất</h2>
        {error && <p className="text-danger">{error}</p>}
        <table className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sách</th>
              <th>Số lần mượn</th>
            </tr>
          </thead>
          <tbody>
            {mostBorrowedBooks.map((book, index) => (
              <tr key={book.bookId}>
                <td>{index + 1}</td>
                <td>{book.bookName}</td>
                <td>{book.borrowCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={Id === "users" ? { display: "none" } : {}}>
        <h2>Thống kê người dùng mượn sách nhiều nhất</h2>
        <table className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên người dùng</th>
              <th>Số lần mượn</th>
            </tr>
          </thead>
          <tbody>
            {mostActiveUsers.map((user, index) => (
              <tr key={user.userId}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.borrowCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Statistics;
