import React from "react";
import { useState } from "react";
import Footer from "../components/Footer";
import bgImage from "../assets/home-bg-im.jpg";
const Home = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Sending data to backend
    fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.error("Registration Error:", err));
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center bg-no-repeat filter"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="z-10">
        {/* Landing Page Header */}
        <header
          className="w-full py-6 px-6 text-white text-center text-2xl font-bold"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          Welcome to HealthCare Portal
        </header>

        {/* Login Section */}
        <div className="mt-15 p-6 bg-white shadow-lg rounded-lg w-[400px] ">
          <h2 className="text-2xl font-semibold text-center mb-5">
            Patient Register
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="mb-2 font-medium">First Name</label>
            <input
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              type="text"
              placeholder="Enter your first name"
              className="outline-none mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label className="mb-2 font-medium">Last Name</label>
            <input
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              type="text"
              placeholder="Enter your last name"
              className="mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label className="mb-2 font-medium">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter your email"
              className="mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label className="mb-2 font-medium">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter your password"
              className="mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              className="mt-4 cursor-pointer bg-[#00a896] text-white py-2 rounded-lg hover:bg-[#02c39a] transition"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            have an account?{" "}
            <a href="/login" className="text-[#0066CC] underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
