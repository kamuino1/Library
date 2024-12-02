import React, { useContext, useEffect, useState } from "react";
import "../AdminDashboard.css";
import axios from "axios";
import { AuthContext } from "../../../../Context/AuthContext";
import { Dropdown } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

function AddTransaction() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const [borrowerId, setBorrowerId] = useState("");
  const [borrowerDetails, setBorrowerDetails] = useState([]);
  const [bookId, setBookId] = useState("");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [allBooks, setAllBooks] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [fromDateString, setFromDateString] = useState(null);

  const [toDate, setToDate] = useState(null);
  const [toDateString, setToDateString] = useState(null);

  const transactionTypes = [
    { value: "Reserved", text: "Reserve" },
    { value: "Issued", text: "Issue" },
  ];

  const [transactionType, setTransactionType] = useState("");

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
      const book_details = await axios.get(
        API_URL + "api/books/getbook/" + bookId
      );

      /* Checking weather the book is available or not */
      if (
        (book_details.data.bookCountAvailable > 0 &&
          (transactionType === "Issued" || transactionType === "Reserved")) ||
        (book_details.data.bookCountAvailable === 0 &&
          transactionType === "Reserved")
      ) {
        const transactionData = {
          bookId: bookId,
          userId: borrowerId,
          userName: borrower_details.data.userName,
          bookName: book_details.data.bookName,
          transactionType: transactionType,
          fromDate: fromDateString,
          toDate: toDateString,
          isAdmin: user.isAdmin,
        };
        try {
          const response = await axios.post(
            API_URL + "api/transactions/add-transaction",
            transactionData
          );
          if (recentTransactions.length >= 5) {
            recentTransactions.splice(-1);
          }
          await axios.put(
            API_URL +
              `api/users/${response.data._id}/move-to-activetransactions`,
            {
              userId: borrowerId,
              isAdmin: user.isAdmin,
            }
          );

          await axios.put(API_URL + "api/books/updatebook/" + bookId, {
            isAdmin: user.isAdmin,
            bookCountAvailable: book_details.data.bookCountAvailable - 1,
          });

          setRecentTransactions([response.data, ...recentTransactions]);
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
        alert("The book is not available");
      }
    } else {
      alert("Fields must not be empty");
    }
    setIsLoading(false);
  };

  /* Fetch Transactions */
  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await axios.get(
          API_URL + "api/transactions/all-transactions"
        );
        setRecentTransactions(response.data.slice(0, 5));
      } catch (err) {
        console.log("Error in fetching transactions");
      }
    };
    getTransactions();
  }, [API_URL]);

  /* Fetching borrower details */
  useEffect(() => {
    const getBorrowerDetails = async () => {
      try {
        if (borrowerId !== "") {
          const response = await axios.get(
            API_URL + "api/users/getuser/" + borrowerId
          );
          setBorrowerDetails(response.data);
        }
      } catch (err) {
        console.log("Error in getting borrower details");
      }
    };
    getBorrowerDetails();
  }, [API_URL, borrowerId]);

  /* Fetching members */
  useEffect(() => {
    const getMembers = async () => {
      try {
        const response = await axios.get(API_URL + "api/users/allmembers");
        const all_members = await response.data.map((member) => ({
          value: `${member?._id}`,
          text: `${
            member?.isAdmin
              ? `${member?.username} [Admin]`
              : `${member?.username} [Member]`
          }`,
        }));
        setAllMembers(all_members);
      } catch (err) {
        console.log(err);
      }
    };
    getMembers();
  }, [API_URL]);

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
      <h3 className="mt-4 mb-3">Add a Transaction</h3>
      <div className="dashboard-title-line"></div>
      <form onSubmit={addTransaction}>
        <label className="form-label" htmlFor="borrowerId">
          Borrower<span className="text-danger">*</span>
        </label>
        <br />
        <div className="semanticdropdown">
          <Dropdown
            placeholder="Select Member"
            fluid
            search
            selection
            value={borrowerId}
            options={allMembers}
            onChange={(event, data) => setBorrowerId(data.value)}
            className="form-control"
          />
        </div>
        <table
          className="table table-striped"
          style={borrowerId === "" ? { display: "none" } : {}}
        >
          <tr>
            <th>Name</th>
            <th>Issued</th>
            <th>Reserved</th>
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
            <th>Book Name</th>
            <th>Transaction</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Fine</th>
            <th>Quản lý</th>
          </tr>
          {borrowerDetails.activeTransactions
            ?.filter((data) => {
              return data.transactionStatus === "Active";
            })
            .map((data, index) => {
              return (
                <tr key={index}>
                  <td>{data.bookName}</td>
                  <td>{data.transactionType}</td>
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
                  <td>
                    <button className="btn btn-danger ">Delete</button>
                    <Link to={`/dashboard@admin/updatebook/${book._id}`}>
                      <button className="btn btn-primary ms-4">Update</button>
                    </Link>
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
            Book Name<span className="text-danger">*</span>
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
              onChange={(event, data) => setBookId(data.value)}
              className="form-control"
            />
          </div>
        </div>

        <table
          className="table table-striped"
          style={bookId === "" ? { display: "none" } : {}}
        >
          <tr>
            <th>Available Coipes</th>
            <th>Reserved</th>
          </tr>
        </table>

        <div
          style={bookId === "" ? { display: "none" } : {}}
          className="dashboard-title-line"
        ></div>

        <label className="form-label" htmlFor="transactionType">
          Transaction Type<span className="text-danger">*</span>
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
          From Date<span className="text-danger">*</span>
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
          To Date<span className="text-danger">*</span>
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
          value="Submit"
          disabled={isLoading}
        ></input>
      </form>

      <p className="dashboard-option-title">Recent Transactions</p>
      <div className="dashboard-title-line"></div>
      <table className="admindashboard-table">
        <tr>
          <th>S.No</th>
          <th>Book Name</th>
          <th>Borrower Name</th>
          <th>Date</th>
        </tr>
        {recentTransactions.map((transaction, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{transaction.bookName}</td>
              <td>{transaction.borrowerName}</td>
              <td>{transaction.updatedAt.slice(0, 10)}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default AddTransaction;
