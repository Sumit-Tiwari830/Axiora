import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import styled from "styled-components";
import Students from "../assets/student.png";

const Homepage = () => {
    return (
        <Container>
            <HeroSection>
                <LeftSection>
                    <img src={Students} alt="students" style={{ width: '180%' }} />
                </LeftSection>

                <RightSection>
                    <LogoText>AXIORA</LogoText>

                    <Title>
                        Empowering Education
                        <br />
                        with <GradientText>Axiora</GradientText>
                    </Title>

                    <Description>
                        Manage students, teachers, classes, attendance,
                        notices, and academic performance from one intelligent
                        platform. Built for modern schools that value efficiency,
                        transparency, and growth.
                    </Description>

                    <ButtonContainer>
                        <StyledLink to="/choose">
                            <PrimaryButton>
                                Get Started
                            </PrimaryButton>
                        </StyledLink>

                        <StyledLink to="/chooseasguest">
                            <SecondaryButton>
                                Explore as Guest
                            </SecondaryButton>
                        </StyledLink>
                    </ButtonContainer>

                    <SignupText>
                        Don't have an account?{" "}
                        <StyledRegisterLink to="/Adminregister">
                            Create School
                        </StyledRegisterLink>
                    </SignupText>
                </RightSection>
            </HeroSection>
        </Container>
    );
};

export default Homepage;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #f8fafc,
    #eef2ff,
    #f5f3ff
  );
`;

const HeroSection = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  padding: 0 80px;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;

  img {
    width: 100%;
    max-width: 650px;
  }
`;

const RightSection = styled.div`
  flex: 1;
  max-width: 650px;
`;

const LogoText = styled.div`
  color: #7c3aed;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  margin-bottom: 15px;
`;

const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.1;
  color: #0f172a;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(
    90deg,
    #2563eb,
    #7c3aed
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Description = styled.p`
  font-size: 1.15rem;
  color: #475569;
  line-height: 1.8;
  margin-bottom: 35px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(Button)`
  && {
    background: linear-gradient(
      90deg,
      #2563eb,
      #7c3aed
    );
    color: white;
    padding: 14px 32px;
    border-radius: 12px;
    font-weight: 700;
    text-transform: none;
  }
`;

const SecondaryButton = styled(Button)`
  && {
    border: 2px solid #7c3aed;
    color: #7c3aed;
    padding: 12px 32px;
    border-radius: 12px;
    font-weight: 700;
    text-transform: none;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const SignupText = styled.p`
  color: #64748b;
  font-size: 1rem;
`;

const StyledRegisterLink = styled(Link)`
  text-decoration: none;
  color: #7c3aed;
  font-weight: 700;
`;