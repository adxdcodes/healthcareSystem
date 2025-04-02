import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNotesMedical } from "@fortawesome/free-solid-svg-icons";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { faCapsules } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faMicrochip } from "@fortawesome/free-solid-svg-icons";
import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import Header from "./Header";

const patient = {
  name: "John Doe",
  age: 32,
  gender: "Male",
  bloodGroup: "O+",
  contact: "+123 456 7890",
  email: "johndoe@example.com",
  lastVisit: "2024-03-20",
  healthConditions: ["Diabetes", "Hypertension"],
  medications: ["Metformin", "Amlodipine"],
  upcomingAppointments: [
    { date: "2024-04-10", doctor: "Dr. Smith", type: "General Checkup" },
  ],
};

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

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className=" bg-gray-900">
      <Header />{" "}
      <div className="flex transition-all">
        <div className="h-screen flex flex-col {`${collapsed ? 'w-16' : 'w-64'}`} transition-all">
          {/* Toggle Button */}
          <div className="p-4">
            <Button type="primary" onClick={toggleCollapsed}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </div>

          {/* Full Height Menu */}

          <div className="flex-grow">
            <Menu
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              mode="inline"
              theme="dark"
              inlineCollapsed={collapsed}
              items={items}
              className="h-full"
            />
          </div>
        </div>{" "}
        <div className="w-full h-full ">
          <div className="p-6 min-h-screen">
            <h2 className="text-3xl font-bold text-white mb-6">
              Welcome, {patient.name}
            </h2>

            {/* Profile Section */}
            <div className="bg-white p-6 shadow-md rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Profile Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <strong>Age:</strong> {patient.age}
                </p>
                <p>
                  <strong>Gender:</strong> {patient.gender}
                </p>
                <p>
                  <strong>Blood Group:</strong> {patient.bloodGroup}
                </p>
                <p>
                  <strong>Contact:</strong> {patient.contact}
                </p>
                <p>
                  <strong>Email:</strong> {patient.email}
                </p>
                <p>
                  <strong>Last Visit:</strong> {patient.lastVisit}
                </p>
              </div>
            </div>

            {/* Health Summary */}
            <div className="grid grid-cols-2 gap-6">
              {/* Health Conditions */}
              <div className="bg-white p-6 shadow-md rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Health Conditions
                </h3>
                <ul className="list-disc ml-6">
                  {patient.healthConditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>

              {/* Medications */}
              <div className="bg-white p-6 shadow-md rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Current Medications
                </h3>
                <ul className="list-disc ml-6">
                  {patient.medications.map((medication, index) => (
                    <li key={index}>{medication}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white p-6 shadow-md rounded-lg mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Upcoming Appointments
              </h3>
              {patient.upcomingAppointments.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Date</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Doctor
                      </th>
                      <th className="border border-gray-300 px-4 py-2">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.upcomingAppointments.map((appointment, index) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-300 px-4 py-2">
                          {appointment.date}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {appointment.doctor}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {appointment.type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No upcoming appointments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
