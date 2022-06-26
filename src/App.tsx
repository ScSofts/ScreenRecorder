import {Button, styled} from "@mui/material";
import {useCallback, useState} from "react";

const PreviewView = styled("video")({
    width: "100%",
    height: "auto"
});

enum RecorderState{
    Stopped = "Stopped",
    Recording = "Recording",
    Paused = "Paused",
    UnKnown = "UnKnown"
}

let buttonTextMap = new Map(
[
        [RecorderState.Recording, "Stop"],
        [RecorderState.UnKnown, "Start"],
        [RecorderState.Stopped, "Start"],
        [RecorderState.Paused, "Stop"]
    ]
);

let videoBuffer:Blob|null = null;
let stream:MediaStream|null = null;
let videoRecorder:MediaRecorder|null = null;


function App(){
    const [state,setState] = useState(RecorderState.UnKnown);
    const [src,setSrc] = useState("");

    const handleClick = useCallback(async()=>{
        switch (state){
            case RecorderState.Paused:
            case RecorderState.Recording:
                (videoRecorder as MediaRecorder).ondataavailable= (buffer)=> {
                    videoBuffer = new Blob([buffer.data],{
                        "type":"video/webm;codecs=h264"
                    });

                };
                (videoRecorder as MediaRecorder).onstop = ()=>setSrc(URL.createObjectURL(videoBuffer as Blob));
                stream?.getTracks().every(value => {
                    value.stop();
                    stream?.removeTrack(value);
                })
                videoRecorder?.stop();
                videoRecorder = null;
                stream = null;
                console.log(videoBuffer);
                setState(RecorderState.Stopped);
                break;
            case RecorderState.Stopped:
            case RecorderState.UnKnown:
                stream = await navigator.mediaDevices.getDisplayMedia({"video":true,"audio":true});
                videoRecorder = new MediaRecorder(stream,{
                    mimeType: 'video/webm;codecs=h264',
                    audioBitsPerSecond : 128000,
                    videoBitsPerSecond : 250000000
                })
                videoRecorder.start();
                setState(RecorderState.Recording);
                break;
        }
    },[state,setState]);

    let handlePause = ()=>{
        state === RecorderState.Paused ? setState(RecorderState.Recording) : setState(RecorderState.Paused);
        videoRecorder?.state === "recording" ? videoRecorder?.pause() : videoRecorder?.resume();
    };

    return (<>
        <Button variant={"outlined"} onClick={handleClick}>
            {buttonTextMap.get(state)}
        </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button variant={"outlined"} onClick={handlePause} disabled={
                state !== RecorderState.Recording &&
                state !== RecorderState.Paused
        }>
            Pause
        </Button>
        <div>
            <PreviewView controls={true} style={
                {display:state === RecorderState.Stopped ?"block":"none"}
            } src={src}/>
        </div>
    </>);
}

export {App};