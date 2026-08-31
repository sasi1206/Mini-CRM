import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Nav from "./Nav";
import api from "../Config/api";
import "./Layout.css";

const Layout = () => {
  const [options, setOptions] = useState({});
  const navigate = useNavigate();

  async function getOptions() {
    try {
      const response = await api.get("/dashboard/options", {
        withCredentials: true,
      });
      if (response.data?.success) {
        setOptions(response?.data?.options);
      }
    } catch (error) {
      console.log("Error while fetching options", error);
      if (error?.response?.status === 401) {
        alert(error?.response?.data?.message);
        navigate("/");
        return;
      }
      alert(error?.response?.data?.message || error?.response?.message);
    }
  }

  useEffect(() => {
    getOptions();
  }, []);

  return (
    <>
      <Nav />
      <section className="working-cont">
        <section className="sidebar-cont">
          <Sidebar />
        </section>
        <section className="outlet-cont">
          <Outlet context={{ options }}/>
        </section>
      </section>
    </>
  );
};

export default Layout;
