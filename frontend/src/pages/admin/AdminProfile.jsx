import React from "react";
import { useSelector } from "react-redux";
import { Paper, Avatar, Divider } from "@mui/material";
import styled from "styled-components";

const AdminProfile = () => {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <PageWrapper>
            <ProfileCard>
                <AvatarBox>
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            fontSize: "3rem",
                            background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                        }}
                    >
                        {currentUser?.name?.charAt(0)?.toUpperCase() || "A"}
                    </Avatar>
                </AvatarBox>

                <Title>Admin Profile</Title>
                <SubTitle>Manage your account information</SubTitle>

                <Divider sx={{ mb: 3 }} />

                <InfoGrid>
                    <InfoCard>
                        <Label>Full Name</Label>
                        <Value>{currentUser?.name || "N/A"}</Value>
                    </InfoCard>

                    <InfoCard>
                        <Label>Email Address</Label>
                        <Value>{currentUser?.email || "N/A"}</Value>
                    </InfoCard>

                    <InfoCard>
                        <Label>School Name</Label>
                        <Value>{currentUser?.schoolName || "N/A"}</Value>
                    </InfoCard>

                    <InfoCard>
                        <Label>Role</Label>
                        <Value>Administrator</Value>
                    </InfoCard>
                </InfoGrid>
            </ProfileCard>
        </PageWrapper>
    );
};

export default AdminProfile;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px;
`;

const ProfileCard = styled(Paper)`
  width: 100%;
  max-width: 900px;
  padding: 40px;
  border-radius: 24px !important;
  background: white !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08) !important;
`;

const AvatarBox = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #0f172a;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  text-align: center;
  color: #64748b;
  margin-bottom: 30px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const InfoCard = styled.div`
  padding: 20px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
`;

const Label = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

const Value = styled.h3`
  color: #0f172a;
  font-weight: 600;
`;