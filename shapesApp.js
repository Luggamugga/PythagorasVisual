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
    //get circumCenter:
let X1 = windowWidth    /2;
let Y1 = windowHeight/2;
let X2 = windowWidth/2+A;
let Y2 = windowHeight/2;
let X3 = windowWidth/2+A;
let Y3 = windowHeight/2+B;
let P1 = [X1,Y1];
let P2 = [X2,Y2];
let P3 = [X3,Y3];


let circumArr = findCircumCenter(P1,P2,P3);
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

         offset:{
            x:circumArr[0],
             y:circumArr[1]
         }

    });

    layer.add(triangle);
    stage.add(layer);
    triangle.on("dragmove",()=>{
        console.log(triangle.getX() + " " + triangle.getY());
        triangle.y(Math.max(triangle.getY(),61))

    });
   /* function getCircumCenter(X1,Y1,X2,Y2,X3,Y3){
        //circumcenter calculation to rotate around circumcenter
//https://www.omnicalculator.com/math/circumcenter-of-a-triangle
        let t = (X1*X1) + (Y1 * Y1) - (X2*X2) - (Y2 *Y2);
        let u = (X2*X2) + (Y1*Y2) - (X3*X3)-(Y3*Y3);
        let J = (X1-X2)*(Y1-Y3)*(X1-X3)*(Y1-Y2);

        let X = ((-1*(Y1-Y2))*u + (Y1-Y3) * t)/(2*J);
        let Y = ((X1-X2)*u +(Y1-Y3)*t)/(2*J);
        return {x: Math.round(X), y: Math.round(Y)};
    }*/





triangle.on("dblclick",()=>{
    let prevX = triangle.getX();
    let prevY = triangle.getY();
    triangle.rotate(90);
    console.log(prevX);
    console.log(prevY);

})
// JavaScript program to find the CIRCUMCENTER of a
// triangle

// This pair is used to store the X and Y
// coordinate of a point respectively
// #define pdd pair<double, double>

// Function to find the line given two points
function lineFromPoints(P, Q)
{
    let a = Q[1] - P[1];
    let b = P[0] - Q[0];
    let c = a*(P[0])+ b*(P[1]);
    return [a, b, c];
}

// Function which converts the input line to its
// perpendicular bisector. It also inputs the points
// whose mid-point lies on the bisector
function perpendicularBisectorFromLine(P, Q, a, b, c)
{
    let mid_point = [(P[0] + Q[0])/2, (P[1] + Q[1])/2];

    // c = -bx + ay
    c = -b*(mid_point[0]) + a*(mid_point[1]);

    let temp = a;
    a = -b;
    b = temp;
    return [a, b, c];
}

// Returns the intersection point of two lines
function lineLineIntersection(a1, b1, c1, a2, b2, c2)
{
    let determinant = a1*b2 - a2*b1;
    if (determinant == 0)
    {
        // The lines are parallel. This is simplified
        // by returning a pair of FLT_MAX
        return [(10.0)**19, (10.0)**19];
    }

    else
    {
        let x = (b2*c1 - b1*c2)/determinant;
        let y = (a1*c2 - a2*c1)/determinant;
        return [x, y];
    }
}

function findCircumCenter(P, Q, R)
{
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
    let circumcenter = lineLineIntersection(a, b, c, e, f, g);

    if (circumcenter[0] == (10.0)**19 && circumcenter[1] == (10.0)**19){
        console.log("The two perpendicular bisectors found come parallel" )
        console.log("Thus, the given points do not form a triangle and are collinear");
    }
    else{
        console.log("The circumcenter of the triangle PQR is: (", circumcenter[0], ",", circumcenter[1], ")");
        return circumcenter;
    }
}

// Driver code.


// The code is contributed by Gautam goel (gautamgoel962)
