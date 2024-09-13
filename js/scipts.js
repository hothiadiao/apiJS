class TrapezoidAPI {
    constructor(svgElement, trapezoidElement) {
        this.svgElement = svgElement;
        this.trapezoidElement = trapezoidElement;
        this.originalPoints = trapezoidElement.getAttribute('points');

        this.svgElement.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(event) {
        const { x, y } = this.getMousePosition(event);
        const isInside = this.isPointInTrapezoid(x, y);

        if (isInside) {
            if (this.isOnTopLine(x, y)) {
                this.animateShapeChange('top');
            } else if (this.isOnBottomLine(x, y)) {
                this.animateShapeChange('bottom');
            } else if (this.isOnLeftLine(x, y)) {
                this.animateShapeChange('left');
            } else if (this.isOnRightLine(x, y)) {
                this.animateShapeChange('right');
            } else {
                this.animateResetShape();
            }
        } else {
            this.animateExpandShape();
        }
    }

    getMousePosition(event) {
        const rect = this.svgElement.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    isPointInTrapezoid(x, y) {
        const points = this.trapezoidElement.getAttribute('points').split(' ').map(p => p.split(',').map(Number));
        return this.isPointInPolygon({ x, y }, points);
    }

    isPointInPolygon(point, polygon) {
        let collision = false;
        const { x, y } = point;

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i][0], yi = polygon[i][1];
            const xj = polygon[j][0], yj = polygon[j][1];

            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) collision = !collision;
        }

        return collision;
    }

    isOnTopLine(x, y) {
        return this.isPointOnLineSegment(x, y, 150, 150, 350, 150);
    }

    isOnBottomLine(x, y) {
        return this.isPointOnLineSegment(x, y, 200, 300, 300, 300);
    }

    isOnLeftLine(x, y) {
        return this.isPointOnLineSegment(x, y, 150, 150, 200, 300);
    }

    isOnRightLine(x, y) {
        return this.isPointOnLineSegment(x, y, 350, 150, 300, 300);
    }

    isPointOnLineSegment(x, y, x1, y1, x2, y2) {
        const epsilon = 5;
        const distance = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
                         Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
        return distance < epsilon;
    }

    animateShapeChange(line) {
        let newPoints;
        switch (line) {
            case 'top':
                newPoints = "150,150 350,150 325,300 175,300";
                break;
            case 'bottom':
                newPoints = "125,150 375,150 300,300 200,300";
                break;
            case 'left':
                newPoints = "150,150 350,150 275,300 175,300";
                break;
            case 'right':
                newPoints = "150,150 350,150 325,300 225,300";
                break;
        }
        gsap.to(this.trapezoidElement, {
            duration: 1,
            attr: { points: newPoints },
            ease: "power2.out"
        });
    }

    animateExpandShape() {
        gsap.to(this.trapezoidElement, {
            duration: 1,
            attr: { points: "100,100 400,100 350,400 150,400" },
            ease: "power2.out"
        });
    }

    animateResetShape() {
        gsap.to(this.trapezoidElement, {
            duration: 1,
            attr: { points: this.originalPoints },
            ease: "power2.out"
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const svgElement = document.getElementById('svgCanvas');
    const trapezoidElement = document.getElementById('trapezoid');
    new TrapezoidAPI(svgElement, trapezoidElement);
});
