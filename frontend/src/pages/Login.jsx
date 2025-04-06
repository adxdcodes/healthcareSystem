import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/home-bg-im.jpg";
import { message } from "antd";

const Home = () => {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/routes/verifyToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            navigate("/dashboard");
          } else {
            localStorage.removeItem("token");
          }
        })
        .catch((err) => {
          console.error("Token verification failed:", err);
          localStorage.removeItem("token");
        });
    }
  }, [navigate]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return message.error("All fields are required", 1.5);
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return message.error(data.error || "Login failed", 1.5);
      }

      // Store token
      if (rememberMe) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      message.loading("Logging in...", 1.5);
      setTimeout(() => {
        message.success("Logged in!", 1);
        navigate("/dashboard");
      }, 1500);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      return message.error("Something went wrong", 1.5);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="z-10">
        <header
          className="w-full py-6 px-6 text-white text-center text-2xl font-bold"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          Welcome to HealthCare Portal
        </header>

        <div className="mt-20 p-6 bg-white shadow-lg rounded-lg w-[400px]">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Patient Login
          </h2>

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label className="mb-2 font-medium">
              Email &nbsp;<span className="text-xl text-red-600">*</span>
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="mb-5 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label className="mb-2 font-medium">
              Password &nbsp;<span className="text-xl text-red-600">*</span>
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="mb-5 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              Remember Me
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 bg-[#00a896] text-white py-2 rounded-lg transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#02c39a]"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#0066CC] underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
