import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import { LightPurpleButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import Classroom from "../../../assets/classroom.png";
import styled from "styled-components";

const AddClass = () => {
    const [sclassName, setSclassName] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, currentUser, response, error, tempDetails } = useSelector(
        (state) => state.user
    );

    const adminID = currentUser?._id;
    const address = "Sclass";
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        sclassName,
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === "added" && tempDetails) {
            navigate("/Admin/classes/class/" + tempDetails._id);
            dispatch(underControl());
            setLoader(false);
        } else if (status === "failed") {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === "error") {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch, tempDetails]);

    return (
        <>
            <PageWrapper>
                <Card>
                    <ImageWrapper>
                        <img src={Classroom} alt="classroom" />
                    </ImageWrapper>

                    <Title>Create New Class</Title>

                    <SubTitle>
                        Add a new class to your school management system.
                    </SubTitle>

                    <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Class Name"
                                placeholder="Enter class name"
                                value={sclassName}
                                onChange={(e) => setSclassName(e.target.value)}
                                required
                            />

                            <LightPurpleButton
                                fullWidth
                                size="large"
                                variant="contained"
                                type="submit"
                                disabled={loader}
                            >
                                {loader ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    "Create Class"
                                )}
                            </LightPurpleButton>

                            <Button
                                variant="outlined"
                                onClick={() => navigate(-1)}
                                sx={{
                                    borderRadius: "12px",
                                }}
                            >
                                Go Back
                            </Button>
                        </Stack>
                    </form>
                </Card>
            </PageWrapper>

            <Popup
                message={message}
                setShowPopup={setShowPopup}
                showPopup={showPopup}
            />
        </>
    );
};

export default AddClass;

const PageWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
`;

const Card = styled(Box)`
  width: 100%;
  max-width: 650px;
  padding: 40px;
  border-radius: 24px;
  background: white;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  img {
    width: 220px;
    max-width: 100%;
  }
`;

const Title = styled(Typography)`
  && {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 10px;
  }
`;

const SubTitle = styled(Typography)`
  && {
    text-align: center;
    color: #64748b;
    margin-bottom: 30px;
  }
`;