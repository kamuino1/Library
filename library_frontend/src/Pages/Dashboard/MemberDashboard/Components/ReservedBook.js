import React, { useContext, useEffect, useState } from "react";
import "../../AdminDashboard/AdminDashboard.css";
import axios from "axios";
import { AuthContext } from "../../../../Context/AuthContext";
import { Dropdown } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import moment from "moment";
import { Link } from "react-router-dom";

function ReservedTransaction() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const [borrowerId, setBorrowerId] = useState("");
  const [borrowerDetails, setBorrowerDetails] = useState([]);
  const [bookDetails, setBookDetails] = useState([]);
  const [bookId, setBookId] = useState("");
  const [allMembers, setAllMembers] = useState([]);
  const [allBooks, setAllBooks] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [fromDateString, setFromDateString] = useState(null);

  const [toDate, setToDate] = useState(null);
  const [toDateString, setToDateString] = useState(null);

  const transactionTypes = [{ value: "Reserved", text: "Đặt trước" }];

  const [transactionType, setTransactionType] = useState("");

  useEffect(() => {
    if (user && user._id) {
      setBorrowerId(user._id);
    }
  }, [user]);

  /* Adding a Transaction */
  const addTransaction = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      bookId !== "" &&
      borrowerId !== "" &&
      transactionType !== "" &&
      fromDate !== null &&
      toDate !== null
    ) {
      const borrower_details = await axios.get(
        API_URL + "api/users/getuser/" + borrowerId
      );
      const book_details = await getBook(bookId);

      /* Checking weather the book is available or not */
      const transactionData = {
        bookId: bookId,
        userId: borrowerId,
        userName: borrower_details.data.userName,
        bookName: book_details.bookName,
        transactionType: transactionType,
        fromDate: fromDateString,
        toDate: toDateString,
        isAdmin: true,
      };
      console.log(transactionData);
      try {
        const response = await axios.post(
          API_URL + "api/transactions/add-transaction",
          transactionData
        );
        await axios.put(
          API_URL + `api/users/${response.data._id}/move-to-activetransactions`,
          {
            userId: borrowerId,
            isAdmin: true,
          }
        );
        await axios.put(API_URL + "api/books/updatebook/" + bookId, {
          isAdmin: true,
          bookCountAvailable: book_details.bookCountAvailable - 1,
        });

        setBorrowerId("");
        setBookId("");
        setTransactionType("");
        setFromDate(null);
        setToDate(null);
        setFromDateString(null);
        setToDateString(null);
        alert("Transaction was Successfull 🎉");
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Fields must not be empty");
    }
    setIsLoading(false);
  };

  /* Fetching borrower details */
  useEffect(() => {
    const getBorrowerDetails = async () => {
      try {
        if (borrowerId !== "") {
          const response = await axios.get(
            API_URL + "api/users/getuser/" + borrowerId
          );
          console.log(response.data);
          setBorrowerDetails(response.data);
        }
      } catch (err) {
        console.log("Error in getting borrower details");
      }
    };
    getBorrowerDetails();
  }, [API_URL, borrowerId]);

  const getBook = async (bookId) => {
    try {
      if (bookId !== "") {
        const response = await axios.get(
          API_URL + "api/books/getbook/" + bookId
        );
        setBookDetails(response.data);
        return response.data;
      }
    } catch (err) {
      console.log("Error in getting borrower details");
    }
  };

  /* Fetching books */
  useEffect(() => {
    const getallBooks = async () => {
      const response = await axios.get(API_URL + "api/books/allbooks");
      const allbooks = await response.data.map((book) => ({
        value: `${book._id}`,
        text: `${book.bookName}`,
      }));
      setAllBooks(allbooks);
    };
    getallBooks();
  }, [API_URL]);

  return (
    <div className="container">
      <h3 className="mt-4 mb-3">Thêm phiên mượn</h3>
      <div className="dashboard-title-line"></div>
      <form onSubmit={addTransaction}>
        <table className="table table-striped">
          <tr>
            <th>Tên người mượn</th>
            <th>Đã mượn</th>
            <th>Đặt trước</th>
          </tr>
          <tr>
            <td>{borrowerDetails.username}</td>
            <td>
              {
                borrowerDetails.activeTransactions?.filter((data) => {
                  return (
                    data.transactionType === "Issued" &&
                    data.transactionStatus === "Active"
                  );
                }).length
              }
            </td>
            <td>
              {
                borrowerDetails.activeTransactions?.filter((data) => {
                  return (
                    data.transactionType === "Reserved" &&
                    data.transactionStatus === "Active"
                  );
                }).length
              }
            </td>
          </tr>
        </table>

        <div
          style={borrowerId === "" ? { display: "none" } : {}}
          className="dashboard-title-line"
        ></div>

        <table
          className="table table-striped"
          style={borrowerId === "" ? { display: "none" } : {}}
        >
          <tr>
            <th>Tên sách</th>
            <th>Phiên mượn</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Phí muộn</th>
          </tr>
          {borrowerDetails.activeTransactions
            ?.filter((data) => {
              return data.transactionStatus === "Active";
            })
            .map((data, index) => {
              return (
                <tr key={index}>
                  <td>{data.bookName}</td>
                  <td>
                    {data.transactionType === "Issued"
                      ? "Đang mượn"
                      : "Đặt trước"}
                  </td>
                  <td>{data.fromDate}</td>
                  <td>{data.toDate}</td>
                  <td>
                    {Math.floor(
                      (Date.parse(moment(new Date()).format("MM/DD/YYYY")) -
                        Date.parse(data.toDate)) /
                        86400000
                    ) <= 0
                      ? 0
                      : Math.floor(
                          (Date.parse(moment(new Date()).format("MM/DD/YYYY")) -
                            Date.parse(data.toDate)) /
                            86400000
                        ) * 10}
                  </td>
                </tr>
              );
            })}
        </table>

        <div
          style={borrowerId === "" ? { display: "none" } : {}}
          className="dashboard-title-line"
        ></div>

        <div className="mb-3">
          <label className="form-label mt-3" htmlFor="bookName">
            Tên sách<span className="text-danger">*</span>
          </label>
          <br />
          <div className="semanticdropdown">
            <Dropdown
              placeholder="Select a Book"
              fluid
              search
              selection
              options={allBooks}
              value={bookId}
              onChange={async (event, data) => {
                setBookId(data.value);
                const bookData = await getBook(data.value);
                setBookDetails(bookData);
              }}
              className="form-control"
            />
          </div>
        </div>

        <table
          className="table table-striped"
          style={bookId === "" ? { display: "none" } : {}}
        >
          <tr>
            <th>Số bản copy</th>
            <th>Đặt trước</th>
          </tr>
          <tr>
            <td>{bookDetails.bookCountAvailable}</td>
            <td>
              {
                bookDetails.transactions?.filter((data) => {
                  return data.transactionType === "Reserved";
                }).length
              }
            </td>
          </tr>
        </table>

        <div
          style={bookId === "" ? { display: "none" } : {}}
          className="dashboard-title-line"
        ></div>

        <label className="form-label" htmlFor="transactionType">
          Loại phiên mượn<span className="text-danger">*</span>
        </label>
        <br />
        <div className="semanticdropdown">
          <Dropdown
            placeholder="Select Transaction"
            fluid
            selection
            value={transactionType}
            options={transactionTypes}
            onChange={(event, data) => setTransactionType(data.value)}
            className="form-control"
          />
        </div>
        <br />

        <label className="form-label" htmlFor="from-date">
          Ngày bắt đầu<span className="text-danger">*</span>
        </label>
        <br />
        <DatePicker
          className="date-picker"
          placeholderText="MM/DD/YYYY"
          selected={fromDate}
          onChange={(date) => {
            setFromDate(date);
            setFromDateString(moment(date).format("MM/DD/YYYY"));
          }}
          minDate={new Date()}
          dateFormat="MM/dd/yyyy"
        />
        <br />
        <label className="form-label mt-3" htmlFor="to-date">
          Ngày kết thúc<span className="text-danger">*</span>
        </label>
        <br />
        <DatePicker
          className="date-picker"
          placeholderText="MM/DD/YYYY"
          selected={toDate}
          onChange={(date) => {
            setToDate(date);
            setToDateString(moment(date).format("MM/DD/YYYY"));
          }}
          minDate={new Date()}
          dateFormat="MM/dd/yyyy"
        />
        <br />
        <input
          className="form-submit mt-3 btn btn-primary"
          type="submit"
          value="Đặt trước"
          disabled={isLoading}
        ></input>
      </form>
    </div>
  );
}

export default ReservedTransaction;
