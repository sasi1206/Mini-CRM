import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../Config/api";
import "./Nav.css";

const Nav = () => {
  const navigate = useNavigate();
  async function Logout() {
    try {
      const response = await api.post(
        "/auth/logout",
        {},
        { withCredentials: true },
      );
      if (response.data?.success) {
        alert("Logout successfully");
        navigate("/");
      }
    } catch (error) {
      console.log("Error while logging out", error);
      if (error?.response?.status === 401) {
        alert(error?.response?.data?.message || error?.message);
        navigate("/");
        return;
      }
      alert(`Error while logging out: ${error?.response?.data?.message}`);
    }
  }

  return (
    <section className="nav-container">
      <div className="logo">
        <p>Logo</p>
      </div>
      <div className="user-actions">
        <p>{localStorage.getItem("username")}</p>
        <Button variant="contained" autoCapitalize="off" onClick={(e)=>{
          e.preventDefault();
          Logout()
        }}>
          Logout
        </Button>
      </div>
    </section>
  );
};

export default Nav;
