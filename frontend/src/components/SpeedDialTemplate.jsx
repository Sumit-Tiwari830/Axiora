import React from "react";
import {
    SpeedDial,
    SpeedDialAction,
    styled,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    color: white;
    width: 64px;
    height: 64px;
    box-shadow: 0 10px 25px rgba(124, 58, 237, 0.35);

    &:hover {
      background: linear-gradient(135deg, #1d4ed8, #6d28d9);
      transform: scale(1.05);
    }
  }

  .MuiSpeedDialAction-fab {
    background: white;
    color: #2563eb;

    &:hover {
      background: #eef2ff;
    }
  }
`;