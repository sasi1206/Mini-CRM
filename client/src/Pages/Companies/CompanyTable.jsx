import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Config/api";
import { useEffect } from "react";

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);

  async function getCompanies() {
    try {
      const response = await api.get("/company", { withCredentials: true });
      if (response.data.success) {
        setCompanies(response.data.companies);
      }
    } catch (error) {
      console.log("Error while fetching companies", error);
      if (error?.response?.status === 401) {
        alert(error?.response?.data?.message);
        return;
      }
      alert(
        `Error while fetching companies: ${error?.response?.data?.message}`,
      );
    }
  }

  useEffect(() => {
    getCompanies();
  }, []);

  const navigate = useNavigate();

  return (
    <section className="company-table-cont">
      <div className="header">
        <Typography
          sx={{
            color: "text.primary",
            fontSize: 20,
            padding: "10px",
            borderBottom: "1px solid black",  
          }}
        >
          Companies
        </Typography>
      </div>
      <div className="table-actions">
        <Button
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            navigate("add");
          }}
        >
          Add Company
        </Button>
      </div>
      <div className="lead-table">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Company name</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow
                  key={company?.company_name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{company?.company_name}</TableCell>
                  <TableCell>{company?.industry}</TableCell>
                  <TableCell>{company?.location}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("view", { state: { company } });
                      }}
                    >
                      View company
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
};

export default CompanyTable;
