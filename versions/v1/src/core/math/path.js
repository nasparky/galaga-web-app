import { Vector2 } from "./vector2.js";

// Linear Bezier Function
function linearBezier(p0x, p0y, p1x, p1y, t) {
  const Bx = (1 - t) * p0x + t * p1x;
  const By = (1 - t) * p0y + t * p1y;
  return [Bx, By];
}

// Function CubicPoly used to define the cubic polynomial for the spline. THREE.js see notes.
function CubicPoly() {
  let c0 = 0,
    c1 = 0,
    c2 = 0,
    c3 = 0;
  //
  //Compute coefficients for a cubic polynomial
  //  p(s) = c0 + c1*s + c2*s^2 + c3*s^3
  //such that
  //  p(0) = x0, p(1) = x1
  // and
  //  p'(0) = t0, p'(1) = t1.
  //
  function init(x0, x1, t0, t1) {
    c0 = x0;
    c1 = t0;
    c2 = -3 * x0 + 3 * x1 - 2 * t0 - t1;
    c3 = 2 * x0 - 2 * x1 + t0 + t1;
  }

  return {
    // Standard Catmull-Rom
    initCatmullRom: function (x0, x1, x2, x3, tension) {
      init(x1, x2, tension * (x2 - x0), tension * (x3 - x1));
    },

    // Non-uniform Catmull-Rom
    initNonuniformCatmullRom: function (x0, x1, x2, x3, dt0, dt1, dt2) {
      // compute tangents when parameterized in [t1,t2]
      let t1 = (x1 - x0) / dt0 - (x2 - x0) / (dt0 + dt1) + (x2 - x1) / dt1;
      let t2 = (x2 - x1) / dt1 - (x3 - x1) / (dt1 + dt2) + (x3 - x2) / dt2;

      // rescale tangents for parametrization in [0,1]
      t1 *= dt1;
      t2 *= dt1;

      init(x1, x2, t1, t2);
    },

    // Catmull-Rom calculations.
    calc: function (t) {
      const t2 = t * t;
      const t3 = t2 * t;
      return c0 + c1 * t + c2 * t2 + c3 * t3;
    },
  };
}

// Helper variables.
const tmp = new Vector2();
const px = new CubicPoly();
const py = new CubicPoly();

// Class CatmullRomSpline2 used as the path curve, modified THREE.js 3D version.
class CatmullRomSpline2 {
  constructor(
    points = [],
    closed = false,
    curveType = "centripetal",
    tension = 0.5
  ) {
    this.points = points;
    this.closed = closed;
    this.curveType = curveType;
    this.tension = tension;
  }

  setPoints(points) {
    this.points = points;
  }

  getPoint(t, optionalTarget = new Vector2()) {
    // ----------------------------------------- //
    const point = optionalTarget; // New Point
    const points = this.points; // Current Points of CatmullRom
    const l = points.length; // Length of the points
    const p = (l - (this.closed ? 0 : 1)) * t; // p value
    let intPoint = Math.floor(p); // int p value
    let weight = p - intPoint; // May be a float depending on p value
    // ----------------------------------------- //
    if (this.closed) {
      intPoint +=
        intPoint > 0 ? 0 : (Math.floor(Math.abs(intPoint) / l) + 1) * l;
    } else if (weight === 0 && intPoint === l - 1) {
      intPoint = l - 2;
      weight = 1;
    }
    // ----------------------------------------- //
    let p0, p3; // 4 points (p1 & p2 defined below)

    if (this.closed || intPoint > 0) {
      p0 = points[(intPoint - 1) % l];
    } else {
      // extrapolate first point
      tmp.subVectors(points[0], points[1]).add(points[0]);
      p0 = tmp;
    }
    // ----------------------------------------- //
    const p1 = points[intPoint % l];
    const p2 = points[(intPoint + 1) % l];

    if (this.closed || intPoint + 2 < l) {
      p3 = points[(intPoint + 2) % l];
    } else {
      // extrapolate last point
      tmp.subVectors(points[l - 1], points[l - 2]).add(points[l - 1]);
      p3 = tmp;
    }
    // ----------------------------------------- //
    if (this.curveType === "centripetal" || this.curveType === "chordal") {
      // init Centripetal / Chordal Catmull-Rom
      const pow = this.curveType === "chordal" ? 0.5 : 0.25;
      let dt0 = Math.pow(p0.distanceToSquared(p1), pow);
      let dt1 = Math.pow(p1.distanceToSquared(p2), pow);
      let dt2 = Math.pow(p2.distanceToSquared(p3), pow);

      // safety check for repeated points
      if (dt1 < 1e-4) dt1 = 1.0;
      if (dt0 < 1e-4) dt0 = dt1;
      if (dt2 < 1e-4) dt2 = dt1;

      px.initNonuniformCatmullRom(p0.x, p1.x, p2.x, p3.x, dt0, dt1, dt2);
      py.initNonuniformCatmullRom(p0.y, p1.y, p2.y, p3.y, dt0, dt1, dt2);
    } else if (this.curveType === "catmullrom") {
      px.initCatmullRom(p0.x, p1.x, p2.x, p3.x, this.tension);
      py.initCatmullRom(p0.y, p1.y, p2.y, p3.y, this.tension);
    }
    // ----------------------------------------- //
    point.update(px.calc(weight), py.calc(weight));
    return point;
  }

