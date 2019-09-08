class Wall {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    constructor(ax: number, ay: number, bx: number, by: number) {
        this.ax = ax;
        this.ay = ay;
        this.bx = bx;
        this.by = by;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo(this.ax, this.ay);
        ctx.lineTo(this.bx, this.by);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}