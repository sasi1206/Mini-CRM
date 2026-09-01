import { Controller, useForm } from "react-hook-form";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import api from "../../Config/api";
import "./AddCompany.css";
import { useNavigate } from "react-router-dom";

const AddCompany = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const navigate = useNavigate();

  async function handleAddCompany(formData) {
    try {
      const response = await api.post("/company", formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/dashboard/companies");
      }
    } catch (error) {
      console.log("Error while adding company", error);
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
      alert(`Error while adding company: ${error?.response?.data?.message}`);
    }
  }

  return (
    <section className="add-company-cont">
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
            Add a company
          </Typography>
          <form
            noValidate
            onSubmit={handleSubmit(handleAddCompany)}
            className="form-container"
          >
            <Controller
              name="company_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="Company name"
                  size="small"
                  error={!!errors.company_name}
                  helperText={errors?.company_name?.message}
                  required
                />
              )}
            />

            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="Industry"
                  size="small"
                  error={!!errors?.industry}
                  helperText={errors?.industry?.message}
                  required
                />
              )}
            />

            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="Location"
                  size="small"
                  error={!!errors?.location}
                  helperText={errors?.location?.message}
                  required
                />
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
                  navigate("/dashboard/companies");
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

export default AddCompany;
