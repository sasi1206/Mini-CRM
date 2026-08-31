import { Controller, useForm } from "react-hook-form";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../Config/api";
import "./AddTask.css";

const AddTask = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const { options } = useOutletContext();

  const navigate = useNavigate();

  async function handleAddTask(formData) {
    try {
      const response = await api.post("/task", formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/dashboard/tasks");
      }
    } catch (error) {
      console.log("Error while adding task", error);
      if (error?.response?.status === 401) {
        alert(error?.response?.data?.message || error?.message);
        return;
      }
      if (error?.response?.status === 422) {
        const { validationErrors } = error?.response?.data;
        console.log(validationErrors);
        for (const key in validationErrors) {
          setError(key, { type: "custom", message: validationErrors[key] });
        }
        return;
      }
      alert(`Error while adding task: ${error?.response?.data?.message}`);
    }
  }

  return (
    <section className="add-task-cont">
      <Card
        sx={{
          width: "50%",
          border: "1px solid gray",
          padding: "5px",
          marginBottom: "20px",
        }}
      >
        <CardContent>
          <Typography
            sx={{
              color: "text.primary",
              fontSize: 20,
              textAlign: "center",
              margin: "0 0 15px 0",
            }}
          >
            Add a task
          </Typography>
          <form
            noValidate
            onSubmit={handleSubmit(handleAddTask)}
            className="form-container"
          >
            <Controller
              name="task_title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="Task title"
                  size="small"
                  error={!!errors.task_title}
                  helperText={errors?.task_title?.message}
                  required
                />
              )}
            />

            <Controller
              name="lead_id"
              control={control}
              render={({ field }) => (
                <FormControl sx={{ minWidth: 120 }} error={!!errors.company}>
                  <InputLabel id="task-label">Lead</InputLabel>
                  <Select
                    {...field}
                    labelId="task-label"
                    label="Lead"
                    size="small"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {options?.leadOptions?.map((lead, index) => (
                      <MenuItem key={`lead ${index}`} value={lead?._id}>
                        {lead?.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors?.lead_id && (
                    <FormHelperText error>
                      {errors?.lead_id?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="due_date"
              control={control}
              render={({ field }) => (
                <FormControl sx={{ minWidth: 120 }} error={!!errors.due_date}>
                  <input type="date" {...field} placeholder="due date" />
                  {errors?.due_date && (
                    <FormHelperText error>
                      {errors?.due_date?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors?.status}>
                  <FormLabel id={"status"}>Status</FormLabel>
                  <RadioGroup {...field} aria-labelledby={"status"} row>
                    <FormControlLabel
                      value="pending"
                      control={<Radio size="small" />}
                      label="Pending"
                    />
                    <FormControlLabel
                      value="done"
                      control={<Radio size="small" />}
                      label="Done"
                    />
                  </RadioGroup>
                  {errors?.status && (
                    <FormHelperText error>
                      {errors?.status?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <ButtonGroup
              variant="outlined"
              aria-label="Add lead button"
              sx={{ marginTop: "10px" }}
            >
              <Button variant="contained" type="submit">
                Save
              </Button>
              <Button
                color="warning"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard/tasks");
                }}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default AddTask;
