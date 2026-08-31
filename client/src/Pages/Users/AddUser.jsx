import { Controller, useForm } from "react-hook-form";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../Config/api";
import "./AddUser.css";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AddUser = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  async function handleAddUser(formData) {
    try {
      const response = await api.post("/user", formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/dashboard/users");
      }
    } catch (error) {
      console.log("Error while adding user", error);
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
      alert(`Error while adding user: ${error?.response?.data?.message}`);
    }
  }

  return (
    <section className="add-user-cont">
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
            Add a user
          </Typography>
          <form
            noValidate
            onSubmit={handleSubmit(handleAddUser)}
            className="form-container"
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="Username"
                  size="small"
                  error={!!errors.username}
                  helperText={errors?.username?.message}
                  required
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="Email"
                  size="small"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  required
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="outlined-password-input"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  size="small"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  required
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              setShowPassword((prev) => !prev);
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />

            <ButtonGroup
              variant="outlined"
              aria-label="Add user button"
              sx={{ marginTop: "10px" }}
            >
              <Button variant="contained" type="submit">
                Save
              </Button>
              <Button
                color="error"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard/users");
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

export default AddUser;
