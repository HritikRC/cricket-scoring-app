
import Scorecard from "./Scorecard";
import Buttons from "./Buttons";
import Timeline from "./Timeline";

interface Props {
    batsman: string;
    bowler1: string;
    bowler2: string;
    inningsNumber: number;
}

function Innings({batsman, bowler1, bowler2, inningsNumber}: Props) {

    return (
        <div>
            <div className="row g-3">
                <div className="col">
                    <Scorecard batsman = {batsman} bowler1 = {bowler1} bowler2 = {bowler2} inningsNumber = {inningsNumber}/>
                </div>
                <div className="col">
                    <Buttons inningsNumber = {inningsNumber}/>
                </div>
                <Timeline inningsNumber = {inningsNumber}/>
            </div>
        </div>
    );
}

export default Innings;
  