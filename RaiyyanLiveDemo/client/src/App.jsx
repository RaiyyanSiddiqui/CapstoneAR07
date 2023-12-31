import "./App.css";
import { useState, useRef } from "react";
import VideoRecorder from "../src/VideoRecorder";
import AudioRecorder from "../src/AudioRecorder";
import ScreenRecorder from "./ScreenRecorder";
import ImageComponent from "./ImageComponent";
import Screenshot from "./Screenshot";

const App = () => {
    let [recordOption, setRecordOption] = useState("video");
    const toggleRecordOption = (type) => {
        return () => {
            setRecordOption(type);
        };
    };
    return (
        <div>
            <h1>React Media Recorder</h1>
            <div className="button-flex">
                <button onClick={toggleRecordOption("video")}>
                    Record Video
                </button>
                <button onClick={toggleRecordOption("audio")}>
                    Record Audio
                </button>
                <button onClick={toggleRecordOption("screenshot")}>
                    Take Screenshot
                </button>
            </div>
            
            <div>
                {recordOption === "video" ? <VideoRecorder /> : ((recordOption === 'audio')? <AudioRecorder /> : <Screenshot />)}
            </div>
            
        </div>
    );
};
export default App;