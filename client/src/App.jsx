import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Layout from "./Common/Layout";
import Dashboard from "./Pages/Dashboard";
import LeadTable from "./Pages/Leads/LeadTable";
import AddLead from "./Pages/Leads/AddLead";
import CompanyTable from "./Pages/Companies/CompanyTable";
import AddCompany from "./Pages/Companies/AddCompany";
import EditLead from "./Pages/Leads/EditLead";
import ViewCompany from "./Pages/Companies/ViewCompany";
import TaskTable from "./Pages/Tasks/TaskTable";
import AddTask from "./Pages/Tasks/AddTask";
import UserTable from "./Pages/Users/UserTable";
import AddUser from "./Pages/Users/AddUser";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="leads">
          <Route index element={<LeadTable />} />
          <Route path="add" element={<AddLead />} />
          <Route path="edit" element={<EditLead />} />
        </Route>
        <Route path="companies">
          <Route index element={<CompanyTable />} />
          <Route path="view" element={<ViewCompany />} />
          <Route path="add" element={<AddCompany />} />
        </Route>
        <Route path="tasks">
          <Route index element={<TaskTable />} />
          <Route path="add" element={<AddTask />} />
        </Route>
        <Route path="users">
          <Route index element={<UserTable />} />
          <Route path="add" element={<AddUser />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
