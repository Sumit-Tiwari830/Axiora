import styled from "styled-components";
import { Button } from "@mui/material";

export const BlueButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    color: #ffffff;
    border-radius: 10px;
    text-transform: none;
    font-weight: 600;
    padding: 8px 24px;
    box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
    transition: all 0.25s ease;

    &:hover {
      background: linear-gradient(135deg, #3730a3 0%, #4f46e5 100%);
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.45);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
    }
  }
`;

export const PurpleButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
    color: #ffffff;
    border-radius: 10px;
    text-transform: none;
    font-weight: 600;
    padding: 8px 24px;
    box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
    transition: all 0.25s ease;

    &:hover {
      background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%);
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
    }
  }
`;

export const LightPurpleButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: #ffffff;
    border-radius: 10px;
    text-transform: none;
    font-weight: 600;
    padding: 8px 24px;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
    transition: all 0.25s ease;

    &:hover {
      background: linear-gradient(135deg, #3730a3 0%, #5b21b6 100%);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
    }
  }
`;

export const GreenButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    color: #ffffff;
    border-radius: 10px;
    text-transform: none;
    font-weight: 600;
    padding: 8px 24px;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
    transition: all 0.25s ease;

    &:hover {
      background: linear-gradient(135deg, #047857 0%, #059669 100%);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }
  }
`;

export const RedButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
    color: #ffffff;
    border-radius: 10px;
    text-transform: none;
    font-weight: 600;
    padding: 8px 24px;
    box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
    transition: all 0.25s ease;

    &:hover {
      background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.45);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
    }
  }
`;

export const DarkRedButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%);
    color: #ffffff;
    border-radius: 10px;
    text-transform: none;
    font-weight: 600;
    padding: 8px 24px;
    box-shadow: 0 4px 14px rgba(153, 27, 27, 0.3);
    transition: all 0.25s ease;

    &:hover {
      background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
      box-shadow: 0 6px 20px rgba(153, 27, 27, 0.45);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(153, 27, 27, 0.3);
    }
  }
`;

export const BlackButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #ffffff;
    border-radius: 10px;
    text-transform: none;
    font-weight: 600;
    padding: 8px 24px;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.3);
    transition: all 0.25s ease;

    &:hover {
      background: linear-gradient(135deg, #020617 0%, #0f172a 100%);
      box-shadow: 0 6px 20px rgba(15, 23, 42, 0.45);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.3);
    }
  }
`;

export const BrownButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
    color: #ffffff;
    border-radius: 10px;
    text-transform: none;
    font-weight: 600;
    padding: 8px 24px;
    box-shadow: 0 4px 14px rgba(120, 53, 15, 0.3);
    transition: all 0.25s ease;

    &:hover {
      background: linear-gradient(135deg, #451a03 0%, #78350f 100%);
      box-shadow: 0 6px 20px rgba(120, 53, 15, 0.45);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(120, 53, 15, 0.3);
    }
  }
`;

export const IndigoButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
    color: #ffffff;
    border-radius: 10px;
    text-transform: none;
    font-weight: 600;
    padding: 8px 24px;
    box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
    transition: all 0.25s ease;

    &:hover {
      background: linear-gradient(135deg, #3730a3 0%, #4f46e5 100%);
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.45);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
    }
  }
`;