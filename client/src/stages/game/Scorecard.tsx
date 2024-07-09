
import { useContext } from "react";
import Inning1StateContext from "../../store/inning1-state-context";
import Inning2StateContext from "../../store/inning2-state-context";
import Inning3StateContext from "../../store/inning3-state-context";

interface Props {
    batsman: string;
    bowler1: string;
    bowler2: string;
    inningsNumber: number;
}

function Scorecard({batsman, bowler1, bowler2, inningsNumber}: Props) {

    const inningStateCtx = useContext(inningsNumber == 1 ? Inning1StateContext : inningsNumber == 2 ? Inning2StateContext : Inning3StateContext);

    function convertToOverFormat(overs: number){
        var flooredOvers = Math.abs(overs - Math.round(overs)) < 0.001 ? Math.round(overs) : Math.floor(overs);

        var remainder = (overs - flooredOvers) * 0.6;

        return (flooredOvers + remainder).toFixed(1);
    }

    return (
        <>
            <table className="table">
                <thead>
                    <tr className = "table-primary">
                        <th scope="col">Batsman Name</th>
                        <th scope="col">R</th>
                        <th scope="col">B</th>
                        <th scope="col">4s</th>
                        <th scope="col">6s</th>
                        <th scope="col">S/R</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className = "table-success">
                        <th scope="row">{batsman}</th>
                        <td>{inningStateCtx.batsmanStats.runs}</td>
                        <td>{inningStateCtx.batsmanStats.balls}</td>
                        <td>{inningStateCtx.batsmanStats.fours}</td>
                        <td>{inningStateCtx.batsmanStats.sixes}</td>
                        <td>{(inningStateCtx.batsmanStats.runs / inningStateCtx.batsmanStats.balls * 100).toFixed(0)}</td>
                    </tr>
                </tbody>
            </table>

            <table className="table">
                <thead>
                    <tr className = "table-primary">
                        <th scope="col">Bowler Name</th>
                        <th scope="col">O</th>
                        <th scope="col">R</th>
                        <th scope="col">W</th>
                        <th scope="col">Econ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className = "table-success">
                        <th scope="row">{bowler1}</th>
                        <td>{convertToOverFormat(inningStateCtx.bowler1Stats.overs)}</td>
                        <td>{inningStateCtx.bowler1Stats.runs}</td>
                        <td>{inningStateCtx.bowler1Stats.wickets}</td>
                        <td>{(inningStateCtx.bowler1Stats.runs / inningStateCtx.bowler1Stats.overs).toFixed(2)}</td>
                    </tr>
                    <tr className = "table-primary">
                        <th scope="row">{bowler2}</th>
                        <td>{convertToOverFormat(inningStateCtx.bowler2Stats.overs)}</td>
                        <td>{inningStateCtx.bowler2Stats.runs}</td>
                        <td>{inningStateCtx.bowler2Stats.wickets}</td>
                        <td>{(inningStateCtx.bowler2Stats.runs / inningStateCtx.bowler2Stats.overs).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

export default Scorecard;
  