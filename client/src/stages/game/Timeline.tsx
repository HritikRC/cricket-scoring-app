
import { useContext, useEffect, useRef } from "react";
import Inning1StateContext from "../../store/inning1-state-context";
import Inning2StateContext from "../../store/inning2-state-context";
import Inning3StateContext from "../../store/inning3-state-context";

interface Props {
    inningsNumber: number;
}

function Timeline({inningsNumber}: Props) {
    const inningStateCtx = useContext(inningsNumber == 1 ? Inning1StateContext : inningsNumber == 2 ? Inning2StateContext : Inning3StateContext);
    const paginationRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (paginationRef.current) {
            paginationRef.current.scrollLeft = paginationRef.current.scrollWidth;
        }
    }, [inningStateCtx.timeline]);

    return (
        <nav aria-label="...">
            <ul
                className="pagination"
                style={{ overflow: "auto", whiteSpace: "nowrap", width: "100%" }}
                ref={paginationRef}
            >
                {inningStateCtx.timeline.map((value, index) => (
                    <li className="page-item disabled" key={index} style={{ display: "inline-block" }}>
                        <a className="page-link">
                            {
                                value == -1 ? "Bowled" : 
                                value == -2 ? "Edged Off" :
                                value == -3 ? "Edged Leg" :
                                value == -4 ? "Box" :
                                value == -5 ? "Caught" :
                                value == -6 ? "Runout w/ 1" :
                                value == -7 ? "Runout w/ 3" :
                                value == -8 ? "LBW" :
                                value
                            }
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Timeline;
