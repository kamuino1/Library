import React, { useContext, useEffect, useState } from "react";
import "../../AdminDashboard.css";
import axios from "axios";
import { AuthContext } from "../../../../../Context/AuthContext";
import { Dropdown } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";

function UpdateTransaction() {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const location = useLocation();
  const { transaction } = location.state || {};

  const [allBooks, setAllBooks] = useState([]);
  const [bookCountAvailable, setBookCountAvailable] = useState();
  const [transactionData, setTransactionData] = useState({
    bookId: "",
    bookName: "",
    userId: "",
    username: "",
    transactionType: "",
    fromDate: null,
    toDate: null,
  });

  const transactionTypes = [
    { value: "Reserved", text: "Đặt trước" },
    { value: "Issued", text: "Mượn" },
  ];

  useEffect(() => {
    if (transaction) {
      setTransactionData({
        bookId: transaction.bookId || "",
        bookName: transaction.bookName || "",
        userId: transaction.userId,
        username: transaction.username || "",
        transactionType: transaction.transactionType || "",
        fromDate: transaction.fromDate ? new Date(transaction.fromDate) : null,
        toDate: transaction.toDate ? new Date(transaction.toDate) : null,
      });
    }
  }, [transaction]);

  useEffect(() => {
    const getAllBooks = async () => {
      try {
        const response = await axios.get(API_URL + "api/books/allbooks");
        const dropBooks = response.data.map((book) => ({
          value: `${book._id}`,
          text: `${book.bookName}`,
          bookCountAvailable: book.bookCountAvailable,
        }));
        setAllBooks(dropBooks);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    getAllBooks();
  }, [API_URL]);

  useEffect(() => {
    if (transactionData.bookId && allBooks.length > 0) {
      const selectedBook = allBooks.find(
        (book) => book.value === transactionData.bookId
      );
      setBookCountAvailable(selectedBook?.bookCountAvailable || null);
    }
  }, [transactionData.bookId, allBooks]);

  const handleInputChange = (name, value) => {
    setTransactionData({
      ...transactionData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedBook = allBooks.find(
      (book) => book.value === transactionData.bookId
    );

    if (!selectedBook || selectedBook.bookCountAvailable <= 0) {
      alert("Số lượng sách không đủ để thực hiện giao dịch!");
      return;
    }
    const updatedTransaction = {
      ...transactionData,
      fromDate: moment(transactionData.fromDate).format("MM/DD/YYYY"),
      toDate: moment(transactionData.toDate).format("MM/DD/YYYY"),
      isAdmin: user.isAdmin,
    };

    try {
      await axios.put(
        `${API_URL}api/transactions/update-transaction/${transaction._id}`,
        updatedTransaction
      );
      alert("Phiên mượn cập nhật thành công");
      navigate("/dashboard@admin/managetransaction");
    } catch (err) {
      console.error("Lỗi cập nhật phiên mượn:", err);
    }
  };

  return (
    <div className="container">
      <h3 className="mt-4 mb-3">Cập nhật phiên mượn</h3>
      <div className="dashboard-title-line"></div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="bookId">
            Tên sách<span className="text-danger">*</span>
          </label>
          <Dropdown
            placeholder="Chọn sách"
            fluid
            search
            selection
            options={allBooks}
            value={transactionData.bookId}
            onChange={(e, data) => {
              const selectedBook = allBooks.find(
                (book) => book.value === data.value
              );
              setTransactionData((prev) => ({
                ...prev,
                bookId: data.value,
                bookName: selectedBook?.text || "",
              }));
              setBookCountAvailable(selectedBook?.bookCountAvailable || null);
            }}
          />
        </div>

        <p>
          Số bản copy:{" "}
          {bookCountAvailable !== null ? bookCountAvailable : "Không xác định"}
        </p>

        <div className="mb-3">
          <label className="form-label" htmlFor="transactionType">
            Loại giao dịch<span className="text-danger">*</span>
          </label>
          <Dropdown
            placeholder="Chọn loại giao dịch"
            fluid
            selection
            options={transactionTypes}
            value={transactionData.transactionType}
            onChange={(e, data) =>
              handleInputChange("transactionType", data.value)
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="fromDate">
            Ngày bắt đầu<span className="text-danger">*</span>
          </label>
          <DatePicker
            className="form-control"
            selected={transactionData.fromDate}
            onChange={(date) => handleInputChange("fromDate", date)}
            dateFormat="MM/dd/yyyy"
            minDate={new Date()}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="toDate">
            Ngày kết thúc<span className="text-danger">*</span>
          </label>
          <DatePicker
            className="form-control"
            selected={transactionData.toDate}
            onChange={(date) => handleInputChange("toDate", date)}
            dateFormat="MM/dd/yyyy"
            minDate={new Date()}
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Cập nhật
        </button>
      </form>
    </div>
  );
}

export default UpdateTransaction;
