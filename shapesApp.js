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

let layer = new Konva.Layer();
//group for draggableShapes:
let draggableShapes = new Konva.Group();
//group for stationary shapes (or maybe we do a layer idk):
let staticShapes = new Konva.Group();

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

function TriangleGen(startX,startY,stroke,fill,draggable){
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
        x:startX,
        y:startY,
        offset:{
            x:arr[0],
            y:arr[1]
        }
    });
    layer.add(newTri);
    draggableShapes.add(newTri);
}
//tw0 example triangles:
TriangleGen(500,500,"black","white",true);
TriangleGen(600,600,"black","white",true);

layer.add(draggableShapes);
stage.add(layer);

//limiting drag area:
draggableShapes.on("dragmove", (e) => {
    e.target.y(Math.max(e.target.getY(), 100))
    e.target.x(Math.max(e.target.getX(), 20));
    e.target.x(Math.min(e.target.getX(), windowWidth-50));
    e.target.y(Math.min(e.target.getY(),drawHeight-200));
});
//rotation on dblclick:
draggableShapes.on("dblclick",(e)=>{
    e.target.rotate(90);
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


// The code is contributed by Gautam goel (gautamgoel962)
