import { ReactNode, createContext, useState } from "react";

const Inning2StateContext = createContext({
    batsmanStats: {
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
    },
    bowler1Stats: {
        overs: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
    },
    bowler2Stats: {
        overs: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
    },
    bowler: "",
    timeline: [] as number[],
    setBatsmanStats: (_batsmanStats: any) => {},
    setBowler1Stats: (_bowler1Stats: any) => {},
    setBowler2Stats: (_bowler2Stats: any) => {},
    increaseBallNumberOrBatRuns: (_inc: number)=>{},
    checkBowlerSwitch: ()=>{},
    setBowler: (_currentBowler: string) => {},
    addToTimeline: (_run: number) => {},
    removeFromTimeline: ()=>{},
    resetInnings: ()=>{}
});

interface Props {
    children: ReactNode;
}

export function Inning2StateContextProvider({children} : Props){

    const [currentBatsmanStats, setNewBatsmanStats] = useState({
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
    });
    const [currentBowler1Stats, setNewBowler1Stats] = useState({
        overs: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
    });
    const [currentBowler2Stats, setNewBowler2Stats] = useState({
        overs: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
    });
    const [currentBallNumber, setNewBallNumber] = useState(0);
    const [currentBowler, setNewBowler] = useState("bowler1");
    const [currentTimeline, setNewTimeline] = useState<number[]>([]);

    function setNewCurrentBatsmanStats(newBatsmanStats: any) {
        setNewBatsmanStats(newBatsmanStats);
    }
    function setNewCurrentBowler1Stats(newBowler1Stats: any) {
        setNewBowler1Stats(newBowler1Stats);
    }
    function setNewCurrentBowler2Stats(newBowler2Stats: any) {
        setNewBowler2Stats(newBowler2Stats);
    }
    function increaseCurrentBallNumberOrBatRuns(inc2: number) {
        var inc = inc2 < 0 ? 0 : inc2;
        if(inc2 == -6){
            inc = 1;
        } else if(inc2 == -7){
            inc = 3;
        }
        var ballinc = inc == 0 ? 1 : Math.sign(inc);
        setNewBallNumber(currentBallNumber + ballinc);
        setNewBatsmanStats({
            runs: currentBatsmanStats.runs + inc,
            balls: currentBatsmanStats.balls + ballinc,
            fours: inc == 4 ? currentBatsmanStats.fours + 1 : inc == -4 ? currentBatsmanStats.fours - 1 : currentBatsmanStats.fours,
            sixes: inc == 6 ? currentBatsmanStats.sixes + 1 : inc == -6 ? currentBatsmanStats.sixes - 1 : currentBatsmanStats.sixes
        });

        if(currentBowler == "bowler1"){
            setNewBowler1Stats({
                overs: currentBowler1Stats.overs + (ballinc / 6),
                maidens: currentBowler1Stats.maidens,
                runs: currentBowler1Stats.runs + inc,
                wickets: inc2 < 0 ? currentBowler1Stats.wickets + 1 : currentBowler1Stats.wickets,
            });
        } else {
            setNewBowler2Stats({
                overs: currentBowler2Stats.overs + (ballinc / 6),
                maidens: currentBowler2Stats.maidens,
                runs: currentBowler2Stats.runs + inc,
                wickets: inc2 < 0 ? currentBowler2Stats.wickets + 1 : currentBowler2Stats.wickets,
            });
        }
    }
    function checkIfBowlerShoulderSwitch(){
        if(currentBowler == "bowler1"){
            var overs = currentBowler1Stats.overs;
            var flooredOvers = Math.abs(overs - Math.round(overs)) < 0.001 ? Math.round(overs) : Math.floor(overs);
            var remainder = (overs - flooredOvers) * 0.6;
            var cricketFormattedOvers = parseFloat((flooredOvers + remainder).toFixed(1));

            if(cricketFormattedOvers - flooredOvers == 0.5){ // i.e 0.5 of 0.6
                setNewBowler("bowler2");
            }
        } else {
            var overs = currentBowler2Stats.overs;
            var flooredOvers = Math.abs(overs - Math.round(overs)) < 0.001 ? Math.round(overs) : Math.floor(overs);
            var remainder = (overs - flooredOvers) * 0.6;
            var cricketFormattedOvers = parseFloat((flooredOvers + remainder).toFixed(1));

            if(cricketFormattedOvers - flooredOvers == 0.5){ // i.e 0.5 of 0.6
                setNewBowler("bowler1");
            }
        }
    }
    function setNewCurrentBowler(newBowler: string){
        setNewBowler(newBowler);
    }
    function addToCurrentTimeline(run: number){
        setNewTimeline(currentTimeline.concat(run));
    }
    function removeFromCurrentTimeline(){
        setNewTimeline(currentTimeline.splice(0, currentTimeline.length - 1));
    }
    function resetTheInnings(){
        setNewBatsmanStats({
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
        });
        setNewBowler1Stats({
            overs: 0,
            maidens: 0,
            runs: 0,
            wickets: 0,
        });
        setNewBowler2Stats({
            overs: 0,
            maidens: 0,
            runs: 0,
            wickets: 0,
        });
        setNewBallNumber(0);
        setNewBowler("bowler1");
        setNewTimeline([]);
    }
    
    const context = {
        batsmanStats: currentBatsmanStats,
        bowler1Stats: currentBowler1Stats,
        bowler2Stats: currentBowler2Stats,
        bowler: currentBowler,
        timeline: currentTimeline,
        setBatsmanStats: setNewCurrentBatsmanStats,
        setBowler1Stats: setNewCurrentBowler1Stats,
        setBowler2Stats: setNewCurrentBowler2Stats,
        increaseBallNumberOrBatRuns: increaseCurrentBallNumberOrBatRuns,
        checkBowlerSwitch: checkIfBowlerShoulderSwitch,
        setBowler: setNewCurrentBowler,
        addToTimeline: addToCurrentTimeline,
        removeFromTimeline: removeFromCurrentTimeline,
        resetInnings: resetTheInnings
    };

    return (
        <Inning2StateContext.Provider value = {context}>
            {children}
        </Inning2StateContext.Provider>
    );
}

export default Inning2StateContext;