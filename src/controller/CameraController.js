export class CameraController {

    constructor(videlEl){

        this._videoEl = videlEl;
    
        navigator.mediaDevices.getUserMedia({
            video:true
        }),then(stream=>{
            this._stream = stream;
            this._videoEl.src = URL.createObjectURL(stream);
            this._videoEl.play();
        }).catch(err=>{
            console.error(err);
        });
        
    
    }

    stop(){
	
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }

}