import React, { useState } from "react";
import axios from "axios";
import { Dropdown } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css"; // Đảm bảo Bootstrap được import

function Register() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(null);
  const [dobString, setDobString] = useState("");

  const genderTypes = [
    { value: "Nam", text: "Nam" },
    { value: "Nữ", text: "Nữ" },
    { value: "Khác", text: "Khác" },
  ];

  // Add a Member
  const addMember = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      fullName &&
      username &&
      dobString &&
      gender &&
      address &&
      mobileNumber &&
      email &&
      password &&
      confirmPassword
    ) {
      if (password !== confirmPassword) {
        alert("Mật khẩu và xác nhận mật khẩu không khớp.");
        setIsLoading(false);
        return;
      }
      const userData = {
        fullName: fullName,
        username: username,
        dob: dobString,
        gender: gender,
        address: address,
        mobileNumber: mobileNumber,
        email: email,
        password: password,
      };

      try {
        const response = await axios.post(
          `${API_URL}api/auth/register`,
          userData
        );

        setFullName("");
        setUsername("");
        setAddress("");
        setMobileNumber("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setGender("");
        setDob(null);
        setDobString("");

        alert("Đăng ký thành công");
      } catch (err) {
        console.log(err);
        alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } else {
      alert("Phải điền các trường bắt buộc.");
    }
    setIsLoading(false);
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-4 shadow-sm"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <p className="h3 text-center mb-4">Đăng ký</p>
        <form onSubmit={addMember}>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Full Name<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              value={fullName}
              required
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email<span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password<span className="text-danger">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password<span className="text-danger">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="mobileNumber" className="form-label">
              Mobile Number<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="mobileNumber"
              value={mobileNumber}
              required
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="gender" className="form-label">
              Gender<span className="text-danger">*</span>
            </label>
            <Dropdown
              placeholder="Gender"
              fluid
              selection
              value={gender}
              options={genderTypes}
              onChange={(event, data) => setGender(data.value)}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="dob" className="form-label">
              Date of Birth<span className="text-danger">*</span>
            </label>
            <DatePicker
              className="form-control"
              placeholderText="MM/DD/YYYY"
              selected={dob}
              onChange={(date) => {
                setDob(date);
                setDobString(moment(date).format("MM/DD/YYYY"));
              }}
              dateFormat="MM/dd/yyyy"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
