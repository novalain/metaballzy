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
const gl = canvas.getContext('webgl2')
const metaballsRenderer = new MetaballsRenderer(gl)

window.addEventListener('resize', () => {
	metaballsRenderer.setSize(window.innerWidth, window.innerHeight);
});

const targetTextureWidth = 256;
const targetTextureHeight = 256;
const targetTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, targetTexture);

// define size and format of level 0
const level = 0;
const internalFormat = gl.RGBA;
const border = 0;
const format = gl.RGBA;
const type = gl.UNSIGNED_BYTE;
const data = null;
gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
	targetTextureWidth, targetTextureHeight, border,
	format, type, data);

// set the filtering so we don't need mips
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

// Create and bind the framebuffer
const fb = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

// attach the texture as the first color attachment
const attachmentPoint = gl.COLOR_ATTACHMENT0;
gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, tex, level);

function render() {
	metaballsRenderer.render()
	requestAnimationFrame(render);
}
render();
