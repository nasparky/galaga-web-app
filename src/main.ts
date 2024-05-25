import '@styles/global.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="runtime"></canvas>
`

import { Vector2 } from '@core/math/vector'
import { CatmullRomSpline2 } from '@core/math/catmullrom'

const canvas = document.querySelector("#runtime") as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const crs = new CatmullRomSpline2(
  [new Vector2(0, 0), new Vector2(200, 100), new Vector2(500, 50), new Vector2(800, 600)], true
)

ctx.fillStyle = "red"

for (let i = 0; i < 1; i += 0.005) {
  const v = crs.getPointAt(i)
  //console.log(v.x, v.y, 5, 5)
  ctx.fillRect(v.x, v.y, 5, 5)

  //console.log(v)
}

/*
let i = 0
function run() {
  window.requestAnimationFrame(run)

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  i += 0.002

  if (i >= 1) {
    i = 0
  }

  const v = crs.getPointAt(i)
  ctx.beginPath()
  ctx.ellipse(v.x, v.y, 8, 8, 0, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fill()
}
*/