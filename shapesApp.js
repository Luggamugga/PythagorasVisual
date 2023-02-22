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
function rectGeN(startX,startY,stroke,fill,draggable,w,h){
    let newRect = new Konva.Rect({
        width:w,
        height:h,
        x:startX,
        y:startY,
        stroke:stroke,
        fill:fill,
        id: 'square',
        strokeWidth:1,
        draggable:draggable,
    })
    draggableShapes.add(newRect)
}
function TriangleGen(startX, startY, stroke, fill, draggable, rotation, code) {
    if (code == 0) {
        if (rotation == 0) {
            let P = [startX, startY];
            let Q = [startX + A, startY];
            let R = [startX + A, startY + A]
            let arr = findCircumCenter(P, Q, R);
            let newTri = new Konva.Shape({
                sceneFunc: function (context, shape) {
                    context.beginPath();
                    context.moveTo(startX, startY);
                    context.lineTo(startX + A, startY);
                    context.lineTo(startX + A, startY + B);
                    context.closePath();
                    context.fillStrokeShape(shape);
                },
                fill: fill,
                stroke: stroke,
                strokeWidth: 1,
                draggable: draggable,
                id: 'triangle',
                x: startX,
                y: startY,
                offset: {
                    x: arr[0],
                    y: arr[1]
                }
            });
            //layer.add(newTri);
            draggableShapes.add(newTri);
        }
    }
    if (code == 1) {
        let P;
        let Q;
        let R;
        let arr;
        switch (rotation) {
            case 90:
                P = [startX, startY];
                Q = [startX, startY + A];
                R = [startX - B, startY + A]
                arr = findCircumCenter(P, Q, R);
                break;
            case 0:
                P = [startX, startY];
                Q = [startX + A, startY + B];
                R = [startX + A, startY]
                arr = findCircumCenter(P, Q, R);
                break;
            case 180:
                P = [startX, startY];
                Q = [startX, startY + B];
                R = [startX + A, startY + B]
                arr = findCircumCenter(P, Q, R);
                break;
            case 270:
                P = [startX, startY];
                Q = [startX + B, startY];
                R = [startX, startY + A]
                arr = findCircumCenter(P, Q, R);
        }
        let newTri = new Konva.Shape({
            sceneFunc: function (context, shape) {
                context.beginPath();
                context.moveTo(P[0], P[1]);
                context.lineTo(Q[0], Q[1]);
                context.lineTo(R[0], R[1]);
                context.closePath();
                context.fillStrokeShape(shape);
            },
            fill: fill,
            stroke: stroke,
            strokeWidth: 1,
            draggable: draggable,
            id: rotation,
            name:'0',
            x: startX,
            y: startY,
            opacity:0,
            offset: {
                x: arr[0],
                y: arr[1]
            }
        });
        //layer.add(newTri);
        staticShapes.push(newTri);
        shapes.add(newTri);
    }
}
//generating drag Shapes:
function generateDragShapes(){
    let sX = windowWidth*0.65;
    let sY = drawHeight/8;
    let variX = windowWidth*0.20 ;
    let variY = drawHeight*0.30;
    TriangleGen(sX,sY,"black","lightblue",true,0,0);
    TriangleGen(sX+variX,sY,"black","lightblue",true,0,0);
    TriangleGen(sX+variX,sY+variY,"black","lightblue",true,0,0);
    TriangleGen(sX,sY+variY,"black","lightblue",true,0,0);

    draggableShapes.children.forEach(function(e){
        e.rotate(180);
    })
    rectGeN(sX+variX-((A+B)/4),sY+variY+A,"black","lightblue",true,A,A);
    rectGeN(sX-((A+B)/4),sY+variY+A,"black","lightblue",true,B,B);
}
generateDragShapes();
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
    if(e.target.getAttr('rotation') == 360)
    {
        e.target.setAttr('rotation', 0);
    }
})

movable.on("click", e => {
    console.log(e.target.getAttr('id'));
})


shapes.on("click", e => {
    console.log(e.target.getAttr('id'));
})

function drawTemplate(templateX,templateY) {
    TriangleGen(templateX, templateY, "black", "white", false,270, 1)
    TriangleGen(templateX, templateY, "black", "white", false,90,  1)
    TriangleGen(templateX + (B/2) + (A/2), templateY + (A/2) + (B/2), "black", "white", false,0,  1)
    TriangleGen(templateX + (B/2) + (A/2), templateY + (A/2) + (B/2), "black", "white", false,180,  1)
    let outlineSquare = new Konva.Rect({
        x:templateX - B/2,
        y:templateY - A/2,
        width:A+B,
        height:A+B,
        opacity:1,
        stroke:"black",
        id: 'square',
        strokeWidth:1,
    })
    let squareBig = new Konva.Rect({
        x: templateX - (B/2),
        y: templateY + (A/2),
        width: B,
        height: B,
        fill: 'white',
        stroke: 'black',
        id: 'square',
        strokeWidth: 1,
        draggable: false,
        name:'0',
        opacity:0,
    });
    let squareSmall = new Konva.Rect({
        x: templateX + (B/2),
        y: templateY - (A/2),
        width: A,
        height: A,
        fill: 'white',
        stroke: 'black',
        id: 'square',
        strokeWidth: 1,
        draggable: false,
        name:'0',
        opacity:0,
    });
    shapes.add(squareBig)
    shapes.add(squareSmall)
    shapes.add(outlineSquare)
    staticShapes.push(squareSmall)
    staticShapes.push(squareBig)
  //  staticShapes.push(outlineSquare)
    console.log(staticShapes[0].getX(), staticShapes[0].getY())
}

