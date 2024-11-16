import { Link } from "react-router-dom";
import styled from "styled-components";

const Dashboard = () => {
  return (
    <DashBoardContainer>
      User dashgsfdgfsdg fdsgdfsg gsdfg dfsgdsfg
      <Link to="/admin">Admin</Link>
    </DashBoardContainer>
  );
};

export default Dashboard;

const DashBoardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
