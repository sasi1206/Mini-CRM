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

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);

  async function getTasks() {
    try {
      const response = await api.get("/task", { withCredentials: true });
      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.log("Error while fetching tasks", error);
      if (error?.response?.status === 401) {
        alert(error?.response?.data?.message);
        return;
      }
      alert(`Error while fetching tasks: ${error?.response?.data?.message}`);
    }
  }

  async function updateTask(task_id, lead_id) {
    try {
      const response = await api.put(
        "/task",
        { task_id, lead_id },
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        alert(response?.data?.message);
        getTasks();
      }
    } catch (error) {
      console.log("Error while updating tasks", error?.response);
      if (error?.response?.status === 401) {
        alert(error?.response?.data?.message);
        return;
      }
      alert(`Error while updating tasks: ${error?.response?.data?.message}`);
    }
  }
  useEffect(() => {
    getTasks();
  }, []);

  const navigate = useNavigate();

  return (
    <section className="task-table-cont">
      <div className="header">
        <Typography
          sx={{
            color: "text.primary",
            fontSize: 20,
            padding: "10px",
            borderBottom: "1px solid black",
          }}
        >
          Tasks
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
          Add Task
        </Button>
      </div>
      <div className="task-table">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Lead</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow
                  key={task?.task_title}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{task?.task_title}</TableCell>
                  <TableCell>{task?.lead}</TableCell>
                  <TableCell>
                    {new Date(task?.due_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{task?.status}</TableCell>
                  <TableCell>
                    <Button
                      disabled={task?.status === "done"}
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        updateTask(task?._id, task?.lead_id);
                      }}
                    >
                      Done
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

export default TaskTable;
