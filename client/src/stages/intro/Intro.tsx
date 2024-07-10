import classes from "./Intro.module.css"
import GlobalStateContext from "../../store/global-state-context";
import { useContext, useEffect, useState } from "react";

function Intro() {

    const globalStateCtx = useContext(GlobalStateContext); 
    const [seeingStats, setSeeingStats] = useState(false);
    const [picturesCreated, setPicturesCreated] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    function goToStats(){
        setSeeingStats(true);
    }

    useEffect(() => {
        if (seeingStats) {
            const sendData = async () => {
                const url = "http://localhost:8000/stats";
                
                try {
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(["STATISTICS_REQUEST"])
                    });

                    if (response.ok) {
                        console.log("SuccessRequestingStatistics!");
                        const data = await response.json();
                        const names = globalStateCtx.names;
                        var dataImages = [
                            data.images.filter((el: string | string[]) => el.includes(names[0])),
                            data.images.filter((el: string | string[]) => el.includes(names[1])),
                            data.images.filter((el: string | string[]) => el.includes(names[2])),
                            data.images.filter((el: string | string[]) => el.includes("summary")),
                        ];
                        setImageUrls(dataImages);
                        console.log(data.images, dataImages);
                        setPicturesCreated(true);
                    } else {
                        console.log("ErrorRequestingStatistics: " + response.statusText);
                    }
                } catch (err) {
                    console.log("ErrorRequestingStatistics: " + err);
                }
            }
            
            sendData();
        }
    }, [seeingStats]);

    return (
        <>
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
            
            <button className={["btn btn-info btn-lg", classes.statsButtonPositioning].join(" ")} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop" onClick={goToStats}>
                View Player Stats
            </button>

            <div className="offcanvas offcanvas-top" tabIndex={-1} id="offcanvasTop" aria-labelledby="offcanvasTopLabel" style = {{height: "100%"}}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasTopLabel">Player Statistics</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {picturesCreated ?
                        <div>
                            {imageUrls.slice(0, 3).map((url, index) => (
                                <div className="container text-center">
                                    <div className="row">
                                        <div className="col">
                                            <div className="card" style={{width: "18rem"}}>
                                                <img className="card-img-top" key={index} src={url[0]} alt={`Statistics ${index}`} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="card" style={{width: "18rem"}}>
                                                <img className="card-img-top" key={index} src={url[1]} alt={`Statistics ${index}`} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="card" style={{width: "18rem"}}>
                                                <img className="card-img-top" key={index} src={url[1]} alt={`Statistics ${index}`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="container text-center">
                                <div className="row">
                                    <div className="col">
                                        <div className="card" style={{width: "27rem"}}>
                                            <img className="card-img-top" src={imageUrls[3][0]} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="card" style={{width: "27rem"}}>
                                            <img className="card-img-top" src={imageUrls[3][1]} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    : 
                        <div>
                            <div className="spinner-border" role="status"></div>
                            <strong role="status" style = {{marginLeft: "1rem"}}>Loading...</strong>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

export default Intro;
  