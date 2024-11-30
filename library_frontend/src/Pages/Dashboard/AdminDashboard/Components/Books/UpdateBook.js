import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Dropdown } from "semantic-ui-react";
import { useParams, useNavigate } from "react-router-dom";

import { AuthContext } from "../../../../../Context/AuthContext";

function UpdateBook() {
  const { id } = useParams(); // Lấy ID từ URL
  const API_URL = process.env.REACT_APP_API_URL;
  const { user } = useContext(AuthContext);

  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [bookData, setBookData] = useState({
    bookName: "",
    author: "",
    bookCountAvailable: "",
    language: "",
    publisher: "",
    categories: [], // Categories sẽ được lưu tại đây
  });
  const navigate = useNavigate(); // Khai báo useNavigate ở đây

  useEffect(() => {
    // Lấy tất cả các categories từ API
    const getAllCategories = async () => {
      try {
        const response = await axios.get(
          API_URL + "api/categories/allcategories"
        );
        const all_categories = response.data.map((category) => ({
          value: `${category._id}`, // Giá trị dùng trong dropdown
          label: `${category.categoryName}`, // Tên category hiển thị
        }));
        setAllCategories(all_categories);
      } catch (err) {
        console.log(err);
      }
    };
    getAllCategories();
  }, [API_URL]);

  useEffect(() => {
    // Lấy dữ liệu sách theo ID
    const getBookData = async () => {
      try {
        const response = await axios.get(`${API_URL}api/books/getbook/${id}`);
        const { categories, ...rest } = response.data;
        setBookData({
          ...rest,
          categories: categories.map((category) => category._id), // Gán các category đã chọn
        });
        setSelectedCategories(categories.map((category) => category._id)); // Cập nhật selectedCategories
      } catch (err) {
        console.error(
          "Error fetching book data:",
          err.response ? err.response.data : err.message
        );
      }
    };

    getBookData();
  }, [id, API_URL]);

  const handleInputChange = (e) => {
    setBookData({
      ...bookData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Cập nhật bookData.categories với selectedCategories
    const updatedBookData = {
      ...bookData,
      isAdmin: true,
      categories: selectedCategories, // Cập nhật categories trước khi gửi
    };
    try {
      const response = await axios.put(
        `${API_URL}api/books/updatebook/${id}`,
        updatedBookData
      );
      alert("Book updated successfully");
      navigate("/dashboard@admin/managebook"); // Chuyển hướng về trang quản lý sách
    } catch (err) {
      console.error("Error updating book:", err);
    }
  };

  return (
    <div>
      <h2>Update Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="bookName">
            Book Name
          </label>
          <input
            className="form-control"
            type="text"
            name="bookName"
            value={bookData.bookName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="author">
            Author Name
          </label>
          <input
            className="form-control"
            type="text"
            name="author"
            value={bookData.author}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="language">
            Language
          </label>
          <input
            className="form-control"
            type="text"
            name="language"
            value={bookData.language}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="publisher">
            Publisher
          </label>
          <input
            className="form-control"
            type="text"
            name="publisher"
            value={bookData.publisher}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="copies">
            No. of Copies Available
          </label>
          <input
            className="form-control"
            type="number"
            name="bookCountAvailable"
            value={bookData.bookCountAvailable}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="categories">
            Categories<span className="required-field">*</span>
          </label>
          <br />
          <Dropdown
            placeholder="Select Category"
            fluid
            multiple
            search
            selection
            required
            options={allCategories}
            value={selectedCategories}
            onChange={(event, value) => setSelectedCategories(value.value)}
            renderLabel={(label) => label.label}
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Update Book
        </button>
      </form>
    </div>
  );
}

export default UpdateBook;
