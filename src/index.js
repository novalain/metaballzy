//import Metaballs from './metaballs.js';
import "./index.css"
import cat from "./cat.jpg"

console.log("hello")

const canvas = document.createElement('canvas');
canvas.style.display = 'block';
canvas.style.boxSizing = 'border-box';
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;
canvas.style.width = window.innerWidth;
canvas.style.height = window.innerHeight;

document.body.appendChild(canvas);
const gl = canvas.getContext('webgl2');

const render = () => {
	console.log("amx draw buffers", gl.getParameter(gl.MAX_DRAW_BUFFERS));
	// gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // gl.clearColor(127.0, 127.0, 127.0, 1.0);

    // gl.cullFace(gl.BACK);
    // gl.enable(gl.CULL_FACE);

    // gl.enable(gl.DEPTH_TEST);
    // gl.depthFunc(gl.LEQUAL);

    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	requestAnimationFrame(render);
};

render();

// import React from 'react';
// import ReactDOM from 'react-dom';

// ReactDOM.render(
//   <h1>Hello, world!</h1>,
//   document.body
// );