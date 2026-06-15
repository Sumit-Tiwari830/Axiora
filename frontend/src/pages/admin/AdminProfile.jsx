import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Paper, Avatar, Divider, Button, TextField, Box, Typography } from "@mui/material";
import styled from "styled-components";
import { updateUser } from "../../redux/userRelated/userHandle";

const AdminProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [razorpayAccountId, setRazorpayAccountId] = useState(currentUser?.razorpayAccountId || "");

    const handleSave = () => {
        dispatch(updateUser({ razorpayAccountId }, currentUser._id, "Admin"));
        setIsEditing(false);
    };

    return (
        <PageWrapper>
            <ProfileCard>
                <AvatarBox>
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            fontSize: "3rem",
                            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
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

                    <InfoCard style={{ gridColumn: "1 / -1" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Label style={{ marginBottom: 0 }}>Razorpay Linked Account ID</Label>
                            {!isEditing ? (
                                <Button size="small" variant="outlined" onClick={() => setIsEditing(true)}>Edit</Button>
                            ) : (
                                <Box>
                                    <Button size="small" onClick={() => setIsEditing(false)} sx={{ mr: 1 }}>Cancel</Button>
                                    <Button size="small" variant="contained" onClick={handleSave}>Save</Button>
                                </Box>
                            )}
                        </Box>
                        
                        {!isEditing ? (
                            <Value>{currentUser?.razorpayAccountId || "Not configured"}</Value>
                        ) : (
                            <TextField 
                                size="small" 
                                fullWidth 
                                variant="outlined"
                                value={razorpayAccountId}
                                onChange={(e) => setRazorpayAccountId(e.target.value)}
                                placeholder="e.g. acc_1234567890"
                            />
                        )}
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                            Required to route student fee payments directly to the school's bank account via Razorpay Route.
                        </Typography>
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