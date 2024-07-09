import { useContext, useEffect } from "react";
import GlobalStateContext from "../../store/global-state-context";
import Innings from "./Innings";
import Inning1StateContext from "../../store/inning1-state-context";
import Inning2StateContext from "../../store/inning2-state-context";
import Inning3StateContext from "../../store/inning3-state-context";

function Game() {
    const globalStateCtx = useContext(GlobalStateContext);
    const inning1StateCtx = useContext(Inning1StateContext);
    const inning2StateCtx = useContext(Inning2StateContext);
    const inning3StateCtx = useContext(Inning3StateContext);

    function splitArrayIntoChunks(array: number[], L: number) {
        let result = [];
        for (let i = 0; i < array.length; i += L) {
            result.push(array.slice(i, i + L));
        }
        return result;
    }

    function convertCodesToWickets(n: number){
        var codes = [-1, -2, -3, -4, -5, -6, -7, -8];
        var wickets = ["Bowled", "Edged_Off", "Edged_Leg", "Box", "Caught", "Runout*1", "Runout*3", "LBW"];
        return wickets[codes.indexOf(n)];
    }

    function createDataTable(timelines: number[][]){
        var t = {
            inning1: { // batsman, bowler1, bowler2
                timeline: splitArrayIntoChunks(timelines[0], 6),
                batsman: globalStateCtx["batsman"],
                bowler1: globalStateCtx["bowler1"],
                bowler2: globalStateCtx["bowler2"]
            },
            inning2: { // bowler2, bowler1, batsman
                timeline: splitArrayIntoChunks(timelines[1], 6),
                batsman: globalStateCtx["bowler2"],
                bowler1: globalStateCtx["bowler1"],
                bowler2: globalStateCtx["batsman"]
            },
            inning3 : { // bowler1, batsman, bowler2
                timeline: splitArrayIntoChunks(timelines[2], 6), 
                batsman: globalStateCtx["bowler1"],
                bowler1: globalStateCtx["batsman"],
                bowler2: globalStateCtx["bowler2"]
            }
        };

        const data = globalStateCtx.dayOrSession == 1 ? [["Bowler Name", "Batter Name", "1", "2", "3", "4", "5", "6"]] : [];
        for(var i = 1; i < 4; i++){
            var inning = i == 1 ? t.inning1 : i == 2 ? t.inning2 : t.inning3;
            for(var row = 0; row < inning.timeline.length; row++){
                var newRow = [row % 2 == 0 ? inning.bowler1 : inning.bowler2, inning.batsman];
                for(var col = 0; col < 6; col++){
                    var timelineVal = inning.timeline[row][col];
                    var value;
                    if(timelineVal == undefined){
                        value = "Null";
                    } else {
                        value = timelineVal < 0 ? convertCodesToWickets(timelineVal) : timelineVal.toString();
                    }
                    newRow.push(value);
                }
                data.push(newRow);
            }
        }
        console.log(data);

        return data;
    }

    function arrayToCSV(arr: any[]) {
        return arr.map(row => row.join(",")).join("\n");
    }

    useEffect(() => {
        if(globalStateCtx.inningsNumber == 4){
            var csvTable = arrayToCSV(createDataTable(globalStateCtx.timelines));
            console.log(csvTable);
    
            const sendData = async () => {
                const url = "http://localhost:8000/data";
                var dayOrSession = globalStateCtx.dayOrSession == 1 ? "day" : "session";
                
                // Post request for sending the data
                try {
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify([dayOrSession, csvTable])
                    });
    
                    if(response.ok) {
                        console.log("SuccessSendingData!");
                    } else {
                        console.log("ErrorSendingData: " + response.statusText);
                    }
                } catch (err) {
                    console.log("ErrorSendingData: " + err);
                }
            }
            
            sendData();
        }
    }, [globalStateCtx.timelines]);
    

    function saveData() {
        var timeline1 = inning1StateCtx.timeline;
        var timeline2 = inning2StateCtx.timeline;
        var timeline3 = inning3StateCtx.timeline;
        globalStateCtx.setTimelines([timeline1, timeline2, timeline3]);
    }

    return (
        <>
            <div className="accordion accordion-flush" id="accordionFlushExample">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button disabled={true} className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            Innings 1
                        </button>
                    </h2>
                    <div id="flush-collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            <Innings batsman={globalStateCtx.batsman} bowler1={globalStateCtx.bowler1} bowler2={globalStateCtx.bowler2} inningsNumber={1} />
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button disabled={globalStateCtx.inningsNumber != 2} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                            Innings 2
                        </button>
                    </h2>
                    <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            <Innings batsman={globalStateCtx.bowler2} bowler1={globalStateCtx.bowler1} bowler2={globalStateCtx.batsman} inningsNumber={2} />
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button disabled={globalStateCtx.inningsNumber != 3} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                            Innings 3
                        </button>
                    </h2>
                    <div id="flush-collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            <Innings batsman={globalStateCtx.bowler1} bowler1={globalStateCtx.batsman} bowler2={globalStateCtx.bowler2} inningsNumber={3} />
                        </div>
                    </div>
                </div>
            </div>
            <button disabled={globalStateCtx.inningsNumber != 4} type="button" className="btn btn-secondary btn-lg" style={{ position: "fixed", left: "50%", transform: "translate(-50%, 50%)" }} onClick={saveData}>
                <h2>Save Data</h2>
            </button>
        </>
    );
}

export default Game;