  getPointAt(u, optionalTarget) {
    const t = this.getUtoTmapping(u);
    return this.getPoint(t, optionalTarget);
  }

  getTangent(t, optionalTarget = new Vector2()) {
    const delta = 0.0001;
    let t1 = t - delta;
    let t2 = t + delta;

    // Capping in case of danger
    if (t1 < 0) t1 = 0;
    if (t2 > 1) t2 = 1;

    const pt1 = this.getPoint(t1);
    const pt2 = this.getPoint(t2);
    const tangent = optionalTarget;
    tangent.copy(pt2).sub(pt1).normalize();
    return tangent;
  }

  getTangentAt(u, optionalTarget) {
    const t = this.getUtoTmapping(u);
    return this.getTangent(t, optionalTarget);
  }

  getLength() {
    const lengths = this.getLengths();
    return lengths[lengths.length - 1];
  }

  // Get list of cumulative segment lengths

  getLengths(divisions = 200) {
    if (
      this.cacheArcLengths &&
      this.cacheArcLengths.length === divisions + 1 &&
      !this.needsUpdate
    ) {
      return this.cacheArcLengths;
    }

    this.needsUpdate = false;

    const cache = [];
    let current,
      last = this.getPoint(0);
    let sum = 0;

    cache.push(0);

    for (let p = 1; p <= divisions; p++) {
      current = this.getPoint(p / divisions);
      sum += current.distanceTo(last);
      cache.push(sum);
      last = current;
    }

    this.cacheArcLengths = cache;
    return cache; // { sums: cache, sum: sum }; Sum is in the last element.
  }

  getUtoTmapping(u, distance) {
    // Use Arc Length Parametrization
    const arcLengths = this.getLengths();

    let i = 0;
    const il = arcLengths.length;

    let targetArcLength; // The targeted u distance value to get

    if (distance) {
      targetArcLength = distance;
    } else {
      targetArcLength = u * arcLengths[il - 1];
    }

    // binary search for the index with largest value smaller than target u distance
    let low = 0,
      high = il - 1,
      comparison;

    while (low <= high) {
      i = Math.floor(low + (high - low) / 2); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats
      comparison = arcLengths[i] - targetArcLength;
      if (comparison < 0) {
        low = i + 1;
      } else if (comparison > 0) {
        high = i - 1;
      } else {
        high = i;
        break;
        // DONE
      }
    }

    i = high;
    if (arcLengths[i] === targetArcLength) {
      return i / (il - 1);
    }

    // we could get finer grain at lengths, or use simple interpolation between two points
    const lengthBefore = arcLengths[i];
    const lengthAfter = arcLengths[i + 1];

    const segmentLength = lengthAfter - lengthBefore;

    // determine where we are between the 'before' and 'after' points
    const segmentFraction = (targetArcLength - lengthBefore) / segmentLength;

    // add that fractional amount to t
    const t = (i + segmentFraction) / (il - 1);

    return t;
  }
}

