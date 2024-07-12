import { ReactNode, createContext, useState } from "react";

const GlobalStateContext = createContext({
    stage: 0, // 0 is into, 1 is select players, 2 is game
    dayOrSession: 0, // 1 is new day, 2 is new session
    names: [""],
    batsman: "",
    bowler1: "",
    bowler2: "",
    inningsNumber: 0,
    timelines: [] as number[][],
    url: "",
    setStage: (_currentStage: number) => {},
    setDayOrSession: (_currentDayOrSession: number) => {},
    setBatsman: (_currentBatsman: string) => {},
    setBowler1: (_currentBowler1: string) => {},
    setBowler2: (_currentBowler2: string) => {},
    setInningsNumber: (_currentInningsNumber: number) => {},
    increaseInningsNumber: ()=>{},
    setTimelines: (_currentTimelines: number[][]) => {},
    addTimeline: (_newTimeline: number[]) => {}
});

interface Props {
    children: ReactNode;
}

export function GlobalStateContextProvider({children} : Props){

    const [currentStage, setNewStage] = useState(0);
    const [currentDayOrSession, setNewDayOrSession] = useState(0);
    const [currentBatsman, setNewBatsman] = useState("");
    const [currentBowler1, setNewBowler1] = useState("");
    const [currentBowler2, setNewBowler2] = useState("");
    const [currentInningsNumber, setNewInningsNumber] = useState(1);
    const [currentTimelines, setNewTimelines] = useState<number[][]>([]);

    function setNewCurrentStage(newStage: number) {
        setNewStage(newStage);
    }
    function setNewCurrentDayOrSession(newDayOrSession: number) {
        setNewDayOrSession(newDayOrSession);
    }
    function setNewCurrentBatsman(newBatsman: string) {
        setNewBatsman(newBatsman);
    }
    function setNewCurrentBowler1(newBowler1: string) {
        setNewBowler1(newBowler1);
    }
    function setNewCurrentBowler2(newBowler2: string) {
        setNewBowler2(newBowler2);
    }
    function setNewCurrentInningsNumber(newInningsNumber: number) {
        setNewInningsNumber(newInningsNumber);
    }
    function increaseCurrentInningsNumber() {
        setNewInningsNumber(currentInningsNumber + 1);
    }
    function setNewCurrentTimelines(newTimelines: number[][]) {
        setNewTimelines(newTimelines);
    }
    function addToCurrentTimelines(newTimeline: number[]){
        setNewTimelines(currentTimelines.concat([newTimeline]));
    }
    
    const context = {
        stage: currentStage,
        dayOrSession: currentDayOrSession,
        names: ["Rahul", "Rohit", "Hritik"],
        batsman: currentBatsman,
        bowler1: currentBowler1,
        bowler2: currentBowler2,
        inningsNumber: currentInningsNumber,
        timelines: currentTimelines,
        // http://localhost:8000/
        // https://cricket-scoring-app-hritikchowdhury-dev.apps.sandbox-m4.g2pi.p1.openshiftapps.com/
        url: "https://cricket-scoring-app-hritikchowdhury-dev.apps.sandbox-m4.g2pi.p1.openshiftapps.com/",
        setStage: setNewCurrentStage,
        setDayOrSession: setNewCurrentDayOrSession,
        setBatsman: setNewCurrentBatsman,
        setBowler1: setNewCurrentBowler1,
        setBowler2: setNewCurrentBowler2,
        setInningsNumber: setNewCurrentInningsNumber,
        increaseInningsNumber: increaseCurrentInningsNumber,
        setTimelines: setNewCurrentTimelines,
        addTimeline: addToCurrentTimelines
    };

    return (
        <GlobalStateContext.Provider value = {context}>
            {children}
        </GlobalStateContext.Provider>
    );
}

export default GlobalStateContext;