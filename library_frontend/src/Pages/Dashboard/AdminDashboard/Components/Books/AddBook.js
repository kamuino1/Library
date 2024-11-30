import React, { useContext, useEffect, useState } from "react";
import "../../AdminDashboard.css";
import axios from "axios";
import { AuthContext } from "../../../../../Context/AuthContext";
import { Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function AddBook() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [bookCountAvailable, setBookCountAvailable] = useState(null);
  const [language, setLanguage] = useState("");
  const [publisher, setPublisher] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [recentAddedBooks, setRecentAddedBooks] = useState([]);

  /* Fetch all the Categories */
  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await axios.get(
          API_URL + "api/categories/allcategories"
        );
        const all_categories = await response.data.map((category) => ({
          value: `${category._id}`,
          label: `${category.categoryName}`,
        }));
        setAllCategories(all_categories);
      } catch (err) {
        console.log(err);
      }
    };
    getAllCategories();
  }, [API_URL]);

  /* Adding book function */
  const addBook = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const BookData = {
      bookName: bookName,
      author: author,
      bookCountAvailable: bookCountAvailable,
      language: language,
      publisher: publisher,
      categories: selectedCategories,
      isAdmin: user.isAdmin,
    };
    try {
      const response = await axios.post(
        API_URL + "api/books/addbook",
        BookData
      );
      if (recentAddedBooks.length >= 5) {
        recentAddedBooks.splice(-1);
      }
      setRecentAddedBooks([response.data, ...recentAddedBooks]);
      setBookName("");
      setAuthor("");
      setBookCountAvailable(null);
      setLanguage("");
      setPublisher("");
      setSelectedCategories([]);
      alert("Thêm sách thành công");
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const getallBooks = async () => {
      const response = await axios.get(API_URL + "api/books/allbooks");
      setRecentAddedBooks(response.data.slice(0, 5));
    };
    getallBooks();
  }, [API_URL]);

  return (
    <div>
      <p className="dashboard-option-title">Add a Book</p>
      <div className="mt-3 mb-3 d-flex">
        <Link to="/dashboard@admin/managebook">
          <button className="add-book-button ml-3">Manage Books</button>
        </Link>
      </div>
      <div className="dashboard-title-line"></div>
      <form className="addbook-form" onSubmit={addBook}>
        <div className="mb-3">
          <label className="form-label" htmlFor="bookName">
            Book Name<span className="required-field">*</span>
          </label>
          <input
            className="form-control"
            type="text"
            name="bookName"
            value={bookName}
            onChange={(e) => {
              setBookName(e.target.value);
            }}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="author">
            Author Name<span className="required-field">*</span>
          </label>
          <input
            className="form-control"
            type="text"
            name="author"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
            }}
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
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
            }}
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
            value={publisher}
            onChange={(e) => {
              setPublisher(e.target.value);
            }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="copies">
            No. of Copies Available<span className="required-field">*</span>
          </label>
          <input
            className="form-control"
            type="text"
            name="copies"
            value={bookCountAvailable}
            onChange={(e) => {
              setBookCountAvailable(e.target.value);
            }}
            required
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

        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          Submit
        </button>
      </form>

      <div>
        <p className="dashboard-option-title">Recently Added Books</p>
        <div className="dashboard-title-line"></div>
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Book Name</th>
              <th>Added Date</th>
            </tr>
          </thead>
          <tbody>
            {recentAddedBooks.map((book, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{book.bookName}</td>
                <td>{book.createdAt.substring(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddBook;
