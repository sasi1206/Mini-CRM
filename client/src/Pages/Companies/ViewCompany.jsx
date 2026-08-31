import { useLocation, useNavigate } from "react-router-dom";
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
import { ArrowBack } from "@mui/icons-material";

const ViewCompany = () => {
  const { company } = useLocation().state;
  const navigate = useNavigate();

  return (
    <section className="view-company-cont" style={{ padding: "10px" }}>
      <div
        className="head"
        style={{
          display: "flex",
        }}
      >
        <Button
          variant="text"
          size="small"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          <ArrowBack />
        </Button>
        <Typography sx={{ color: "text.primary", fontSize: 20 }}>
          View company
        </Typography>
      </div>
      <div className="header">
        <Typography sx={{ color: "text.primary", fontSize: 20 }}>
          Company name: {company?.company_name}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 18 }}>
          Industry: {company?.industry}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 18 }}>
          Location: {company?.location}
        </Typography>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Lead name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {company?.companyLeads?.map((lead) => (
                <TableRow
                  key={lead?.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{lead?.name}</TableCell>
                  <TableCell>{lead?.email}</TableCell>
                  <TableCell>{lead?.phone}</TableCell>
                  <TableCell>{lead?.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
};

export default ViewCompany;
