import React from "react";
import Footer from "../components/Footer";
import bgImage from "../assets/home-bg-im.jpg";
const Home = () => {
  return (
    <div className="mt-20 flex flex-col items-center h-screen">
      <h1>This is default Landing page! </h1>
      <p>
        To Login.... &nbsp;
        <a href="/Login" className="text-[#0066CC] underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default Home;
