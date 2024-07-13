import { Outlet } from "@remix-run/react";

const FaxStatus = () => {
  return (
    <>
      <h2>Fax Status</h2>
      <Outlet />
    </>
  );
};

export default FaxStatus;
