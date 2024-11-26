import React from "react";
import "./css/Footer.css";

import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";

function Footer() {
  return (
    <div className="footer">
      <div>
        <div className="footer-data">
          <div className="contact-details">
            <h1>Contact Us</h1>
            <p>Librarian</p>
            <p>Government School</p>
            <p>Visakhapatnam-530041</p>
            <p>Andhra Pradesh</p>
            <p>India</p>
            <p>
              <b>Email:</b>example@gmail.com
            </p>
          </div>
          <div className="usefull-links">
            <h1>Usefull Links</h1>
            <a href="#home">Link-1</a>
            <a href="#home">Link-1</a>
            <a href="#home">Link-1</a>
            <a href="#home">Link-1</a>
          </div>
          <div className="librarian-details">
            <h1>Librarian</h1>
            <p>Name</p>
            <p>Education</p>
            <p>Contact: +91 9123456787</p>
          </div>
        </div>
        <div className="contact-social">
          <a href="#home" className="social-icon">
            <TwitterIcon style={{ fontSize: 40, color: "rgb(283,83,75)" }} />
          </a>
          <a href="#home" className="social-icon">
            <LinkedInIcon style={{ fontSize: 40, color: "rgb(283,83,75)" }} />
          </a>
          <a href="#home" className="social-icon">
            <TelegramIcon style={{ fontSize: 40, color: "rgb(283,83,75)" }} />
          </a>
          <a href="#home" className="social-icon">
            <InstagramIcon style={{ fontSize: 40, color: "rgb(283,83,75)" }} />
          </a>
        </div>
      </div>
      <div className="copyright-details">
        <p className="footer-copyright">
          &#169; 2024 copyright all right reserved
          <br />
        </p>
      </div>
    </div>
  );
}

export default Footer;
