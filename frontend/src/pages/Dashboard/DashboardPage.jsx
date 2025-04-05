import { useSelector } from "react-redux";
import AdminHome from "./AdminHome";
import InvestorHome from "./InvestorHome";
import StartupHome from "./StartupHome";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <div>Loading...</div>;

  switch (user.role) {
    case "admin":
      return <AdminHome />;
    case "investor":
      return <InvestorHome />;
    case "startup":
      return <StartupHome />;
    default:
      return <div>Unauthorized</div>;
  }
};

export default DashboardPage;
