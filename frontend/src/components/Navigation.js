import React from "react";
import { Link, withRouter } from "react-router-dom";
import Logo from './images/linebigwhite@4x.png';

function Navigation(props) {
  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-info fixed-top">
        <div className="container">
          <Link className="navbar-brand" to="/">
          <img
              className="img-fluid rounded mb-4 mb-lg-0"
              src={Logo} width="200 px" height="200 px"
              //alt=""
            /> 
          </Link>

          <div>
            <ul className="navbar-nav ml-auto">
              <li
                className={`nav-item  ${
                  props.location.pathname === "/" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/">
                  Home
                  <span className="sr-only">(current)</span>
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/UploadPage" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/UploadPage">
                  Upload
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/DatasetPage" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/DatasetPage">
                  Datasets
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/About" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/About">
                  About
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/Contact" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/Contact">
                  Contact
                </Link>
              </li>


             

              
              
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(Navigation);