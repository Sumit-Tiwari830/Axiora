import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Paper,
    Box,
    Container,
    CircularProgress,
    Backdrop,
} from "@mui/material";
import {
    AccountCircle,
    School,
    Group,
} from "@mui/icons-material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";

const ChooseUser = ({ visitor }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const password = "zxc";

    const { status, currentUser, currentRole } = useSelector(
        (state) => state.user
    );

    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const navigateHandler = (user) => {
        if (user === "Admin") {
            navigate("/Adminlogin");
        } else if (user === "Student") {
            navigate("/Studentlogin");
        } else if (user === "Teacher") {
            navigate("/Teacherlogin");
        }
    };

    useEffect(() => {
        if (status === "success" || currentUser !== null) {
            if (currentRole === "Admin") {
                navigate("/Admin/dashboard");
            } else if (currentRole === "Student") {
                navigate("/Student/dashboard");
            } else if (currentRole === "Teacher") {
                navigate("/Teacher/dashboard");
            }
        }

        if (status === "error") {
            setLoader(false);
            setMessage("Network Error");
            setShowPopup(true);
        }
    }, [status, currentRole, navigate, currentUser]);

    return (
        <StyledContainer>
            <Container maxWidth="xl">
                <PageTitle>Choose Your Role</PageTitle>

                <PageSubtitle>
                    Select how you want to access Axiora
                </PageSubtitle>

                <CardContainer>
                    <StyledPaper elevation={0} onClick={() => navigateHandler("Admin")}>
                        <IconWrapper>
                            <AccountCircle sx={{ fontSize: 42 }} />
                        </IconWrapper>

                        <StyledTypography>
                            Administrator
                        </StyledTypography>

                        <CardText>
                            Manage students, teachers, classes, attendance,
                            notices and complete school operations.
                        </CardText>
                    </StyledPaper>

                    <StyledPaper elevation={0} onClick={() => navigateHandler("Student")}>
                        <IconWrapper>
                            <School sx={{ fontSize: 42 }} />
                        </IconWrapper>

                        <StyledTypography>
                            Student
                        </StyledTypography>

                        <CardText>
                            View attendance, notices, academic records,
                            results and school updates.
                        </CardText>
                    </StyledPaper>

                    <StyledPaper elevation={0} onClick={() => navigateHandler("Teacher")}>
                        <IconWrapper>
                            <Group sx={{ fontSize: 42 }} />
                        </IconWrapper>

                        <StyledTypography>
                            Teacher
                        </StyledTypography>

                        <CardText>
                            Manage classes, subjects, assignments,
                            attendance and student performance.
                        </CardText>
                    </StyledPaper>
                </CardContainer>

                <Backdrop
                    sx={{
                        color: "#fff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={loader}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Popup
                    message={message}
                    setShowPopup={setShowPopup}
                    showPopup={showPopup}
                />
            </Container>
        </StyledContainer>
    );
};

export default ChooseUser;

const StyledContainer = styled.div`
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
  padding: 40px 20px;
`;

const PageTitle = styled.h1`
  text-align: center;
  font-size: 3rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 10px;
`;

const PageSubtitle = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 60px;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
`;

const StyledPaper = styled(Paper)`
  && {
    width: 320px;
    height: 300px;

    padding: 30px;
    border-radius: 24px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-align: center;
    cursor: pointer;

    background: rgba(255, 255, 255, 0.95);

    transition: all 0.3s ease;

    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 25px 50px rgba(124, 58, 237, 0.2);
    }
  }
`;

const IconWrapper = styled(Box)`
  width: 75px;
  height: 75px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 20px;

  background: linear-gradient(
    135deg,
    #2563eb,
    #7c3aed
  );

  color: white;
  margin-bottom: 20px;
`;

const StyledTypography = styled.h2`
  color: #0f172a;
  font-weight: 700;
  margin-bottom: 15px;
`;

const CardText = styled.p`
  color: #64748b;
  line-height: 1.7;
`;