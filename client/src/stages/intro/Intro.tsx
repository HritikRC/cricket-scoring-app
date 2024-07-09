import classes from "./Intro.module.css"
import GlobalStateContext from "../../store/global-state-context";
import { useContext } from "react";

function Intro() {

    const globalStateCtx = useContext(GlobalStateContext); 

    return (
        <div className = {classes.buttonGroupPositioning}>
            <button type="button" className={["btn btn-primary", classes.buttonStyles].join(" ")} onClick={
                function(){
                    globalStateCtx.setStage(1);
                    globalStateCtx.setDayOrSession(1);
                }
            }>
                <h5>Create New Day</h5>
                <img src = "/new_day_img.png" className = {classes.imgSize}/>
            </button>
            <button type="button" className={["btn btn-success", classes.buttonStyles].join(" ")} onClick={
                function(){
                    globalStateCtx.setStage(1);
                    globalStateCtx.setDayOrSession(2);
                }
            }>
                <h5>Create New Session</h5>
                <img src = "/new_session_img.png" className = {classes.imgSize}/>
            </button>
        </div>
    );
}

export default Intro;
  