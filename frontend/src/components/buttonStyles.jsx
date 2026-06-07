import styled from "styled-components";
import { Button } from "@mui/material";

export const BlueButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    color: white;
    border-radius: 12px;
    text-transform: none;
    font-weight: 600;

    &:hover {
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
    }
  }
`;

export const PurpleButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #7c3aed, #8b5cf6);
    color: white;
    border-radius: 12px;
    text-transform: none;
    font-weight: 600;

    &:hover {
      background: linear-gradient(135deg, #6d28d9, #7c3aed);
    }
  }
`;

export const LightPurpleButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    color: white;
    border-radius: 12px;
    text-transform: none;
    font-weight: 600;
    padding: 12px;

    &:hover {
      background: linear-gradient(135deg, #1d4ed8, #6d28d9);
    }
  }
`;

export const GreenButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #059669, #10b981);
    color: white;
    border-radius: 12px;
    text-transform: none;
    font-weight: 600;

    &:hover {
      background: linear-gradient(135deg, #047857, #059669);
    }
  }
`;

export const RedButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: white;
    border-radius: 12px;
    text-transform: none;
    font-weight: 600;

    &:hover {
      background: linear-gradient(135deg, #b91c1c, #dc2626);
    }
  }
`;

export const DarkRedButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #991b1b, #dc2626);
    color: white;
    border-radius: 12px;
    text-transform: none;
    font-weight: 600;

    &:hover {
      background: linear-gradient(135deg, #7f1d1d, #b91c1c);
    }
  }
`;

export const BlackButton = styled(Button)`
  && {
    background: #0f172a;
    color: white;
    border-radius: 12px;
    text-transform: none;
    font-weight: 600;
    &:hover {
      background: #1e293b;
    }
  }
`;

export const BrownButton = styled(Button)`
  && {
    background: #78350f;
    color: white;
    border-radius: 12px;
    text-transform: none;
    font-weight: 600;
    &:hover {
      background: #92400e;
    }
  }
`;

export const IndigoButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #4338ca, #6366f1);
    color: white;
    border-radius: 12px;
    text-transform: none;
    font-weight: 600;

    &:hover {
      background: linear-gradient(135deg, #3730a3, #4f46e5);
    }
  }
`;