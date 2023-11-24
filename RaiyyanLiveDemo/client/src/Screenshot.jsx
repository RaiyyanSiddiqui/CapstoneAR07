import { useState, useRef } from "react";
import React from "react"
import ImageComponent from "./ImageComponent";

var opts = {
  headers: {
    mode: 'no-cors'
  }
}

class Screenshot extends React.Component {
    constructor() {
      super();
  
      this.cameraNumber = 0;
      this.state = {
        imageDataURL: null,
      };
      
    }
    componentDidMount(){
      
      this.initializeMedia()
      setTimeout(() => {
          this.screenshotLoop();
        }, 700);
        
    }

    screenshotLoop = async () => {
      // complex stuff for each element.
      this.capturePicture();
      setTimeout(this.screenshotLoop, 1500);
      //console.log("lop")
    }
  
    initializeMedia = async () => {
      this.setState({ imageDataURL: null });
  
      if (!("mediaDevices" in navigator)) {
        navigator.mediaDevices = {};
      }
  
      if (!("getUserMedia" in navigator.mediaDevices)) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          var getUserMedia =
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
          if (!getUserMedia) {
            return Promise.reject(new Error("getUserMedia Not Implemented"));
          }
  
          return new Promise((resolve, reject) => {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
  
      //Get the details of video inputs of the device
      const videoInputs = await this.getListOfVideoInputs();
  
      //The device has a camera
      if (videoInputs.length) {
        navigator.mediaDevices
          .getUserMedia({
            video: {
              deviceId: {
                exact: videoInputs[this.cameraNumber].deviceId,
              },
            },
          })
          .then((stream) => {
            this.player.srcObject = stream;
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        alert("The device does not have a camera");
      }
    };
  
    capturePicture = () => {
      var canvas = document.createElement("canvas");
      canvas.width = this.player.videoWidth;
      canvas.height = this.player.videoHeight;
      var contex = canvas.getContext("2d");
      contex.drawImage(this.player, 0, 0, canvas.width, canvas.height);
      /*this.player.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });*/
  
      console.log(canvas.toDataURL());
      this.setState({ imageDataURL: canvas.toDataURL() })
      this.sendImage(canvas)
    };
  
    switchCamera = async () => {
      const listOfVideoInputs = await this.getListOfVideoInputs();
  
      // The device has more than one camera
      if (listOfVideoInputs.length > 1) {
        if (this.player.srcObject) {
          this.player.srcObject.getVideoTracks().forEach((track) => {
            track.stop();
          });
        }
  
        // switch to second camera
        if (this.cameraNumber === 0) {
          this.cameraNumber = 1;
        }
        // switch to first camera
        else if (this.cameraNumber === 1) {
          this.cameraNumber = 0;
        }
  
        // Restart based on camera input
        this.initializeMedia();
      } else if (listOfVideoInputs.length === 1) {
        alert("The device has only one camera");
      } else {
        alert("The device does not have a camera");
      }
    };

    sendImage = async (canvas) => {
      let image_file = canvas.toDataURL()
      let body = {"content": image_file,}
      fetch("http://127.0.0.1:5000/sendImg", {
          body: JSON.stringify(body),
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Max-Age': '300'
          }
      }).then(response => {
          console.log(response);
      }).catch(exception => {
        // fetch API problem: in case of CORS the server must send header "Access-Control-Allow-Origin":"*"
          console.log(exception);
      });
    }
  
    getListOfVideoInputs = async () => {
      // Get the details of audio and video output of the device
      const enumerateDevices = await navigator.mediaDevices.enumerateDevices();
  
      //Filter video outputs (for devices with multiple cameras)
      return enumerateDevices.filter((device) => device.kind === "videoinput");
    };

      render() {
        const canv = document.getElementsByClassName('canvas')

        const playerORImage =  (
          <div>
            <img src={this.state.imageDataURL} alt="cameraPic" />
            <video
              ref={(refrence) => {
                this.player = refrence;
              }}
              autoPlay
            ></video>
            <ImageComponent width = {200} height = {200}/>
          </div> )
        

      return (
        <div className="Screenshot">
          {playerORImage}
          <button onClick={this.capturePicture}>Capture</button>
          <button onClick={this.switchCamera}>Switch</button>

        </div>
      );
    }
  }
  
  export default Screenshot;
  