// Class Path used as a path bound for specifiying waypoints and curvatures.
class Path {
  #spline;

  constructor(points = []) {
    this.points = points;
    this.#spline = new CatmullRomSpline2(
      this.points,
      false,
      "centripetal",
      0.5
    );
  }

  addPoint(point) {
    this.points.push(point);
  }
  addPointFront(point) {
    this.points.unshift(point);
  }
  removePoint() {
    this.points.pop();
  }
  reversePoints() {
    this.points = this.points.reverse();
  }
  modifyPoint(newPoint, index) {
    this.points[index] = newPoint;
  }
  modifyPoints(mod, type) {
    if (type == "x") {
      for (const p of this.points) {
        p.update(p.x + mod, p.y);
      }
    } else if (type == "y") {
      for (const p of this.points) {
        p.update(p.x, p.y + mod);
      }
    }
  }
  matchPoints(point) {
    for (const p of this.points) {
      p.update(point.x + p.x, point.y + p.y);
    }
  }

  setPath(points) {
    this.points = points;
    this.#spline.setPoints(points);
  }

  getLengths() {
    let totalDistance = 0;
    const lengths = [];
    for (let i = 0; i < this.points.length - 1; i++) {
      lengths.push(this.points[i].distanceTo(this.points[i + 1]));
      totalDistance += this.points[i].distanceTo(this.points[i + 1]);
    }

    const percentages = [];
    for (const l of lengths) {
      percentages.push(l / totalDistance);
    }

    return percentages;
  }

  getUnitVector(t) {
    return this.#spline.getTangent(t);
  } // Returns Vector2 Class
  getTangentAngle(t) {
    return this.#spline.getTangent(t).angle();
  } // Returns Float
  getTangentAngleU(u) {
    return this.#spline.getTangentAt(u).angle();
  }
  followPath(t) {
    return this.#spline.getPoint(t);
  } // Returns Vector2 Class
  followPathU(u) {
    return this.#spline.getPointAt(u);
  }

  getReturnPath(p0, p1, t) {
    // Linear Interpolation, but really linear bezier.
    const Bx = (1 - t) * p0[0] + t * p1[0];
    const By = (1 - t) * p0[1] + t * p1[1];
    return [Bx, By];
  }
  getReturnTangentAngle(p0, p1) {
    const newv = new Vector2();
    const Tx = p1[0] - p0[0];
    const Ty = p1[1] - p0[1];
    newv.update(Tx, Ty);

    return newv.angle();
  }

  approximateTotalArcLength() {
    // There is not an easy way of finding the length of a parametric curve without some form of approximation
    // or immensively complex algorithm.
    const deltat = 0.005;
    let arcLength = 0.0;

    let a = null;
    let b = null;

    for (let t = 0; t < 1.0; t += deltat) {
      a = this.#spline.getPoint(t);
      b = this.#spline.getPoint(t + deltat);
      arcLength += a.distanceTo(b);
    }
    return arcLength;
  }

  getArcLength() {
    return this.#spline.getLength();
  }
  getEquiDistantPoints(u, distance) {
    return this.#spline.getUtoTmapping(u, distance);
  }

  clone() {
    const pts = [];
    for (const p of this.points) {
      pts.push(new Vector2(p.x, p.y));
    }
    return new Path(pts);
  }

  draw(canvas) {
    if (this.points.length >= 2) {
      let p;
      for (let t = 0.0; t < 1.0; t += 0.001) {
        p = this.#spline.getPoint(t);
        canvas.beginPath();
        canvas.fillStyle = "red";
        canvas.fillRect(p.x, p.y, 2, 2);
      }
    }
    //if(this.points.length > 0) {
    //    for(const p of this.points) {
    //        canvas.beginPath();
    //        canvas.arc(p.x, p.y, 5.0, 0, Math.PI * 2, false);
    //        canvas.closePath();
    //        canvas.fillStyle = "cyan";
    //        canvas.fill();
    //    }
    //}
  }
}

export { linearBezier, Path };
