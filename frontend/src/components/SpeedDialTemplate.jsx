import React from "react";
import {
    SpeedDial,
    SpeedDialAction,
    styled,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const SpeedDialTemplate = ({
    actions,
}) => {
    return (
        <CustomSpeedDial
            ariaLabel="axiora actions"
            icon={<AddIcon />}
            direction="left"
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={action.action}
                />
            ))}
        </CustomSpeedDial>
    );
};

export default SpeedDialTemplate;

const CustomSpeedDial = styled(SpeedDial)`
  position: fixed !important;
  bottom: 30px;
  right: 30px;

  .MuiSpeedDial-fab {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: #ffffff;
    width: 60px;
    height: 60px;
    box-shadow: 0 8px 24px rgba(79, 70, 229, 0.35);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: linear-gradient(135deg, #3730a3, #5b21b6);
      box-shadow: 0 12px 32px rgba(79, 70, 229, 0.45);
      transform: scale(1.05);
    }
  }

  .MuiSpeedDialAction-fab {
    background: #ffffff;
    color: #4f46e5;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.1);
    transition: all 0.2s ease;

    &:hover {
      background: #eef2ff;
      color: #3730a3;
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.2);
      transform: scale(1.08);
    }
  }

  .MuiSpeedDialAction-staticTooltipLabel {
    background: #0f172a;
    color: #ffffff;
    font-size: 0.8125rem;
    font-weight: 500;
    border-radius: 8px;
    padding: 6px 12px;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  }
`;