import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import DeleteIcon from "@mui/icons-material/Delete";
import SyncIcon from "@mui/icons-material/Sync";
import DoneIcon from "@mui/icons-material/Done";
import { baseApi, user } from "../config";
import { Edit } from "@mui/icons-material";
import { Modal } from "@mui/material";
import AddTodo from "./AddTodo";

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        {...props}
    />
))(({ theme }) => ({
    "& .MuiPaper-root": {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === "light"
                ? "rgb(55, 65, 81)"
                : theme.palette.grey[300],
        boxShadow:
            "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        "& .MuiMenu-list": {
            padding: "4px 0",
        },
        "& .MuiMenuItem-root": {
            "& .MuiSvgIcon-root": {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            "&:active": {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                ),
            },
        },
    },
}));

export default function ManuButton({ data, isChanged, setIsChanged }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [openUpdate, setOpenUpdate] = useState(false);
    const handleOpen = () => setOpenUpdate(true);
    const handleUpdateClose = () => setOpenUpdate(false);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleUpdate = () => {
        setOpenUpdate(true);
        handleClose();
    };

    const handleDelete = async () => {
        console.log(data);
        try {
            const res = await baseApi.delete(`/posts/${data._id}`, {
                headers: {
                    authorization: "Barear " + user.authToken,
                },
            });
            handleClose();
            setIsChanged(!isChanged);
        } catch (error) {}
    };
    return (
        <div>
            <Button
                id='demo-customized-button'
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup='true'
                aria-expanded={open ? "true" : undefined}
                disableElevation
                onClick={handleClick}
                sx={{ color: "black" }}>
                <MoreHorizIcon />
            </Button>
            <StyledMenu
                id='demo-customized-menu'
                MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}>
                <MenuItem onClick={handleUpdate} disableRipple>
                    <Edit />
                    Edit
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem onClick={handleDelete} disableRipple>
                    <DeleteIcon />
                    Delete
                </MenuItem>
            </StyledMenu>
                <Modal
                    open={openUpdate}
                    onClose={handleUpdateClose}
                    aria-labelledby='modal-modal-title'
                    aria-describedby='modal-modal-description'>
                    <AddTodo
                        handleClose={handleUpdateClose}
                        isChanged={isChanged}
                        setIsChanged={setIsChanged}
                        data={data}
                    />
                </Modal>
        </div>
    );
}
