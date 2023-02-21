let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;
let drawHeight = document.getElementById("draw").clientHeight;

document.addEventListener("DOMContentLoaded",()=>{
    console.log(windowHeight);

})
let stage = new Konva.Stage({
    container: "draw",
    width: windowWidth,
    height: drawHeight,
})

let movable = new Konva.Layer();
let stationary = new Konva.Layer();
//group for draggableShapes:
let draggableShapes = new Konva.Group();
//group for stationary shapes (or maybe we do a layer idk):
let staticShapes = [];
let shapes = new Konva.Group();

//getting length values from $_GET request in url:
let tempVal = window.location.href.split("?");
let temp1 = tempVal[1].split("&");
let values = {
    a: temp1[0].split("=")[1],
    b: temp1[1].split("=")[1]
}
let A = values.a * 10;
let B = values.b * 10;
/*let s = (A+B+C)/2;
let radius = (A*B*C)/(4*Math.sqrt(s*(s-A)*(s-B)*(s-C)))
*/
//https://keisan.casio.com/exec/system/1223429573 : Formulae for radius

//current active shape
let activeDrag;
function TriangleGen(startX,startY,stroke,fill,draggable,code){
    if(code == 0){
        let P = [startX,startY];
        let Q = [startX+A,startY];
        let R = [startX+A,startY+A]
        let arr = findCircumCenter(P,Q,R);
        let newTri = new Konva.Shape({
            sceneFunc:function(context,shape){
                context.beginPath();
                context.moveTo(startX,startY);
                context.lineTo(startX+A,startY);
                context.lineTo(startX+A,startY+B);
                context.closePath();
                context.fillStrokeShape(shape);
            },
            fill:fill,
            stroke:stroke,
            strokeWidth:1,
            draggable:draggable,
            id: 'triangle',
            x:startX,
            y:startY,
            offset:{
                x:arr[0],
                y:arr[1]
            }
        });
        //layer.add(newTri);
        draggableShapes.add(newTri);
    }
    if(code == 1){
        let P = [startX,startY];
        let Q = [startX+A,startY];
        let R = [startX+A,startY+A]
        let arr = findCircumCenter(P,Q,R);
        let newTri = new Konva.Shape({
            sceneFunc:function(context,shape){
                context.beginPath();
                context.moveTo(startX,startY);
                context.lineTo(startX+A,startY);
                context.lineTo(startX+A,startY+B);
                context.closePath();
                context.fillStrokeShape(shape);
            },
            fill:fill,
            stroke:stroke,
            strokeWidth:1,
            draggable:draggable,
            id: 'triangle',
            x:startX,
            y:startY,
            offset:{
                x:arr[0],
                y:arr[1]
            }
        });
        //layer.add(newTri);
        staticShapes.push(newTri);
        shapes.add(newTri);
    }

}
//tw0 example triangles:
TriangleGen(500,500,"black","red",true, 0);
TriangleGen(200,200,"black","blue",true, 0);

movable.add(draggableShapes);
stationary.add(shapes);
stage.add(movable);
stage.add(stationary);

//limiting drag area:
draggableShapes.on("dragmove", (e) => {
    e.target.y(Math.max(e.target.getY(), 100))
    e.target.x(Math.max(e.target.getX(), 20));
    e.target.x(Math.min(e.target.getX(), windowWidth-50));
    e.target.y(Math.min(e.target.getY(),drawHeight-200));
});
//rotation on dblclick:
movable.on("dblclick",(e)=>{
    e.target.rotate(90);
})

movable.on("click", e => {
    console.log(e.target.getX(), e.target.getY())
})

shapes.on("click", e => {
    console.log(e.target.getX(), e.target.getY());
})

function drawTemplate() {
    TriangleGen(600, 200, "black", "black", false, 1)
    TriangleGen(650, 200, "black", "white", false, 1)
    TriangleGen(750, 150+A+50, "black", "white", false, 1)
    TriangleGen(750, 150+A+100, "black", "black", false, 1)
    let squareBig = new Konva.Rect({
        x: 550,
        y: 250,
        width: B,
        height: B,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        draggable: false,
    });
    let squareSmall = new Konva.Rect({
        x: 700,
        y: 150,
        width: A,
        height: A,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        draggable: false,
    });
    shapes.add(squareBig)
    shapes.add(squareSmall)
    staticShapes.push(squareSmall)
    staticShapes.push(squareBig)
    staticShapes[0].rotate(270)
    staticShapes[1].rotate(90)
    staticShapes[3].rotate(180)
    console.log(staticShapes[0].getX(), staticShapes[0].getY())
}

