import React, { useState, useEffect } from "react";
import './modalTemplate.css';
import { notify } from "../Alerts/toast";
import { Container, Row, Col } from "react-bootstrap";
import { CASINO, MESSAGES } from "../../constants/gameConstants";

function Casino(props)
{
    const [btncls, setBtncls] = useState('btn btn-secondary btn-lg');
    const [show, SetShow]  = useState(false);


      
      const [mltp_1, setMltp_1] = useState('btn btn-outline-light btn-lg');
      const [mltp_2, setMltp_2] = useState('btn btn-outline-light btn-lg');
      const [mltp_3, setMltp_3] = useState('btn btn-outline-light btn-lg');

    const TriggerBtn = () =>
    {
        SetShow(!show);
      
    }
    
    // Handle casino unlock based on level
    useEffect(() => {
        const isCasinoUnlocked = props.lvl >= CASINO.MIN_LEVEL;

        if (isCasinoUnlocked) {
            setBtncls('btn btn-secondary btn-lg');
        } else {
            setBtncls('btn btn-danger btn-lg');
            if (show) {
                notify(MESSAGES.ERRORS.CASINO_LEVEL_REQUIRED);
                SetShow(false);
            }
        }
    }, [props.lvl, show]);

    // Handle modal display
    useEffect(() => {
        const casino = document.getElementById('casino');
        if (casino) {
            casino.style.display = show ? 'inherit' : 'none';
        }
    }, [show]);

    // Handle multiplier button styling
    useEffect(() => {
        const { multiplier } = props;
        const baseClass = 'btn btn-outline-light btn-lg';
        const activeClass = 'btn btn-light btn-lg';

        if (multiplier === 0) {
            setMltp_1(baseClass);
            setMltp_2(baseClass);
            setMltp_3(baseClass);
        } else if (multiplier === CASINO.MULTIPLIERS.LOW) {
            setMltp_1(activeClass);
            setMltp_2(baseClass);
            setMltp_3(baseClass);
        } else if (multiplier === CASINO.MULTIPLIERS.MEDIUM) {
            setMltp_1(baseClass);
            setMltp_2(activeClass);
            setMltp_3(baseClass);
        } else if (multiplier === CASINO.MULTIPLIERS.HIGH) {
            setMltp_1(baseClass);
            setMltp_2(baseClass);
            setMltp_3(activeClass);
        }
    }, [props.multiplier]);



   

    return(
        <div> 
        <button className={btncls} onClick={TriggerBtn}>🎰CASINO </button>
        <div id="casino" className="modal">
           <div className="modal-content">

           <div>
           <button className="btn btn-danger closeBtn"  onClick={TriggerBtn}>X</button>




        <div className="ModalTxt">
     

        <h1>Casino</h1>
        <h2>Select multiplier</h2>
        <br/>
        <Container>
            <Row>
                <Col><button className={mltp_1} onClick={props.mltp1}> 1.25x </button></Col>
                <Col><button className={mltp_2} onClick={props.mltp2}> 1.50x </button></Col>
                <Col><button className={mltp_3} onClick={props.mltp3}> 2.00x </button></Col>
            </Row>
        </Container>
        <br/>



        <h2>Select stake <i> (clicks)</i> </h2>
        <div className="StakeDiv"> 
        <Container> 
        <Row > 
        <Col> <h1> {props.stake}</h1></Col>
       

       
        <Col><button className="btn btn-success btn-sm" onClick={props.addStake}><h5> &nbsp;+&nbsp;</h5></button></Col>
        <Col><button className="btn btn-danger btn-sm" onClick={props.subStake}><h5> &nbsp;-&nbsp;</h5></button></Col>
       
        </Row>
        </Container>
        </div>
        <br/>
        <button className="btn btn-warning" onClick={props.play}><h1>PLAY </h1></button>



        </div>



         </div>
         </div>

       </div>
      
        </div>
    )
}
export default Casino;