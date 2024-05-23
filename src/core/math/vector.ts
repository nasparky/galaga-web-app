/*
Vector classes, describes the terminal point where we can easily find the magnitude and direction in cartesian coordinates.
*/

/**
 * Return the distance between two vectors
 * 
 * @param v vector 1 
 * @param w vector 2
 * 
 * @returns distance value between v and w
 */
export function vectorDistance(v: Vector2, w: Vector2) {
    return Math.sqrt(((v.x - w.x) * (v.x - w.x)) + ((v.y - w.y) * (v.y - w.y)))
}

export class Vector2 {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    add(v: Vector2, w?: Vector2) {
        if (w !== undefined) {
            this.x = v.x + w.x
            this.y = v.y + w.y
        } else {
            this.x = v.x
            this.y = v.y
        }
        return this
    }

    sub(v: Vector2, w?: Vector2) {
        if (w !== undefined) {
            this.x = v.x - w.x
            this.y = v.y - w.y
        } else {
            this.x = v.x
            this.y = v.y
        }
        return this
    }

    multiplyByScalar(s: number) {
        this.x *= s
        this.y *= s
        return this
    }

    divideByScalar(s: number) {
        return this.multiplyByScalar(1 / s) // Faster to divide once than twice with multiplication taking less time per iteration
    }

    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y) // c^2 = b^2 + a^2
    }

    getNormalized() {
        return this.divideByScalar(this.getLength() || 1) // If the length exist or use 1 instead, short circuit evaluation
    }
}
