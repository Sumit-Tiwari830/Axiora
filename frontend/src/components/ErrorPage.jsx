import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <Overlay>
                <Card>
                    <ErrorCode>404</ErrorCode>

                    <Heading>
                        Oops! Something went wrong
                    </Heading>

                    <Text>
                        The page you are looking for doesn't exist
                        or is temporarily unavailable.
                    </Text>

                    <Button
                        variant="contained"
                        onClick={() => navigate("/")}
                        sx={{
                            mt: 3,
                            borderRadius: "12px",
                            px: 4,
                            py: 1.2,
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        Back To Home
                    </Button>
                </Card>
            </Overlay>
        </Container>
    );
};

export default ErrorPage;

const Container = styled.div`
  width: 100%;
  height: 100vh;

  background-image: url(
    "https://images.pexels.com/photos/593158/pexels-photo-593158.jpeg"
  );

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(15, 23, 42, 0.65);
`;

const Card = styled.div`
  max-width: 650px;
  padding: 50px 40px;
  text-align: center;

  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);

  border-radius: 24px;

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

const ErrorCode = styled.h1`
  margin: 0;
  font-size: 6rem;
  font-weight: 800;
  color: #2563eb;
`;

const Heading = styled.h2`
  margin-top: 10px;
  margin-bottom: 20px;

  color: #0f172a;
  font-size: 2rem;
`;

const Text = styled.p`
  color: #475569;
  line-height: 1.8;
  font-size: 1.05rem;
`;