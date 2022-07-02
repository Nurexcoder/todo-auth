import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Button,
    IconButton,
    Input,
    InputAdornment,
    OutlinedInput,
    TextField,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { baseApi } from "../config";

const Component = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #3786e5;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Form = styled.form`
    width: 391px;
    height: 584px;
    border-radius: 41px;
    background: #ffffff;
`;
const Upper = styled.div`
    margin-top: 30px;
    flex: 3;
    width: 100%;
    /* height: 100%; */
`;
const Welcome = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const H = styled.h1``;
const Mgs = styled.span``;
const Lower = styled.div`
    margin-top: 60px;
    flex: 4;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    align-items: center;
    justify-content: center;
    /* padding: 20px 40px; */
`;
const InputField = styled(TextField)`
    width: 80%;
    margin: 10px 0 !important;
`;
const InputFieldPassword = styled(OutlinedInput)`
    width: 80%;
    margin: 10px 0 !important;
`;
const SubmitButton = styled(Button)`
    width: 80%;
    margin: 10px 0 !important;
    height: 50px;
`;

const LowerMost = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
`;

const Signup = () => {
    const navigator = useNavigate();
    const [values, setValues] = useState({
        password: "",

        showPassword: false,
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await baseApi.post("/auth/createuser", {
                email: e.target.email.value,
                password: e.target.password.value,
                name: e.target.name.value,
            });
            console.log(res);
            if (res.status === 200) {
                Swal.fire(
                    "Created",
                    "Your account has been successfully created",
                    "success"
                );
                navigator("/login");
                return;
            }
            if (res.status === 400) {
                Swal.fire(
                    "User exist",
                    "Email already exist please use another",
                    "waning"
                );
            }
        } catch (error) {
            console.log(error)
            if (error.response.status === 400) {
                Swal.fire(
                    "User exist",
                    "Email already exist please use another",
                    "waning"
                );
                return;
            }
            // Swal.fire("Error", "Something went wrong", "error");
        }
    };
    return (
        <Component>
            <Form onSubmit={handleSubmit}>
                <Upper>
                    <Welcome>
                        <H>Welcome </H>
                        <Mgs>Create a account to continue</Mgs>
                    </Welcome>
                </Upper>
                <Lower>
                    <InputField placeholder='Name' name='name' />
                    <InputField placeholder='Email' name='email' />
                    <InputFieldPassword
                        id='outlined-adornment-password'
                        name='password'
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={(e) => handleChange(e)}
                        endAdornment={
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge='end'>
                                    {values.showPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                        placeholder='Password'
                    />
                    <SubmitButton
                        type='submit'
                        color='success'
                        variant='contained'>
                        Submit
                    </SubmitButton>
                </Lower>
                <LowerMost>
                    Already have a account
                    <Link to='/login'>Click here</Link>
                </LowerMost>
            </Form>
        </Component>
    );
};

export default Signup;
