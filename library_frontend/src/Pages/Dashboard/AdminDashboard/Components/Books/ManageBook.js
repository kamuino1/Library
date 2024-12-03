import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ManageBook() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [allBooks, setAllBooks] = useState([]);

  useEffect(() => {
    const getallBooks = async () => {
      const response = await axios.get(API_URL + "api/books/allbooks");
      console.log(response.data);
      setAllBooks(response.data);
    };
    getallBooks();
  }, [API_URL]);

  const handleDeleteBook = async (bookId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sách này?");
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}api/books/removebook/${bookId}`, {
          data: { isAdmin: true },
        });
        setAllBooks((prevBooks) =>
          prevBooks.filter((book) => book._id !== bookId)
        );
        alert("Xóa sách thành công!");
      } catch (err) {
        console.error("Lỗi khi xóa sách:", err);
        alert("Đã xảy ra lỗi khi xóa sách.");
      }
    }
  };

  return (
    <div className="manage-book">
      <h2>Quản lý sách</h2>

      <Link to="/dashboard@admin/addbook">
        <button className="add-book-button">Thêm sách</button>
      </Link>

      <div>
        <p className="dashboard-option-title">Tất cả sách</p>
        <div className="dashboard-title-line"></div>
        <table className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sách</th>
              <th>Ngày thêm</th>
              <th>Số lượng</th>
              <th>Quản lý</th>
            </tr>
          </thead>
          <tbody>
            {allBooks.map((book, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {book.bookName}
                  <br />
                  <small>
                    Danh mục:{" "}
                    {book.categories && book.categories.length > 0
                      ? book.categories.map((category) => (
                          <span key={index}>{category.categoryName} </span>
                        ))
                      : "Không có danh mục"}
                  </small>
                </td>
                <td>{book.createdAt.substring(0, 10)}</td>
                <td>{book.bookCountAvailable}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteBook(book._id)}
                  >
                    Delete
                  </button>
                  <Link to={`/dashboard@admin/updatebook/${book._id}`}>
                    <button className="btn btn-primary ms-4">Update</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageBook;
