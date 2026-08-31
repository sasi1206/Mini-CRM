import { Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../Config/api";
import "./Dashboard.css";
import { useEffect } from "react";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalLeads: 0,
    totalQualifiedLeads: 0,
    dueToday: 0,
    completed_tasks: 0,
  });

  const navigate = useNavigate();

  async function getData() {
    try {
      const response = await api.get("/dashboard", { withCredentials: true });
      if(response.data?.success){
        setDashboardData(response.data?.data);
      }
    } catch (error) {
      console.log("Error when fetching data", error);
      if (error?.response?.status === 401) {
        alert(error?.response?.data?.message);
        navigate("/");
        return;
      }
      alert(`Error while fetching data:${error?.response?.data?.message}`);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="dashboard-cont">
      <div className="header">
        <Typography
          sx={{
            color: "text.primary",
            fontSize: 20,
            padding: "10px",
            borderBottom: "1px solid black",
          }}
        >
          Dashboard
        </Typography>
      </div>
      <div className="card-cont">
        <Grid container spacing={2}>
          <Grid size={{ md: 12, lg: 3 }}>
            <div className="dashboard-card">
              <p className="title"> Total Leads</p>
              <p className="value">{dashboardData?.totalLeads}</p>
            </div>
          </Grid>
          <Grid size={{ md: 12, lg: 3 }}>
            <div className="dashboard-card">
              <p className="title">Qualified Leads </p>
              <p className="value">{dashboardData?.totalQualifiedLeads}</p>
            </div>
          </Grid>
          <Grid size={{ md: 12, lg: 3 }}>
            <div className="dashboard-card">
              <p className="title">Tasks Due Today</p>
              <p className="value">{dashboardData?.dueToday}</p>
            </div>
          </Grid>
          <Grid size={{ md: 12, lg: 3 }}>
            <div className="dashboard-card">
              <p className="title"> Completed Tasks</p>
              <p className="value">{dashboardData?.completed_tasks}</p>
            </div>
          </Grid>
        </Grid>
      </div>
    </section>
  );
};

export default Dashboard;
