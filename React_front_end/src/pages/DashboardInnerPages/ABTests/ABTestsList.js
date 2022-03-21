import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Col, Row, Table, Button} from "react-bootstrap";
import Icon from 'react-eva-icons';
import LogicTable from "../../../components/logicTable"
import {Link, useNavigate} from "react-router-dom";

const ABTestsList = () => {
    const navigation = useNavigate();
    function openAbTest(id){
        navigation("/dashboard/abTests/overview");
    }

    return (
        <div>
            <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                <Link to="/dashboard/dataSets/add" class={"btn"}>
                    <Button variant="primary">Add new <Icon name="plus-circle-outline"/></Button>
                </Link>
            </div>
            <LogicTable action={openAbTest} data={[["id", "name", "algoritme A", "algoritme B"], ["1", "H&M AB test 1", "Popularity", "Recency"]]}/>
        </div>
    );
};

export default ABTestsList;