drawTemplate(windowWidth/4,drawHeight/2-((A+B)/2)-20)

movable.zIndex(1);
stationary.zIndex(0);

//setting the opacity of all shapes to 0:
/*for(i in staticShapes){
    staticShapes[i].opacity(0);
}*/

let tempLayer = new Konva.Layer();
stage.add(tempLayer);
let previousShape;


stage.on('dragstart', function (e) {
    e.target.moveTo(tempLayer);
    movable.draw();
});

stage.on('dragmove', function (evt) {
    activeDrag = evt.target
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

    staticShapes.forEach(e =>{
        if((e.getX()+50 >= activeDrag.getX() && e.getX()-50 <= activeDrag.getX()) && (e.getY()+50 >= activeDrag.getY() && e.getY()-50 <= activeDrag.getY()) && e.getAttr('id') === 'square' && activeDrag.getAttr('id') === 'square' && ((e.getAttr('width') === activeDrag.getAttr('width'))))
        {
            e.opacity(1);
        }
        if((e.getX()+50 >= activeDrag.getX() && e.getX()-50 <= activeDrag.getX()) && (e.getY()+50 >= activeDrag.getY() && e.getY()-50 <= activeDrag.getY()) && e.getAttr('id') == activeDrag.getAttr('rotation') && activeDrag.getAttr('id') != 'square')
        {
            e.opacity(1);
        }
    })

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

    staticShapes.forEach(e =>{
        if((e.getX()+50 >= activeDrag.getX() && e.getX()-50 <= activeDrag.getX()) && (e.getY()+50 >= activeDrag.getY() && e.getY()-50 <= activeDrag.getY()) && e.getAttr('id') == activeDrag.getAttr('rotation') && e.getAttr('name') == '0')
        {
            if(activeDrag.getAttr('rotation') == 0)
            {
                activeDrag.setAttr('x', e.getX());
                activeDrag.setAttr('y', e.getY() - (B-A)/2);
                activeDrag.setAttr('draggable', false);
                e.setAttr('name', '1');
                activeDrag.moveTo(stationary)
            }
            if(activeDrag.getAttr('rotation') == 90)
            {
                activeDrag.setAttr('x', e.getX() + (B-A)/2);
                activeDrag.setAttr('y', e.getY());
                activeDrag.setAttr('draggable', false);
                e.setAttr('name', '1');
                activeDrag.moveTo(stationary);
            }
            if(activeDrag.getAttr('rotation') == 180)
            {
                activeDrag.setAttr('x', e.getX());
                activeDrag.setAttr('y', e.getY() + (B-A)/2);
                activeDrag.setAttr('draggable', false);
                e.setAttr('name', '1');
                activeDrag.moveTo(stationary)
            }
            if(activeDrag.getAttr('rotation') == 270)
            {
                activeDrag.setAttr('x', e.getX() - (B-A)/2);
                activeDrag.setAttr('y', e.getY());
                activeDrag.setAttr('draggable', false);
                e.setAttr('name', '1');
                activeDrag.moveTo(stationary)
            }
        }
        if((e.getX()+50 >= activeDrag.getX() && e.getX()-50 <= activeDrag.getX()) && (e.getY()+50 >= activeDrag.getY() && e.getY()-50 <= activeDrag.getY()) && e.getAttr('id') == 'square' && activeDrag.getAttr('id') == 'square' && ((e.getAttr('width') == activeDrag.getAttr('width'))) && e.getAttr('name') == '0')
        {
            activeDrag.setAttr('x', e.getX());
            activeDrag.setAttr('y', e.getY());
            activeDrag.setAttr('draggable', false)
            e.setAttr('name', '1');
            activeDrag.moveTo(stationary)
        }
    })
});
stage.on('drop', e => {

})
stage.on('dragover', e => {
    /*if((e.target.getAttribute('id') === activeDrag.getAttribute('id')) && ((e.target.getAttribute('rotation') === activeDrag.getAttribute('rotation')))){
        activeDrag.setAttribute('fill', 'green');
    }*/

    console.log("suka");
})

//maths Functions to find Circumcenter:
function line(P, Q) {
    let a = Q[1] - P[1];
    let b = P[0] - Q[0];
    let c = a * (P[0]) + b * (P[1]);
    return [a,b,c];
}

function PBisect(P, Q, a, b, c) {
    let mid_point = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];

    c = -b * (mid_point[0]) + a * (mid_point[1]);

    let temp = a;
    a = -b;
    b = temp;
    return [a, b, c];
}

function linelineIntersect(a1, b1, c1, a2, b2, c2) {
    let determinant = a1 * b2 - a2 * b1;
    if (determinant == 0) {

        return [(10.0) ** 19, (10.0) ** 19];
    } else {
        let x = (b2 * c1 - b1 * c2) / determinant;
        let y = (a1 * c2 - a2 * c1) / determinant;
        return [x, y];
    }
}

function findCircumCenter(P, Q, R) {
    let PQ = line(P, Q);
    let a = PQ[0];
    let b = PQ[1];
    let c = PQ[2];

    let QR = line(Q, R);
    let e = QR[0];
    let f = QR[1];
    let g = QR[2];

    let PQ_Perp = PBisect(P, Q, a, b, c);
    a = PQ_Perp[0];
    b = PQ_Perp[1];
    c = PQ_Perp[2];

    let QR_Perp = PBisect(Q, R, e, f, g);
    e = QR_Perp[0];
    f = QR_Perp[1];
    g = QR_Perp[2];

    return linelineIntersect(a, b, c, e, f, g);

}