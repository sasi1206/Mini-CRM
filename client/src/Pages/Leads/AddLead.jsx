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
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../Config/api";
import "./AddLead.css";

const AddLead = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const { options } = useOutletContext();

  const navigate = useNavigate();

  async function handleAddLead(formData) {
    console.log(formData);
    try {
      const response = await api.post("/lead", formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/dashboard/leads");
      }
    } catch (error) {
      console.log("Error when adding a lead", error);
      if (error?.response?.status === 422) {
        const { validationErrors } = error?.response?.data;
        console.log(validationErrors);
        for (const key in validationErrors) {
          setError(key, { type: "custom", message: validationErrors[key] });
        }
        return;
      }
      alert("Error when adding a lead:", error?.response?.data?.message);
    }
  }

  return (
    <section className="add-lead-cont">
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
            Add a lead
          </Typography>
          <form
            onSubmit={handleSubmit(handleAddLead)}
            className="form-container"
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="outlined-basic"
                  variant="outlined"
                  label="Name"
                  size="small"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
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
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="outlined-basic"
                  variant="outlined"
                  label="Phone"
                  size="small"
                  error={!!errors.phone}
                  helperText={errors?.phone?.message}
                  required
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors?.status}>
                  <FormLabel id={"status"}>Status</FormLabel>
                  <RadioGroup
                    {...field}
                    aria-labelledby={"status"}
                    row
                  >
                    <FormControlLabel
                      value="new"
                      control={<Radio size="small" />}
                      label="New"
                    />
                    <FormControlLabel
                      value="contacted"
                      control={<Radio size="small" />}
                      label="Contacted"
                    />
                    <FormControlLabel
                      value="lost"
                      control={<Radio size="small" />}
                      label="Lost"
                    />
                  </RadioGroup>
                  {errors?.status && (
                    <FormHelperText error>{errors?.status?.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />  

            <Controller
              name="assigned_to"
              control={control}
              render={({ field }) => (
                <FormControl
                  sx={{ minWidth: 120 }}
                  error={!!errors.assigned_to}
                >
                  <InputLabel id="assigned-to-label">Assigned To</InputLabel>
                  <Select
                    {...field}
                    labelId="assigned-to-label"
                    label="Assigned to"
                    size="small"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {options?.userOptions?.map((user, index) => (
                      <MenuItem key={`user ${index}`} value={user?._id}>
                        {user?.username}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors?.assigned_to && (
                    <FormHelperText error>
                      {errors?.assigned_to?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <FormControl sx={{ minWidth: 120 }} error={!!errors.company}>
                  <InputLabel id="company-label">Company</InputLabel>
                  <Select
                    {...field}
                    labelId="company-label"
                    label="Company"
                    size="small"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {options?.companyOptions?.map((company, index) => (
                      <MenuItem key={`company ${index}`} value={company?._id}>
                        {company?.company_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors?.company_id && (
                    <FormHelperText error>{errors?.company_id?.message}</FormHelperText>
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
                  navigate("/dashboard/leads");
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

export default AddLead;
