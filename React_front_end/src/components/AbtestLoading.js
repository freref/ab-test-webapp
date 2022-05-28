import React, {useEffect, useState} from "react";
import {Button, Card, Col, ProgressBar, Row, Spinner} from "react-bootstrap";
import io from 'socket.io-client';
import {toast} from "react-toastify";
import TabelSkeleton from "./loadingSkeletons/tabelSkeleton";

class AbtestLoading extends React.Component {
    state = {
        times: {},
        loading: true
    }

    componentWillUnmount() {
        this.socket.close()
        console.log("component unmounted")
    }

    padTo2Digits(num) {
      return num.toString().padStart(2, '0');
    }

     convertMsToHM(milliseconds) {
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);

      seconds = seconds % 60;
      minutes = minutes % 60;
      hours = hours % 24;

      return `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}:${this.padTo2Digits(seconds)}`;
    }

    componentDidMount() {
        var websocket = "http://localhost:8000"
            this.socket = io.connect(websocket, {
            reconnection: true,
            // transports: ['websocket']
        });
        console.log("socket ok");
        let temploading = false;
        this.setState({times: {}, loading:temploading})
        this.socket.on("newData", message => {
            console.log("responseMessage", message)
            let tempDict = this.state.times;
            if(message[1] !== null){
                let miliSecondsEstimation = (message[1] / 1000);
                let timeString = this.convertMsToHM(miliSecondsEstimation);
                tempDict[message[0]] = [((message[2])/(message[1] + message[2])) * 100, timeString];
            }
            else if(message[2] === "Almost"){
                tempDict[message[0]] = [null, "Almost done, calculating metrics"];
            }
            else if (message[2] === "Done"){
                delete tempDict[message[0]];
                toast.success(`ABTest ${message[0]} is toegevoegd`);
            }
            else{
                tempDict[message[0]] = [0, message[2]];
            }
            this.setState({times: tempDict, loading:temploading})
        })
    }

     render() {
         return (
             <div>
                 <TabelSkeleton loading={this.state.loading}>
                     <Row style={{paddingTop: 20}}>
                        {(Object.keys(this.state.times).length === 0) && <div><img src={"/svg/allDone.svg"} style={{width: "100%"}}/><h2 style={{paddingTop: 30}}>All A/B Test are added</h2></div>}
                        {Object.keys(this.state.times).map((key, index) => {
                            {return <Col sm={12} md={6}>
                                         <div style={{ paddingBottom: 20 }}>
                                                <Card className={"shadow-lg"}>
                                                    <Card.Body>
                                                        <h3>{key}:{" "}{this.state.times[key][1]}</h3>
                                                        {this.state.times[key][0] !== null && <ProgressBar now={Math.round(this.state.times[key][0])} />}
                                                        {(this.state.times[key][0] === null && this.state.times[key][1] ===  "Almost done, calculating metrics" )&& <Spinner animation="border" role="status"></Spinner>}
                                                    </Card.Body>
                                                </Card>
                                         </div>
                                    </Col>
                            }
                        })}
                    </Row>
                 </TabelSkeleton>
             </div>
         )
     }
}


export default AbtestLoading;