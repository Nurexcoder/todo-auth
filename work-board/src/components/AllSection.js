import React, { useEffect, useState } from "react";
import TodoSection from "./TodoSection";
import styled from "styled-components";

import {
    Avatar,
    Button,
    Divider,
    
    IconButton,
    Input,
    InputAdornment,
    ListItemIcon,
    Menu,
    MenuItem,
    Modal,
    OutlinedInput,
    TextField,
    Tooltip,
} from "@mui/material";
import { Add,  Logout, Search } from "@mui/icons-material";
import AddTodo from "./AddTodo";
import { baseApi } from "../config";

const Component = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    /* overflow-y: scroll; */
    /* overflow-x: hidden; */
    align-items: flex-start;
    padding: 10px 0;
`;
const ManuComponent = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
    margin-right: 20px;
    margin-bottom: 20px;
`;
const AddTodoButton = styled(Button)`
    height: 40px !important;
    margin: 0 10px !important;
`;
const ArchiveButton = styled(Button)`
    height: 40px !important;
    margin: 0 10px;
`;
const Sections = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 90%;
    /* padding:0 0px ; */
`;
const SeachBar = styled(OutlinedInput)`
    /* width: ; */
    height: 40px !important;
    margin-right: 10px;
    /* padding: 0 !important; */
`;
const AllSection = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [todos, setTodos] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [quary, setQuary] = useState("");

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [archiveOpen, setArchiveOpen] = useState(false);

    const [isChanged, setIsChanged] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const openAnc = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseAnc = () => {
        setAnchorEl(null);
    };
  
    useEffect(() => {
        const getTodos = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await baseApi.get(
                "/posts",

                {
                    headers: {
                        authorization: "Barear " + user.authToken,
                    },
                }
            );
            setTodos(res.data);
            setFiltered(res.data)
        };
        getTodos();
    }, [isChanged]);

    useEffect(() => {
        const handleSearch = () => {
            if (quary !== "") {
                setFiltered(
                    todos.filter((todo) => {
                        if (
                            todo.title
                                .toLowerCase()
                                .includes(quary.toLowerCase()) ||
                            todo.desc
                                .toLowerCase()
                                .includes(quary.toLowerCase())
                        ) {
                            return todo;
                        }
                    })
                );
            } else {
                setFiltered(todos);
            }
        };
        handleSearch();
    }, [quary]);

    return (
        <Component>
            <ManuComponent>
                <SeachBar
                    id='input-with-icon-adornment'
                    variant='outlined'
                    onChange={(e) => setQuary(e.target.value)}
                    endAdornment={
                        <InputAdornment position='left'>
                            <Search />
                        </InputAdornment>
                    }
                />
                <AddTodoButton
                    variant='contained'
                    color='primary'
                    onClick={handleOpen}>
                    <Add />
                    Add Todo
                </AddTodoButton>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='modal-modal-title'
                    aria-describedby='modal-modal-description'>
                    <AddTodo
                        handleClose={handleClose}
                        isChanged={isChanged}
                        setIsChanged={setIsChanged}
                    />
                </Modal>

                <Tooltip title='Account settings'>
                    <IconButton
                        onClick={handleClick}
                        size='small'
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? "true" : undefined}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                            {user.name[0].toUpperCase()}
                        </Avatar>
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    id='account-menu'
                    open={openAnc}
                    onClose={handleCloseAnc}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            "&:before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{
                        horizontal: "right",
                        vertical: "top",
                    }}
                    anchorOrigin={{
                        horizontal: "right",
                        vertical: "bottom",
                    }}>
                 
                    <MenuItem>
                        <Avatar /> My account
                    </MenuItem>
                    <Divider />
                   
                    <MenuItem
                        onClick={() => {
                            localStorage.clear();
                            navigator("/login");
                        }}>
                        <ListItemIcon>
                            <Logout fontSize='small' />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </ManuComponent>
            <Sections>
                <TodoSection
                    todos={filtered}
                    setTodos={setFiltered}
                    isChanged={isChanged}
                    setIsChanged={setIsChanged}
                />
             
            </Sections>
        </Component>
    );
};

export default AllSection;
