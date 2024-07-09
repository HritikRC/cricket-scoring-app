// Test
import { useContext } from "react";
import GlobalStateContext from "../../store/global-state-context";
import Inning1StateContext from "../../store/inning1-state-context";
import Inning2StateContext from "../../store/inning2-state-context";
import Inning3StateContext from "../../store/inning3-state-context";

interface Props {
    inningsNumber: number;
}

function Buttons({inningsNumber}: Props) {

    const inningStateCtx = useContext(inningsNumber == 1 ? Inning1StateContext : inningsNumber == 2 ? Inning2StateContext : Inning3StateContext);
    const globalStateCtx = useContext(GlobalStateContext);

    function increaseBallOrRuns(inc: number){
        inningStateCtx.checkBowlerSwitch();
        inningStateCtx.increaseBallNumberOrBatRuns(inc);

        inningStateCtx.addToTimeline(inc);

        if(inc < 0){ // i.e wicket is taken, reset innings
            globalStateCtx.increaseInningsNumber();
        }
    }

    function wicketTaken(type: string){ 
        /*
            bowled: -1
            edged off: -2
            edged leg: -3
            box: -4
            caught: -5
            runout 1: -6
            runout 3: -7
            lbw: -8
        */
        if(type == "bowled"){
            increaseBallOrRuns(-1);
        } else if(type == "edged"){
            
        } else if(type == "box"){
            increaseBallOrRuns(-4);
        } else if(type == "caught"){
            increaseBallOrRuns(-5);
        } else if(type == "runout"){

        } else if(type == "lbw"){
            increaseBallOrRuns(-8);
        }
    }
    
    return (
        <>
            <div className="row g-3">
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            Run
                        </div>
                        <div className="card-body">
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-success" style = {{marginRight: "10px"}} onClick = {function(){increaseBallOrRuns(0)}} disabled = {inningsNumber != globalStateCtx.inningsNumber}><h2>0</h2></button>
                                <button type="button" className="btn btn-success" style = {{marginRight: "10px"}} onClick = {function(){increaseBallOrRuns(2)}} disabled = {inningsNumber != globalStateCtx.inningsNumber}><h2>2</h2></button>
                                <button type="button" className="btn btn-success" style = {{marginRight: "10px"}} onClick = {function(){increaseBallOrRuns(4)}} disabled = {inningsNumber != globalStateCtx.inningsNumber}><h2>4</h2></button>
                                <button type="button" className="btn btn-success" style = {{marginRight: "10px"}} onClick = {function(){increaseBallOrRuns(6)}} disabled = {inningsNumber != globalStateCtx.inningsNumber}><h2>6</h2></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        Wicket
                    </div>
                    <div className="card-body">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-success" style = {{marginRight: "10px"}} onClick={function(){wicketTaken("bowled")}} disabled = {inningsNumber != globalStateCtx.inningsNumber}>Bowled</button>
                            <button type="button" className="btn btn-success" data-bs-toggle="offcanvas" data-bs-target={"#staticBackdrop" + (2 * inningsNumber - 1)} aria-controls={"staticBackdrop" + (2 * inningsNumber - 1)} style = {{marginRight: "10px"}} onClick={function(){wicketTaken("edged")}} disabled = {inningsNumber != globalStateCtx.inningsNumber}>Edged</button>
                            <button type="button" className="btn btn-success" style = {{marginRight: "10px"}} onClick={function(){wicketTaken("box")}} disabled = {inningsNumber != globalStateCtx.inningsNumber}>Box</button>
                            <button type="button" className="btn btn-success" style = {{marginRight: "10px"}} onClick={function(){wicketTaken("caught")}} disabled = {inningsNumber != globalStateCtx.inningsNumber}>Caught</button>
                            <button type="button" className="btn btn-success" data-bs-toggle="offcanvas" data-bs-target={"#staticBackdrop" + (2 * inningsNumber)} aria-controls={"staticBackdrop" + (2 * inningsNumber)} style = {{marginRight: "10px"}} onClick={function(){wicketTaken("runout")}} disabled = {inningsNumber != globalStateCtx.inningsNumber}>Runout</button>
                            <button type="button" className="btn btn-success" style = {{marginRight: "10px"}} onClick={function(){wicketTaken("lbw")}} disabled = {inningsNumber != globalStateCtx.inningsNumber}>LBW</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-start" data-bs-backdrop="static" tabIndex={-1} id={"staticBackdrop" + (2 * inningsNumber - 1)} aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="staticBackdropLabel">Select Edge Side</h5>
                </div>
                <div className="offcanvas-body">
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="offcanvas" aria-label="Close" style = {{marginRight: "10px"}} onClick={function(){increaseBallOrRuns(-2)}}><h1>Off</h1></button>
                        <button type="button" className="btn btn-warning" data-bs-dismiss="offcanvas" aria-label="Close" style = {{marginRight: "10px"}} onClick={function(){increaseBallOrRuns(-3)}}><h1>Leg</h1></button>
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-start" data-bs-backdrop="static" tabIndex={-1} id={"staticBackdrop" + (2 * inningsNumber)} aria-labelledby="staticBackdropLabel2">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="staticBackdropLabel2">Select Runs in Runout</h5>
                </div>
                <div className="offcanvas-body">
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                        <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                            <button type="button" className="btn btn-info" data-bs-dismiss="offcanvas" aria-label="Close" style = {{marginRight: "10px"}} onClick = {function(){increaseBallOrRuns(-6)}}><h1>1</h1></button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="offcanvas" aria-label="Close" style = {{marginRight: "10px"}} onClick = {function(){increaseBallOrRuns(-7)}}><h1>3</h1></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Buttons;
