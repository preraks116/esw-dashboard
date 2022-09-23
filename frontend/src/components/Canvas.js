// creating a canvas which we will use to put our esp32-cam footage in
import React, { useRef, useEffect,useState } from 'react'
import io from "socket.io-client";

const socket = io("esw.abhijnan.live");
const Canvas = props => {
    
    const [state,setState] = useState(null);
    const canvasRef = useRef(null)
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        //Our first draw
        context.fillStyle = '#FF00FF'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        socket.on('connect', (socket) => {
            console.log(`i connected succesfully`);
        });
        var img = new Image();
        img.onload = function () {
            console.log("img width an height",this.width,this.height)
            console.log("canvas width an height",canvas.width,canvas.height)
            
            canvas.style.width = 320 + 'px';
            canvas.style.height = 240 + 'px';
            context.drawImage(this, 0, 0, 320, 240,     // source rectangl
                0, 0, canvas.width, canvas.height); // destination rectangle
        }
        socket.on('jpgstream_clientio', function (message) {
            console.log(message);
            var blob = new Blob([message], { type: "image/jpeg" }); // set proper mime-type
            

            console.log("thingspeak")
            var url = URL.createObjectURL(blob);
            console.log("url",url)
            img.src = url;
            setState(!state);
        });
    }, [])

    return <canvas ref={canvasRef} {...props} />
}

export default Canvas