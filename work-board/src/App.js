import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import TodoCard from "./components/TodoCard";
import AllSection from "./components/AllSection";
import styled from "styled-components";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { user } from "./config";

const Component = styled.div`
    margin: 0;
    padding: 0 10px;
    height: 100vh;
    overflow: hidden;
`;
function App() {
    const [data, setData] = useState();

    return (
        <Component>
            <Routes>
                <Route path='/home' element={<AllSection />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path="/" exact element={<Navigate to={user?'/home':'login'}/>}/>
            </Routes>
        </Component>
    );
}

export default App;
