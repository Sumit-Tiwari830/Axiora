import { useEffect, useState } from 'react';
import { IconButton, Box, Menu, MenuItem, ListItemIcon, Tooltip, Typography, Avatar } from '@mui/material';
import { Delete as DeleteIcon, PostAdd as PostAddIcon, PersonAddAlt1 as PersonAddAlt1Icon, AddCard as AddCardIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';

import styled from 'styled-components';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowClasses = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    const adminID = currentUser._id

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    if (error) {
        console.log(error)
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        dispatch(deleteUser(deleteID, address))
          .then(() => {
            dispatch(getAllSclasses(adminID, "Sclass"));
          })
    }

    const sclassColumns = [
        { id: 'name', label: 'Class Name', minWidth: 170 },
    ]

    const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
        return {
            name: sclass.sclassName,
            id: sclass._id,
        };
    })

    const SclassButtonHaver = ({ row }) => {
        const actions = [
            { icon: <PostAddIcon />, name: 'Add Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
            { icon: <PersonAddAlt1Icon />, name: 'Add Student', action: () => navigate("/Admin/class/addstudents/" + row.id) },
        ];
        return (
            <ButtonContainer>
                <IconButton onClick={() => deleteHandler(row.id, "Sclass")} color="secondary">
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton variant="contained"
                    onClick={() => navigate("/Admin/classes/class/" + row.id)}>
                    View
                </BlueButton>
                <ActionMenu actions={actions} />
            </ButtonContainer>
        );
    };

    const ActionMenu = ({ actions }) => {
        const [anchorEl, setAnchorEl] = useState(null);

        const open = Boolean(anchorEl);

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            setAnchorEl(null);
        };
        return (
            <>
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    <Tooltip title="Add Students & Subjects">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <span
                                style={{
                                    fontWeight: 600,
                                    marginRight: "6px",
                                }}
                            >
                                Add
                            </span>

                            <SpeedDialIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: styles.styledPaper,
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {actions.map((action) => (
                        <MenuItem onClick={action.action}>
                            <ListItemIcon fontSize="small">
                                {action.icon}
                            </ListItemIcon>
                            {action.name}
                        </MenuItem>
                    ))}
                </Menu>
            </>
        );
    }

    const actions = [
        {
            icon: <AddCardIcon color="primary" />, name: 'Add New Class',
            action: () => navigate("/Admin/addclass")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Classes',
            action: () => deleteHandler(adminID, "Sclasses")
        },
    ];

    return (
        <>
            {loading ?
                <Box sx={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem", fontWeight: 600, color: "#64748b" }}>
                    Loading Classes...
                </Box>
                :
                <Box sx={{ p: { xs: 2, md: 3 } }} className="animate-fadeInUp">
                    {/* Page Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ width: 52, height: 52, background: "linear-gradient(135deg, #06b6d4, #3b82f6)", boxShadow: "0 4px 16px rgba(6,182,212,0.3)" }}>
                                <AddCardIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={800} color="#0f172a">Classes</Typography>
                                <Typography color="#64748b" fontSize="0.88rem">
                                    {Array.isArray(sclassesList) ? sclassesList.length : 0} class{(Array.isArray(sclassesList) ? sclassesList.length : 0) !== 1 ? 'es' : ''} created
                                </Typography>
                            </Box>
                        </Box>
                        <GreenButton variant="contained" onClick={() => navigate("/Admin/addclass")} sx={{ borderRadius: "12px", px: 3, py: 1.2, fontWeight: 700, textTransform: "none" }}>
                            + Add Class
                        </GreenButton>
                    </Box>

                    {getresponse ? (
                        <Paper elevation={0} sx={{ p: 8, textAlign: "center", borderRadius: "20px", background: "rgba(79,70,229,0.02)", border: "1px dashed rgba(79,70,229,0.2)" }}>
                            <Avatar sx={{ width: 72, height: 72, background: "linear-gradient(135deg, #06b6d4, #3b82f6)", mx: "auto", mb: 2 }}>
                                <AddCardIcon sx={{ fontSize: 36 }} />
                            </Avatar>
                            <Typography variant="h6" fontWeight={700} color="#0f172a" mb={1}>No Classes Yet</Typography>
                            <Typography color="#64748b" mb={3}>Create your first class to start managing students and subjects.</Typography>
                            <GreenButton variant="contained" onClick={() => navigate("/Admin/addclass")} sx={{ borderRadius: "12px", px: 4, fontWeight: 700, textTransform: "none" }}>
                                Add First Class
                            </GreenButton>
                        </Paper>
                    ) : (
                        <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden', borderRadius: "20px", boxShadow: "0 4px 24px rgba(79,70,229,0.08)" }}>
                            {Array.isArray(sclassesList) && sclassesList.length > 0 &&
                                <TableTemplate buttonHaver={SclassButtonHaver} columns={sclassColumns} rows={sclassRows} />
                            }
                            <SpeedDialTemplate actions={actions} />
                        </Paper>
                    )}
                </Box>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ShowClasses;

const styles = {
    styledPaper: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
        '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
        },
        '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
        },
    }
}

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;