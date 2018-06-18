import "./index.css"
import cat from "./cat.jpg"
import MetaballsRenderer from "./metaballsrenderer.js"

console.log("Hello app!")

// Create canvas
const canvas = document.createElement('canvas')
canvas.style.display = 'block'
canvas.style.boxSizing = 'border-box'
canvas.width = window.innerWidth * window.devicePixelRatio
canvas.height = window.innerHeight * window.devicePixelRatio
canvas.style.width = window.innerWidth
canvas.style.height = window.innerHeight
document.body.appendChild(canvas)

// Fire away rendering
const context = canvas.getContext('webgl2')
const metaballsRenderer = new MetaballsRenderer(context)

function render() {
	metaballsRenderer.render()
	requestAnimationFrame(render);
}
render();
