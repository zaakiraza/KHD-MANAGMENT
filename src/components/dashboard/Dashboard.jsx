import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBarMenu from "./SideBarMenu";

import Students from "./MenuItems/Student";
import Attendance from "./MenuItems/Attendance";
import NewAdmissions from "./MenuItems/NewAdmissions";
import Quizes from "./MenuItems/Quizes";
import Assignments from "./MenuItems/Assignments";
import Zoom from "./MenuItems/Zoom";
import Result from "./MenuItems/Result";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState("Students");

  useEffect(() => {
    const loginId = localStorage.getItem("loginId");
    if (!loginId) {
      alert("Token Expired!");
      navigate("/");
    }
  }, [navigate]);

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Students":
        return <Students />;
      case "Attendance":
        return <Attendance />;
      case "New Admissions":
        return <NewAdmissions />;
      case "Quizes":
        return <Quizes />;
      case "Assignments":
        return <Assignments />;
      case "Create Zoom Meeting":
        return <Zoom />;
      case "Result":
        return <Result />;
      default:
        return <Students />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBarMenu
        onSelect={setSelectedComponent}
        activeItem={selectedComponent}
      />
      <div style={{ width:"75%", height: "100vh",backgroundColor:"#e9e9e9" }}>{renderComponent()}</div>
    </div>
  );
}
