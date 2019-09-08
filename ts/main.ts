const canvas = <HTMLCanvasElement>document.createElement('canvas');
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
const cw: number = 1000;
const ch: number = 1000;
canvas.height = ch;
canvas.width = cw;

document.body.appendChild(canvas)

// ---- scene setup --------------

const box = new Box(100, 100, 200, 200, 1.4544);
const walls = [
    new Wall(900, 200, 800, 800),
    new Wall(0, 0, 1000, 0),
    new Wall(1000, 0, 1000, 1000),
    new Wall(1000, 1000, 0, 1000),
    new Wall(0, 1000, 0, 0),
    ...box.getSegments()
];
let angle = 0;
const points: [number, number][] = [];
const light = new Light(500, 500);
const ray = new Ray(light.x, light.y, Math.cos(angle), Math.sin(angle));
const ActiveKeys: number[] = [];
let start = new Date().getTime();

function draw() {
    // ---- has to be before for fps ------------
    start = new Date().getTime();
    ctx.clearRect(0, 0, cw, ch);
    // ------------------------------------------
    // background color
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cw, ch);
    ctx.restore();
    // draw every things
    for (let i of walls) {
        i.draw(ctx);
    }
    light.draw(ctx);
    box.draw(ctx);
    //ray casting setup
    angle = 0;
    const rays = 3760;
    const drawRays = false;
    const drawPoints = false;
    //raycasting
    for (let i of new Array(rays)) {
        const iter = ray.cast(walls);
        if (iter[0] !== undefined && iter[1] !== undefined) {
            if (drawRays) {
                ctx.save();
                ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
                ctx.beginPath();
                ctx.moveTo(ray.x, ray.y);
                //@ts-ignore
                ctx.lineTo(...iter);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
            //@ts-ignore
            points.push(iter)
        }
        angle += Math.PI * 2 / rays
        ray.vx = Math.cos(angle);
        ray.vy = Math.sin(angle);
    }
    if (drawPoints) {
        for (let i of points) {
            ctx.save();
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(i[0], i[1], 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
    }
    // light drawing
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)"
    ctx.beginPath();
    ctx.moveTo(...points[0]);

    for (let i of points) {
        ctx.lineTo(...i);
    }
    ctx.lineTo(...points[0]);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
    // reset
    points.splice(0, points.length)
    // ---- controls ------------------------------

    const moveFactor = 0.5;
    let moveX = 0;
    let moveY = 0;

    if (ActiveKeys.indexOf(37) !== -1) {
        moveX -= moveFactor;
    }
    if (ActiveKeys.indexOf(38) !== -1) {
        moveY -= moveFactor;
    }
    if (ActiveKeys.indexOf(39) !== -1) {
        moveX += moveFactor;
    }
    if (ActiveKeys.indexOf(40) !== -1) {
        moveY += moveFactor;
    }
    light.move(moveX, moveY, walls);
    ray.x = light.x;
    ray.y = light.y;

    // ---- has to be last fps counter ------------
    const time = new Date().getTime() - start;
    ctx.fillStyle = "red";
    ctx.font = "Arial 50px"
    ctx.fillText((Math.floor((1000 / time) * 100) / 100).toString(), 10, 50);
}


draw.rate = 1000;

draw.interval = setInterval(draw, 1000 / draw.rate);


const _$$c: HTMLCanvasElement = canvas;
const _$$cw = _$$c.width;
const _$$ch = _$$c.height;
function _$$adaptSize() {
    let rhl = _$$cw / _$$ch;
    let rlh = _$$ch / _$$cw;
    if (window.innerWidth > window.innerHeight * rhl) {
        _$$c.style.width = 'inherit';
        _$$c.style.height = '100%';
    }
    if (window.innerHeight > window.innerWidth * rlh) {
        _$$c.style.height = 'inherit';
        _$$c.style.width = '100%';
    }
}
_$$adaptSize();

window.addEventListener('resize', _$$adaptSize);

document.addEventListener("keydown", e => {
    if (ActiveKeys.indexOf(e.keyCode) == -1) {
        ActiveKeys.push(e.keyCode);
    }
});

document.addEventListener('keyup', e => {
    if (ActiveKeys.indexOf(e.keyCode) !== -1) {
        ActiveKeys.splice(ActiveKeys.indexOf(e.keyCode), 1)
    }
})

