import React from "react";
import bgImage from "../assets/home-bg-im.jpg";
const Home = () => {
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
        <div className="mt-20 p-6 bg-white shadow-lg rounded-lg w-[400px] ">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Patient Login
          </h2>
          <form className="flex flex-col">
            <label className="mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mb-5 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label className="mb-2 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mb-5 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button className="mt-4 cursor-pointer bg-[#00a896] text-white py-2 rounded-lg hover:bg-[#02c39a] transition">
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-[#0066CC] underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
