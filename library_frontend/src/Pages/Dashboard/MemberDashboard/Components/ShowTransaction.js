import React, { useContext, useEffect, useState } from "react";
import "../../AdminDashboard/AdminDashboard.css";
import axios from "axios";
import { AuthContext } from "../../../../Context/AuthContext";
import { Dropdown } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

function ShowTransaction() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { user } = useContext(AuthContext);

  const [borrowerId, setBorrowerId] = useState("");
  const [borrowerDetails, setBorrowerDetails] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      setBorrowerId(user._id);
    }
  }, [user]);

  /* Fetching borrower details */
  useEffect(() => {
    const getBorrowerDetails = async () => {
      try {
        if (borrowerId !== "") {
          const response = await axios.get(
            API_URL + "api/users/getuser/" + `${user._id}`
          );
          setBorrowerDetails(response.data);
        }
      } catch (err) {
        console.log("Error in getting borrower details");
      }
    };
    getBorrowerDetails();
  }, [API_URL, borrowerId]);

  return (
    <div className="container">
      <h3 className="mt-4 mb-3">Tất cả phiên mượn</h3>
      <br />
      <Link to="/dashboard@admin/addtransaction">
        <button className="btn btn-success mb-2">Đặt trước sách</button>
      </Link>
      <div className="dashboard-title-line"></div>

      <table
        className="table table-striped"
        style={borrowerId === "" ? { display: "none" } : {}}
      >
        <tr>
          <th>Tên sách</th>
          <th>Phiên mượn</th>
          <th>Ngày bắt đầu</th>
          <th>Ngày kết thúc</th>
          <th>Ngày trả sách</th>
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
                  {data.transactionType === "Issued"
                    ? "Chưa hoàn trả"
                    : "Chưa mượn sách"}
                </td>
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
        {borrowerDetails.prevTransactions?.map((data, index) => {
          return (
            <tr key={index}>
              <td>{data.bookName}</td>
              <td>Đã hoàn trả</td>
              <td>{data.fromDate}</td>
              <td>{data.toDate}</td>
              <td>{data.returnDate}</td>
              <td>
                {Math.floor(
                  (Date.parse(data.returnDate) - Date.parse(data.toDate)) /
                    86400000
                ) <= 0
                  ? 0
                  : Math.floor(
                      (Date.parse(data.returnDate) - Date.parse(data.toDate)) /
                        86400000
                    ) * 10}
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default ShowTransaction;
