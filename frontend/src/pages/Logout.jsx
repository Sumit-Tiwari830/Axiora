import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { authLogout } from "../redux/userRelated/userSlice";

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const currentUser = useSelector(
        (state) => state.user.currentUser
    );

    const handleLogout = () => {
        dispatch(authLogout());
        navigate("/");
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <PageWrapper>
            <LogoutCard>
                <Logo>AXIORA</Logo>

                <Avatar>
                    {currentUser?.name?.charAt(0)?.toUpperCase() || "A"}
                </Avatar>

                <UserName>
                    {currentUser?.name || "User"}
                </UserName>

                <Title>Logout Confirmation</Title>

                <Message>
                    Are you sure you want to logout from your
                    Axiora account?
                </Message>

                <ButtonGroup>
                    <LogoutButton onClick={handleLogout}>
                        Logout
                    </LogoutButton>

                    <CancelButton onClick={handleCancel}>
                        Cancel
                    </CancelButton>
                </ButtonGroup>
            </LogoutCard>
        </PageWrapper>
    );
};

export default Logout;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    135deg,
    #f8fafc,
    #eef2ff,
    #f5f3ff
  );
`;

const LogoutCard = styled.div`
  width: 420px;
  background: white;
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 25px;
  background: linear-gradient(
    90deg,
    #4f46e5,
    #7c3aed
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Avatar = styled.div`
  width: 90px;
  height: 90px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    #4f46e5,
    #7c3aed
  );
  color: white;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserName = styled.h2`
  color: #0f172a;
  margin-bottom: 10px;
`;

const Title = styled.h3`
  color: #1e293b;
  margin-bottom: 15px;
`;

const Message = styled.p`
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 30px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const LogoutButton = styled.button`
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  background: #ef4444;
  transition: 0.3s;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid #7c3aed;
  background: white;
  color: #7c3aed;
  transition: 0.3s;

  &:hover {
    background: #f5f3ff;
    transform: translateY(-2px);
  }
`;