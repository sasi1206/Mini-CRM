import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const dashboardNavigation = [
    {
      path: "/dashboard",
      name: "Dashboard",
    },
    {
      path: "/dashboard/leads",
      name: "Leads",
    },
    {
      path: "/dashboard/companies",
      name: "Companies",
    },
    {
      path: "/dashboard/tasks",
      name: "Tasks",
    },
    {
      path: "/dashboard/users",
      name: "Users",
    },
  ];

  return (
    <section className="sidebar">
      {dashboardNavigation.map(({ name, path }) => (
        <NavLink
          to={path}
          className={({ isActive }) =>
            `sidebar-element ${isActive ? "sidebar-active" : ""}`
          }
          end={name === "Dashboard"}
        >
          {name}
        </NavLink>
      ))}
    </section>
  );
};
export default Sidebar;
