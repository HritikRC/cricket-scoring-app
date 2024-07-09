import { useContext, useRef, useState } from "react";
import GlobalStateContext from "../../store/global-state-context";

function SelectPlayers() {

    const globalStateCtx = useContext(GlobalStateContext);

    const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
    const batsmanInputRef = useRef(null);
    const bowlerInputRef = useRef(null);

    function handleInputChange(){
        var batsmanName = batsmanInputRef.current == null ? "" : batsmanInputRef.current["value"];
        var bowlerName = bowlerInputRef.current == null ? "" : bowlerInputRef.current["value"];

        if(globalStateCtx.names.includes(batsmanName) && globalStateCtx.names.includes(bowlerName) && bowlerName != batsmanName){
            setNextButtonDisabled(false);
        } else {
            setNextButtonDisabled(true);
        }
    }

    function next(){
        if(nextButtonDisabled == false){
            var batsmanName = batsmanInputRef.current == null ? "" : batsmanInputRef.current["value"];
            var bowler1Name = bowlerInputRef.current == null ? "" : bowlerInputRef.current["value"];
            var bowler2Name = globalStateCtx.names.filter(name => name != batsmanName && name != bowler1Name)[0];
            globalStateCtx.setBatsman(batsmanName);
            globalStateCtx.setBowler1(bowler1Name);
            globalStateCtx.setBowler2(bowler2Name);
            globalStateCtx.setStage(2);
        }
    }

    return (
        <div>
            <select className="form-select" aria-label="Default select example" onChange={handleInputChange} ref = {batsmanInputRef}>
                <option>Batsman name</option>
                <>
                    {
                        globalStateCtx.names.map((name, index) => (
                            <option key = {index} value = {name}>{name}</option>
                        ))
                    }
                </>
            </select>
            <select className="form-select" aria-label="Default select example" onChange={handleInputChange} ref = {bowlerInputRef}>
                <option>Bowler name</option>
                <>
                    {
                        globalStateCtx.names.map((name, index) => (
                            <option key = {index} value = {name}>{name}</option>
                        ))
                    }
                </>
            </select>

            <button disabled = {nextButtonDisabled} type="button" className="btn btn-success" onClick={next}>Next</button>
        </div>
    );
}

export default SelectPlayers;
  