let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;

let stage = new Konva.Stage({
    container:"draw",
    width:windowWidth,
    height:windowHeight
})

let layer = new Konva.Layer();
let globalLayer = new Konva.Layer({
    clearBeforeDraw:false,
});
let tempVal = window.location.href.split("?");
let temp1 = tempVal[1].split("&");
let values = {
   a: temp1[0].split("=")[1],
    b: temp1[1].split("=")[1]
}
console.log(values.a + " " + values.b);
let submitButt = document.getElementById("submitButt");
    let A = values.a*10;
    let B = values.b*10;
    console.log("A: "+A+" B: "+B);
    let rect1 = new Konva.Rect({
        x:windowWidth/2-50,
        y:windowHeight/2-50,
        width:50,
        height:50,
        fill:"grey",
        stroke:"black",
        strokeWidth:2,
        draggable:true,
    })
console.log()
    /*let s = (A+B+C)/2;
    let radius = (A*B*C)/(4*Math.sqrt(s*(s-A)*(s-B)*(s-C)))
   */
    //https://keisan.casio.com/exec/system/1223429573 : Formulae for radius
    let coordinatesCenter ;
     let triangle = new Konva.Shape({
        sceneFunc: function (context, shape) {
            context.beginPath();
            context.moveTo(windowWidth/2, windowHeight/2);
            context.lineTo(windowWidth/2+A, windowHeight/2);
            context.lineTo(windowWidth/2+A,windowHeight/2+B);
            context.closePath();

            // (!) Konva specific method, it is very important
            context.fillStrokeShape(shape);
        },

        fill: '#00D2FF',
        stroke: 'black',
        strokeWidth: 1,
        draggable: true,
         id:"tri",
    });

    layer.add(triangle);
    stage.add(layer);
    triangle.on("dragmove",()=>{
        console.log(triangle.getX() + " " + triangle.getY());

    });

triangle.on("dblclick",()=>{
    let prevX = windowWidth/2;
    let prevY = windowHeight/2;
    triangle.rotate(90);
    console.log(prevX);
    console.log(prevY);
    triangle.x(prevX);
    triangle.y(prevY);
})