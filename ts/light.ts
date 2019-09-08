class Light {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    move(x: number, y: number, collide: Wall[]) {
        const vectorMag = Math.hypot(x, y);
        if (vectorMag === 0) return;
        const colRay = new Ray(this.x, this.y, x / vectorMag, y / vectorMag);
        const collidePoint = colRay.cast(collide);
        if (collidePoint[0] !== undefined && collidePoint[1] !== undefined) {
            const distance1 = Math.hypot(Math.abs(this.x - collidePoint[0]), Math.abs(this.y - collidePoint[1])) - 10;
            const distance2 = Math.hypot(Math.abs(this.x - (this.x + x)), Math.abs(this.y - (this.y + y)))
            if (distance1 < distance2) {
                this.x = collidePoint[0] + (-(x) / vectorMag) * 10;
                this.y = collidePoint[1] + (-(y) / vectorMag) * 10;
            } else {
                this.x += x;
                this.y += y;
            }
        } else {
            this.x += x;
            this.y += y;
        }
    }
}