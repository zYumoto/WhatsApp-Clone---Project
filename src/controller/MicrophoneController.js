import { ClassEvent } from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent {

    constructor() {

       
        super();

        this._available = false;

        // api Navigator para solicitar permisao de abrir a audio
        navigator.mediaDevices.getUserMedia({

            audio: true

        }).then(stream => {
            this._available = true;
            this._mimeType = 'audio/webm'
            this._stream = stream;
            this.trigger('ready', this._stream)

        }).catch(err => {
            console.error(err);
        });
    }

    // metodo para verificar se esta disponivel ou nao
    isAvailable() {

        return this._available;
    }


    stop() {
        this._stream.getTracks().forEach(track => {
            track.stop();
        })

    }

    // Comecando a gravar o audio
        startRecorder() {

        if (this.isAvailable()) {

            this._mediaRecorder = new MediaRecorder(this._stream, {
                mimeType: this._mimeType
            });

            // array para armazena os dados
            this._recordedChunks = [];

            // evento para escuter
            this._mediaRecorder.addEventListener('dataavailable', e => {

                // fazendo push dos dados e colocando no arry
                if (e.data.size > 0) this._recordedChunks.push(e.data);
            });

            // evendo do que  vai acontecer quando para a gravacao
            this._mediaRecorder.addEventListener('stop', e => {

                // pegando todos os pedaços que estao no arry e criando uma variavel bob e amrazenando nela
                let blob = new Blob(this._recordedChunks, {
                    type: this._mimeType

                })

                let filename = `rec${Date.now()}.webm`;

                let file = new File([blob], filename, {

                    type: this._mimeType,
                    lastModified: Date.now()
                });

                console.log('file', file)

            });

            this._mediaRecorder.start();
            this.startTimer();
        };


    }


    // metodo para parar a gravação
    stopRecorder() {

        if (this.isAvailable()) {
            this._mediaRecorder.stop();
            this.stop();
            this.stopTimer();

        }

    }

    // Metodo para gerar o time da gravacao do audio
    startTimer() {
        let start = Date.now();

        // colocando num atributo privado e fazendo aparecer na tela 
        this._recordMicrophoneInterval = setInterval(() => {

            this.trigger('recordtimer', (Date.now() - start));

        }, 100)

    }

    // parar o tempo de gravacao
    stopTimer() {

        clearInterval(this._recordMicrophoneInterval)
    }

}