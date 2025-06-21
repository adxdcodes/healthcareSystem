import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNotesMedical,
  faCalendarCheck,
  faCapsules,
  faGear,
  faRightFromBracket,
  faMicrochip,
} from "@fortawesome/free-solid-svg-icons";
import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import { message } from "antd";
import Header from "../components/Header";

// Menu Items
// Menu Items

const items = [
  {
    key: "1",
    icon: <FontAwesomeIcon icon={faNotesMedical} />,
    label: "My Health Records",
  },
  {
    key: "2",
    icon: <FontAwesomeIcon icon={faCalendarCheck} />,
    label: "Appointments",
  },
  {
    key: "3",
    icon: <FontAwesomeIcon icon={faCapsules} />,
    label: "Prescriptions",
  },
  {
    key: "4",
    label: "AI Health Predictions",
    icon: <FontAwesomeIcon icon={faMicrochip} />,
  },
  {
    key: "5",
    label: "Emergency Contacts",
    icon: <AppstoreOutlined />,
  },
  {
    key: "6",
    icon: <FontAwesomeIcon icon={faGear} />,
    label: "Settings & Profile",
  },
  {
    key: "7",
    icon: <FontAwesomeIcon icon={faRightFromBracket} />,
    label: "Logout",
  },
];

// ... your imports remain unchanged

const App = () => {
  const [patientId, setPatientId] = useState(
    sessionStorage.getItem("patientId")
  );

  useEffect(() => {
    const storedId = sessionStorage.getItem("patientId");
    setPatientId(storedId);
  }, [location.pathname]);

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleMenuClick = ({ key }) => {
    if (key === "7") {
      const hide = message.loading("Logging out...", 1.5);
      setTimeout(() => {
        hide();
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        message.success("Logged out successfully!", 1);
        navigate("/login");
      }, 1500);
    } else if (key === "4") {
      navigate("/chat");
    } else if (key === "1") {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      fetch("http://localhost:5000/routes/verifyToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
        })
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    bloodType: "",
    allergies: "",
    medicalConditions: "",
    medications: "",
    emergencyContact: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "http://localhost:5000/routes/complete-profile",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, patientId }),
      }
    );

    if (response.ok) {
      navigate("/dashboard");
    } else {
      alert("Error submitting profile. Please try again.");
    }
  };

  return (
    <div className="bg-gray-900">
      <Header />
      <div className="flex w-full transition-all">
        {/* Sidebar */}
        <div
          className={`h-screen flex flex-col ${
            collapsed ? "w-20" : "w-64"
          } transition-all`}
        >
          <div className="p-4">
            <Button type="primary" onClick={toggleCollapsed}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </div>
          <div className="flex-grow">
            <Menu
              defaultSelectedKeys={["6"]}
              mode="inline"
              theme="dark"
              inlineCollapsed={collapsed}
              items={items}
              onClick={handleMenuClick}
              className="h-full"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full min-h-screen bg-gray-100 p-10">
          <div className="bg-white relative shadow-lg rounded-xl w-full p-10 overflow-y-auto">
            <h2 className="text-3xl font-semibold mb-8 text-center text-blue-700">
              Complete Your Medical Profile
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {/* Age */}
                <div>
                  <label className="block font-medium mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block font-medium mb-1">Gender</label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Blood Type */}
                <div>
                  <label className="block font-medium mb-1">Blood Type</label>
                  <input
                    type="text"
                    name="bloodType"
                    placeholder="e.g., A+, B-, O+"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Allergies */}
                <div>
                  <label className="block font-medium mb-1">
                    Known Allergies
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    placeholder="e.g., Penicillin, Nuts"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Medical Conditions */}
                <div>
                  <label className="block font-medium mb-1">
                    Medical Conditions
                  </label>
                  <input
                    type="text"
                    name="medicalConditions"
                    placeholder="e.g., Diabetes, Hypertension"
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Medications */}
                <div>
                  <label className="block font-medium mb-1">
                    Current Medications
                  </label>
                  <input
                    type="text"
                    name="medications"
                    placeholder="e.g., Metformin, Aspirin"
                    value={formData.medications}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Emergency Contact */}
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    placeholder="Name or phone number"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  type="submit"
                  className="px-10 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  Submit Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
