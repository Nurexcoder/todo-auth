import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import ManuButton from "./Manu";

const CardComponent = styled(Card)`
    margin: 10px 10px;
    min-height: 200px;
    width: 220px;
    max-height: 400px;
    background-color: ${(props) =>
        props.tag === 0
            ? "	rgba(255,127,80,0.7) !important"
            : props.tag === 1
            ? "	rgba(0,191,255,0.5) !important"
            : "rgba(124,252,0,0.5) !important"};
    /* color: white !important; */
`;
const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Desc = styled.p`
    font-weight: 300;
    font-size: 0.9rem;
    line-height: 20px;
`;
const Tag = styled.span``;
export default function TodoCard({ todoData, isChanged, setIsChanged }) {
    return (
        <CardComponent tag={todoData.tag}>
            <CardContent>
                <CardHeader>
                    <Typography gutterBottom variant='h5' component='div'>
                        {todoData.title}
                    </Typography>
                    <ManuButton
                        data={todoData}
                        isChanged={isChanged}
                        setIsChanged={setIsChanged}
                    />
                </CardHeader>

                <Desc>{todoData.desc}</Desc>
            </CardContent>
        </CardComponent>
    );
}
