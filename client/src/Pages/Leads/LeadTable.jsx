import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  ButtonGroup,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Config/api";
import "./LeadTable.css";

const LeadTable = () => {
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [leads, setLeads] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFilterStatus(e.target.value);
  };

  async function getLeads() {
    try {
      const response = await api.get("/lead", {
        params: {
          search: search || "",
          filter: filterStatus || "",
          page: page,
        },
        withCredentials: true,
      });
      if (response.data.success) {
        setLeads(response.data.leads);
        setTotalDocuments(response.data?.totalDocuments);
      }
    } catch (error) {
      console.log("Error while fetching leads", error);
      if (error?.response?.status === 401) {
        alert(error?.response?.data?.message);
        return;
      }
      alert(`Error while fetching leads: ${error?.response?.data?.message}`);
    }
  }

  async function deleteLead(leadId) {
    try {
      const response = await api.delete("/lead", {
        params: { id: leadId },
        withCredentials: true,
      });
      if (response.data.success) {
        alert(response?.data?.message);
        getLeads();
      }
    } catch (error) {
      console.log("Error while delete leads", error?.response);
      if (error?.response?.status === 401) {
        alert(error?.response?.data?.message);
        return;
      }
      alert(`Error while delete leads: ${error?.response?.data?.message}`);
    }
  }

  useEffect(() => {
    getLeads();
  }, [search, filterStatus, page]);

  return (
    <section className="lead-table-cont">
      <div className="header">
        <Typography
          sx={{
            color: "text.primary",
            fontSize: 20,
            padding: "10px",
            borderBottom: "1px solid black",
          }}
        >
          Leads
        </Typography>
      </div>
      <div className="table-actions">
        <TextField
          id="standard-basic"
          label="Search lead"
          variant="standard"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="filter-lead-with-status">Status</InputLabel>
          <Select
            labelId="filter-lead-with-status"
            value={filterStatus}
            label="Status"
            onChange={handleChange}
            size="small"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="contacted">Contacted</MenuItem>
            <MenuItem value="lost">Lost</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            navigate("add");
          }}
        >
          Add Lead
        </Button>
      </div>
      <div className="lead-table">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads?.map((lead) => (
                <TableRow
                  key={lead?._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{lead?.name}</TableCell>
                  <TableCell>{lead?.email}</TableCell>
                  <TableCell>{lead?.status}</TableCell>
                  <TableCell>{lead?.assigned_user}</TableCell>
                  <TableCell>
                    <ButtonGroup
                      variant="outlined"
                      aria-label="Add lead button"
                    >
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("edit", {
                            state: {
                              lead,
                            },
                          });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="error"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteLead(lead?._id);
                        }}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <TablePagination
        component="div"
        count={totalDocuments}
        page={page}
        onPageChange={(_, next) => {
          setPage(next);
        }}
        rowsPerPage={10}
        rowsPerPageOptions={[]}
        labelRowsPerPage=""
      />
    </section>
  );
};

export default LeadTable;
