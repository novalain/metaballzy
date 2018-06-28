import "./index.css"
import MetaballsRenderer from "./metaballsrenderer.js"
import cat from "./cat.jpg"

console.log("Hello app!")

// Create canvas
const canvas = document.createElement('canvas')
document.body.appendChild(canvas)

///document.body.innerHTML = '<img src=' + cat + '/>'
// Load resources
// Fire away rendering
const context = canvas.getContext('webgl2')
const metaballsRenderer = new MetaballsRenderer(context)

window.addEventListener('resize', () => {
	metaballsRenderer.setSize(window.innerWidth, window.innerHeight);
});

function render() {
	metaballsRenderer.render()
	requestAnimationFrame(render);
}
render();
