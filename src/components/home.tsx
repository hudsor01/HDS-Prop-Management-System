import React from "react";
import DashboardLayout from "./layout/DashboardLayout";
import StatsOverview from "./dashboard/StatsOverview";
import PropertyGrid from "./dashboard/PropertyGrid";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | Property Management</title>
        <meta
          name="description"
          content="View and manage your properties, tenants, and maintenance requests"
        />
      </Helmet>
      <DashboardLayout>
        <StatsOverview />
        <PropertyGrid />
      </DashboardLayout>
    </>
  );
};

export default Home;
