import { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import "./Login.css";
import api from "../Config/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm();

  const navigate = useNavigate();

  async function handleLogin(formData) {
    try {
      const response = await api.post(
        "/auth/login",
        {
          email: formData?.email,
          password: formData?.password,
        },
        { withCredentials: true },
      );

      if (response.data.success) {
        alert(response.data.message);
        localStorage.setItem("username", response.data.username);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error when login", error);
      if (error?.response?.status === 422) {
        const { validationErrors } = error?.response?.data;
        console.log(validationErrors);
        for (const key in validationErrors) {
          setError(key, { type: "custom", message: validationErrors[key] });
        }
        return;
      }
      alert(`Error when login: ${error?.response?.data?.message}`);
    }
  }

  return (
    <section className="login-container">
      <Card sx={{ maxWidth: 250, border: "1px solid gray", padding: "5px" }}>
        <CardContent>
          <Typography
            sx={{
              color: "text.primary",
              fontSize: 20,
              textAlign: "center",
              margin: "0 0 15px 0",
            }}
          >
            MINI CRM
          </Typography>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="form-container"
            noValidate
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="outlined-basic"
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
            <Button
              style={{ margin: "10px 0 0 0" }}
              type="submit"
              variant="outlined"
              fullWidth
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default Login;
