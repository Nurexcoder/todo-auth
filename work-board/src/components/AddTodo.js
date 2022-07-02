import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { baseApi } from "../config";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    height: 400,
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
};

const Form = styled.form`
    padding: 30px 20px;
`;
const Input = styled(TextField)`
    margin-top: 20px !important;
    width: 100%;
`;
const AddButton = styled(Button)`
    margin-top: 20px !important;
    width: 30%;
`;
export default function AddTodo({
    handleClose,
    isChanged,
    setIsChanged,
    data,
}) {
    const handleSubmit = async (e) => {
        const user = JSON.parse(localStorage.getItem("user"));
        e.preventDefault();
        try {
            console.log(data);
            if (data) {
                const res = await baseApi.put(
                    `/posts/${data._id}`,
                    {
                        title: e.target.title.value,
                        desc: e.target.desc.value,
                    },
                    {
                        headers: {
                            authorization: "Barear " + user.authToken,
                        },
                    }
                );
            } else {
                const res = await baseApi.post(
                    "/posts",
                    {
                        title: e.target.title.value,
                        desc: e.target.desc.value,
                    },
                    {
                        headers: {
                            authorization: "Barear " + user.authToken,
                        },
                    }
                );
            }
        } catch (error) {
            console.log(error);
        }

        setIsChanged(!isChanged);
        handleClose();
    };
    return (
        <div>
            <Box sx={style}>
                <Typography id='modal-modal-title' align='center' variant='h4'>
                    {data ? "Update" : "Add"} Todo
                </Typography>
                <Form onSubmit={handleSubmit}>
                    <Input
                        id='outlined-basic'
                        label='Title'
                        defaultValue={data ? data.title : ""}
                        variant='outlined'
                        name='title'
                    />
                    <Input
                        id='outlined-basic'
                        label='Description'
                        variant='outlined'
                        defaultValue={data ? data.desc : ""}
                        multiline
                        name='desc'
                        minRows={5}
                    />

                    <AddButton
                        type='submit'
                        variant='contained'
                        color='success'>
                        <Add /> Add
                    </AddButton>
                </Form>
            </Box>
        </div>
    );
}
