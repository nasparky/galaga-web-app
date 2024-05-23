/*
Path classes, contains common functions and classes for pathing and spline control

Heres a great video explaining a lot of the concepts involved: https://youtu.be/jvPPXbo87ds?list=LL, "The Contiunity of Splines" by Freya Holmer

u mapping = 0.0 to 1.0 for all t
t = 0.0 to 1.0, for each curve
*/

import { Vector2, vectorDistance } from '@core/math/vector'

/**
 * Return the cubic polynomial calculation between two points given time:
 * 
 * Compute coefficients for a cubic polynomial
 * p(s) = c0 + c1*s + c2*s^2 + c3*s^3
 * where p(0) = x0, p(1) = x1
 * and p'(0) = t0, p'(1) = t1
 * 
 * @param x0 value of the polynomial at s = 0, i.e., p(0) = x0
 * @param x1 value of the polynomial at s = 1, i.e., p(1) = x1
 * @param t0 value of the first derivative of the polynomial at s = 0, i.e., p'(0) = t0
 * @param t1 value of the first derivative of the polynomial at s = 1, i.e., p'(1) = t1
 * @param t time value
 * 
 * @returns value of the cubic polynomial equation
 */
export function cubicPoly(x0: number, x1: number, t0: number, t1: number, t: number) {
    const c0 = x0
    const c1 = t0
    const c2 = -3 * x0 + 3 * x1 - 2 * t0 - t1;
    const c3 = 2 * x0 - 2 * x1 + t0 + t1;

    return c0 + c1 * t + c2 * (t * t) + c3 * (t * t * t)
}

/**
 * Calculate the cubic polynomial of a Uniform Catmull-Rom
 * 
 * @param x0 start point before start
 * @param x1 start point
 * @param x2 end point 
 * @param x3 end point after start
 * @param tension tension value
 * 
 * @returns values for the cubic polynomial equation
 */
export function uniformCatmullRom(x0: number, x1: number, x2: number, x3: number, tension: number): number[] {
    return [x1, x2, (x2 - x0) * tension, (x3 - x1) * tension]
}

/**
 * Calculate the cubic polynomial of a non-uniform Catmull-Rom
 * 
 * @param x0 start point before start
 * @param x1 start point
 * @param x2 end point 
 * @param x3 end point after start
 * @param dt0 non-uniform time interval 1
 * @param dt1 non-uniform time interval 2
 * @param dt2 non-uniform time interval 3
 * 
 * @returns values for the cubic polynomial equation
 */
export function nonUniformCatmullRom(x0: number, x1: number, x2: number, x3: number, dt0: number, dt1: number, dt2: number): number[] {
    // Compute and re-scale parameterized tangents
    const t1 = ((x1 - x0) / dt0 - (x2 - x0) / (dt0 + dt1) + (x2 - x1) / dt1) * dt1
    const t2 = ((x2 - x1) / dt1 - (x3 - x1) / (dt1 + dt2) + (x3 - x2) / dt2) * dt1

    return [x1, x2, t1, t2]
}

interface Spline2 {
    /**
     * Given t find the point that exist on the spline.
     * 
     * @param t time value
     * 
     * @returns exit vector
     */
    getPoint(t: number): Vector2

    /**
     * Find the point given u
     * 
     * @param u equidistant time value
     * 
     * @returns exit vector at u
     */
    getPointAt(u: number): Vector2

    /**
     * Find t for the spline given u (total t)
     * 
     * @param u equidistant time value
     * 
     * @returns the t mapped value
     */
    getUToTMapping(u: number): number

    /**
     * Find the approximation of arc lengths between each point on the spline
     * 
     * @param N number of approximations for each arc length
     * 
     * @returns length of each corresponding point
     */
    getLengths(N: number): number[]
}

export class CatmullRomSpline2 implements Spline2 {
    points: Vector2[]
    closed: boolean
    curveType: "uniform" | "centripetal" | "chordal"
    tension: number

    constructor(
        points = [] as Vector2[],
        closed = false,
        curveType = "centripetal" as "centripetal",
        tension = 0.5
    ) {
        this.points = points
        this.closed = closed
        this.curveType = curveType
        this.tension = tension
    }