drawTemplate()

movable.zIndex(1);
stationary.zIndex(0);

let tempLayer = new Konva.Layer();
stage.add(tempLayer);
let previousShape;

stage.on('dragstart', function (e) {
    e.target.moveTo(tempLayer);
    movable.draw();
});

stage.on('dragmove', function (evt) {
    activeDrag = evt.target
    console.log("pidaras")
    var pos = stage.getPointerPosition();
    var shape = movable.getIntersection(pos);
    if (previousShape && shape) {
        if (previousShape !== shape) {
            // leave from old targer
            previousShape.fire(
                'dragleave',
                {
                    evt: evt.evt,
                },
                true
            );

            // enter new targer
            shape.fire(
                'dragenter',
                {
                    evt: evt.evt,
                },
                true
            );
            previousShape = shape;
        } else {
            previousShape.fire(
                'dragover',
                {
                    evt: evt.evt,
                },
                true
            );
        }
    } else if (!previousShape && shape) {
        previousShape = shape;
        shape.fire(
            'dragenter',
            {
                evt: evt.evt,
            },
            true
        );
    } else if (previousShape && !shape) {
        previousShape.fire(
            'dragleave',
            {
                evt: evt.evt,
            },
            true
        );
        previousShape = undefined;
    }
    console.log(staticShapes[5].getX())

    if(staticShapes[5].getX() == activeDrag.getX())
    {
        console.log("suka");
    }
});
stage.on('dragend', function (e) {
    var pos = stage.getPointerPosition();
    var shape = movable.getIntersection(pos);
    if (shape) {
        previousShape.fire(
            'drop',
            {
                evt: e.evt,
            },
            true
        );
    }
    previousShape = undefined;
    e.target.moveTo(movable);
});
stage.on('drop', e => {
    console.log("suka");
})
stage.on('dragover', e => {
    /*if((e.target.getAttribute('id') === activeDrag.getAttribute('id')) && ((e.target.getAttribute('rotation') === activeDrag.getAttribute('rotation')))){
        activeDrag.setAttribute('fill', 'green');
    }*/

    console.log("suka");
})


//TODO: rewrite this code!:

// JavaScript program to find the CIRCUMCENTER of a
// triangle

// This pair is used to store the X and Y
// coordinate of a point respectively
// #define pdd pair<double, double>

// Function to find the line given two points
function lineFromPoints(P, Q) {
    let a = Q[1] - P[1];
    let b = P[0] - Q[0];
    let c = a * (P[0]) + b * (P[1]);
    return [a, b, c];
}

// Function which converts the input line to its
// perpendicular bisector. It also inputs the points
// whose mid-point lies on the bisector
function perpendicularBisectorFromLine(P, Q, a, b, c) {
    let mid_point = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];

    // c = -bx + ay
    c = -b * (mid_point[0]) + a * (mid_point[1]);

    let temp = a;
    a = -b;
    b = temp;
    return [a, b, c];
}

// Returns the intersection point of two lines
function lineLineIntersection(a1, b1, c1, a2, b2, c2) {
    let determinant = a1 * b2 - a2 * b1;
    if (determinant == 0) {
        // The lines are parallel. This is simplified
        // by returning a pair of FLT_MAX
        return [(10.0) ** 19, (10.0) ** 19];
    } else {
        let x = (b2 * c1 - b1 * c2) / determinant;
        let y = (a1 * c2 - a2 * c1) / determinant;
        return [x, y];
    }
}

function findCircumCenter(P, Q, R) {
    // Line PQ is represented as ax + by = c
    let PQ_line = lineFromPoints(P, Q);
    let a = PQ_line[0];
    let b = PQ_line[1];
    let c = PQ_line[2];

    // Line QR is represented as ex + fy = g
    let QR_line = lineFromPoints(Q, R);
    let e = QR_line[0];
    let f = QR_line[1];
    let g = QR_line[2];

    // Converting lines PQ and QR to perpendicular
    // vbisectors. After this, L = ax + by = c
    // M = ex + fy = g
    let PQ_perpendicular = perpendicularBisectorFromLine(P, Q, a, b, c);
    a = PQ_perpendicular[0];
    b = PQ_perpendicular[1];
    c = PQ_perpendicular[2];

    let QR_perpendicular = perpendicularBisectorFromLine(Q, R, e, f, g);
    e = QR_perpendicular[0];
    f = QR_perpendicular[1];
    g = QR_perpendicular[2];

    // The point of intersection of L and M gives
    // the circumcenter
    return lineLineIntersection(a, b, c, e, f, g);

}

// Driver code.

