import React, { useContext, useEffect, useState } from "react";
import "../../AdminDashboard.css";
import axios from "axios";
import { AuthContext } from "../../../../../Context/AuthContext";
import { Dropdown } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

function ManageTransaction() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { user } = useContext(AuthContext);

  const [borrowerId, setBorrowerId] = useState("");
  const [borrowerDetails, setBorrowerDetails] = useState([]);
  const [allMembers, setAllMembers] = useState([]);

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

  /* Delete Transaction */
  const handleDeleteTransaction = async (transactionId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa phiên mượn này?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${API_URL}api/transactions/remove-transaction/${transactionId}`,
          {
            data: { isAdmin: user.isAdmin },
          }
        );

        await axios.put(
          API_URL + `api/users/${transactionId}/delete-activetransactions`,
          {
            userId: borrowerId,
            isAdmin: user.isAdmin,
          }
        );

        setBorrowerDetails((prevDetails) => ({
          ...prevDetails,
          activeTransactions: prevDetails.activeTransactions.filter(
            (transaction) => transaction._id !== transactionId
          ),
        }));

        alert("Phiên mượn sách đã được xóa thành công!");
      } catch (err) {
        console.error("Lỗi khi xóa phiên mượn sách:", err);
        alert("Đã xảy ra lỗi khi xóa phiên mượn sách.");
      }
    }
  };

  /* return Transaction */
  const handlePrevTransaction = async (transactionId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn trả sách?");
    if (confirmDelete) {
      try {
        await axios.put(
          `${API_URL}api/transactions/update-transaction/${transactionId}`,
          {
            transactionStatus: "InActive",
            returnDate: moment(new Date()).format("MM/DD/YYYY"),
            isAdmin: user.isAdmin,
          }
        );

        await axios.put(
          `${API_URL}api/users/${transactionId}/move-to-prevtransactions`,
          {
            userId: borrowerId,
            isAdmin: user.isAdmin,
          }
        );

        // Cập nhật lại activeTransactions và thêm vào prevTransactions
        setBorrowerDetails((prevDetails) => {
          const updatedActiveTransactions =
            prevDetails.activeTransactions.filter(
              (transaction) => transaction._id !== transactionId
            );

          const movedTransaction = prevDetails.activeTransactions.find(
            (transaction) => transaction._id === transactionId
          );

          return {
            ...prevDetails,
            activeTransactions: updatedActiveTransactions,
            prevTransactions: [
              ...prevDetails.prevTransactions,
              movedTransaction,
            ],
          };
        });

        alert("Phiên mượn sách đã được chuyển sang lịch sử!");
      } catch (err) {
        console.error("Lỗi khi chuyển phiên mượn sách:", err);
        alert("Đã xảy ra lỗi khi chuyển phiên mượn sách.");
      }
    }
  };

  return (
    <div className="container">
      <h3 className="mt-4 mb-3">Quản lý phiên mượn</h3>
      <br />
      <Link to="/dashboard@admin/addtransaction">
        <button className="btn btn-success mb-2">Thêm phiên mượn</button>
      </Link>
      <div className="dashboard-title-line"></div>
      <label className="form-label" htmlFor="borrowerId">
        Người mượn<span className="text-danger">*</span>
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
          <th>Tên sách</th>
          <th>Phiên mượn</th>
          <th>Ngày bắt đầu</th>
          <th>Ngày kết thúc</th>
          <th>Ngày trả sách</th>
          <th>Phí muộn</th>
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
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteTransaction(data._id)}
                  >
                    Xóa
                  </button>
                  <Link
                    to={`/dashboard@admin/update-transaction/${data._id}`}
                    state={{ transaction: data }}
                  >
                    <button className="btn btn-primary ms-1">Cập nhật</button>
                  </Link>

                  <button
                    className="btn btn-success"
                    style={
                      data.transactionType === "Issued"
                        ? {}
                        : { display: "none" }
                    }
                    onClick={() => handlePrevTransaction(data._id)}
                  >
                    Trả sách
                  </button>
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

export default ManageTransaction;