    getPoint(t: number) {
        const L = this.points.length
        const p = (L - (this.closed ? 0 : 1)) * t // Find the approximate point given t
        let ip = Math.floor(p)
        let weight = p - ip // Influence of the approximate point given t

        // Re-determine whether the closed loop influences the approximate point
        if (this.closed) {
            ip += ip > 0 ? 0 : (Math.floor(Math.abs(ip) / L) + 1) * L;
        } else if (weight === 0 && ip === L - 1) {
            ip = L - 2
            weight = 1
        }

        // Find the four points next to the approximate point
        const p0 = (this.closed || ip > 0) // If exist as closed or after the zeroth point
            ? this.points[(ip - 1) % L]
            : new Vector2(0, 0).sub(this.points[0], this.points[1]).add(this.points[0]) // Extrapolate
        const p1 = this.points[ip % L]
        const p2 = this.points[(ip + 1) % L]
        const p3 = (this.closed || ip + 2 < L) // If exist as closed or before the last point
            ? this.points[(ip + 2) % L]
            : new Vector2(0, 0).sub(this.points[L - 1], this.points[L - 2]).add(this.points[L - 1]) // Extrapolate

        // Find both the cubic polynomial calculations dependant on the catmull-rom curve and tension
        let px = 0
        let py = 0

        if (this.curveType === "uniform") {
            let [x0, x1, t0, t1] = uniformCatmullRom(p0.x, p1.x, p2.x, p3.x, this.tension)
            px = cubicPoly(x0, x1, t0, t1, weight) as number
            [x0, x1, t0, t1] = uniformCatmullRom(p0.y, p1.y, p2.y, p3.y, this.tension)
            py = cubicPoly(x0, x1, t0, t1, weight)
        } else if (this.curveType === "centripetal" || this.curveType === "chordal") {
            const pow = this.curveType === "chordal" ? 0.5 : 0.25;
            let dt0 = Math.pow(((p0.x - p1.x) * (p0.x - p1.x)) + ((p0.y - p1.y) * (p0.y - p1.y)), pow)
            let dt1 = Math.pow(((p1.x - p2.x) * (p1.x - p2.x)) + ((p1.y - p2.y) * (p1.y - p2.y)), pow)
            let dt2 = Math.pow(((p2.x - p3.x) * (p2.x - p3.x)) + ((p2.y - p3.y) * (p2.y - p3.y)), pow)

            // TODO: Update role
            if (dt1 < 1e-4) dt1 = 1.0;
            if (dt0 < 1e-4) dt0 = dt1;
            if (dt2 < 1e-4) dt2 = dt1;

            let [x0, x1, t0, t1] = nonUniformCatmullRom(p0.x, p1.x, p2.x, p3.x, dt0, dt1, dt2)
            px = cubicPoly(x0, x1, t0, t1, weight) as number
            [x0, x1, t0, t1] = nonUniformCatmullRom(p0.y, p1.y, p2.y, p3.y, dt0, dt1, dt2)
            py = cubicPoly(x0, x1, t0, t1, weight)
        }

        return new Vector2(px, py)
    }

    getPointAt(u: number) {
        return this.getPoint(this.getUToTMapping(u))
    }

    getUToTMapping(u: number) {
        let t = 0

        // Get the arc lengths
        const arcLengths = this.getLengths(200)
        const ALL = arcLengths.length

        // Use binary search and find the index with the largest value smaller than the target u distance
        let targetArcLength = u * arcLengths[ALL - 1]

        let l = 0
        let r = ALL - 1
        let m = 0

        while (l <= r) {
            m = Math.floor(l + (r - l) / 2) // Slightly different

            const c = arcLengths[m] - targetArcLength
            if (c < 0) {
                l = m + 1
            } else if (c > 0) {
                r = m - 1
            } else {
                break
            }
        }

        // Determine if the arc length has reached the target Arc Length
        if (arcLengths[m] === targetArcLength) {
            t = m / (ALL - 1);
        } else {
            // Use interpolation between the two points
            const lengthBefore = arcLengths[m]
            const lengthAfter = arcLengths[m + 1]
            const segmentLength = lengthAfter - lengthBefore
            const segmentFraction = (targetArcLength - lengthBefore) / segmentLength
            t = (m + segmentFraction) / (arcLengths.length - 1)
        }

        return t
    }

    getLengths(N: number) {
        const arcLengths: number[] = [0]

        let sum = 0
        for (let i = 0; i < N - 1; i++) {
            const pre = this.getPoint(i / N)
            const cur = this.getPoint((i + 1) / N)
            sum += vectorDistance(pre, cur)
            arcLengths.push(sum)
        }

        return arcLengths
    }
}