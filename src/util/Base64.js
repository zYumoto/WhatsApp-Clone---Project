export class Base64 {


    static getMimetype(urlBase64) {


        let regex = /^data:(.+);base64,(.*)$/;
        let result = urlBase64.match(regex);
        return result[1];
    };


    static toFile(urlBase64) {

        let mimetype = Base64.getMimetype(urlBase64);
        let ext = mimetype.split('/')[1];
        let filename = `file_${Date.now()}.${ext}`;

        return fetch(urlBase64)
            .then(res => { return res.arrayBuffer(); })
            .then(buffer => { return new File([buffer], filename, { type: mimetype }); });

    }
}