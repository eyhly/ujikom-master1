import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import smallLogo from "../../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useState({ username: "", password: "" });
  const [isLoading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const user = localStorage.getItem("userToken");
    if (user && location.pathname !== "/") {
      navigate("/services");
    }
  }, [navigate, location]);

  const login = async () => {
    const { username, password } = params;
    setLoading(true);
    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (data.role === "Admin") {
            localStorage.setItem("userToken", data.token);
            navigate("/services");
        } else {
            alert("Anda tidak memiliki akses");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Terjadi kesalahan saat login");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="body-login">
      <div className="container mt-1">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="cardt">
              <div className="card-body">
                <h5 className="card-title text-center">Login</h5>
                <img src={smallLogo} alt="Small Logo" className="small-logo" />
                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faUserCircle} />
                    </span>
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    className="form-control"
                    value={params.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="form-control"
                    value={params.password}
                    onChange={handleChange}
                  />
                </div>
                <button
                  className="login-button"
                  onClick={login}
                  disabled={isLoading}
                >
                  {isLoading ? "Sedang Masuk..." : "Masuk"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
