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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Config/api";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  async function getUsers() {
    try {
      const response = await api.get("/user", { withCredentials: true });
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.log("Error while fetching users", error);
      if (error?.response?.status === 401) {
        alert(error?.response?.data?.message);
        navigate("/");
        return;
      }
      alert(`Error while fetching users: ${error?.response?.data?.message}`);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <section className="user-table-cont">
      <div className="header">
        <Typography
          sx={{
            color: "text.primary",
            fontSize: 20,
            padding: "10px",
            borderBottom: "1px solid black",
          }}
        >
          Users
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
          Add User
        </Button>
      </div>
      <div className="user-table" style={{ padding: "10px" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user?._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{user?.username}</TableCell>
                  <TableCell>{user?.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
};

export default UserTable;
