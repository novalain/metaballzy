
import cat from "./cat.jpg"

const NUM_METABALLS = 5;

const vertexSource = `#version 300 es
    layout(location = 0) in vec2 position;

    out vec2 vUv;

    void main() {
        vUv = position;
        gl_Position = vec4(position, 0.0, 1.0);
    }
`

const fragmentSource = `#version 300 es
    precision highp float;

    uniform vec3 metaballs[${NUM_METABALLS}];
    uniform float width;
    uniform float height;
    uniform int numMetaballs;

    uniform sampler2D dummyTex;

    out vec4 outColor;
    in vec2 vUv;

    void main() {
        float x = gl_FragCoord.x;
        float y = gl_FragCoord.y;
        float v = 0.0;

        for (int i = 0; i < ${NUM_METABALLS}; i++) {
            vec3 mb = metaballs[i];
            float dx = mb.x - x;
            float dy = mb.y - y;
            float r = mb.z;
            v += r * r / (dx * dx + dy * dy);
        }
        if (v > 1.0) {
            outColor = texture(dummyTex, vec2(gl_FragCoord.x / width, gl_FragCoord.y / height));
        } else {
            outColor = vec4(0.0, 1.0, 0.0, 1.0);
        }
    }
`

export default class MetaballsRenderer {
    constructor(context) {
        this.context = context
        const gl = this.context;

        console.log("Setting up renderer ...");
        console.log("cat", cat);

        this.numMetaballs = NUM_METABALLS;
        gl.clearColor(1.0, 0.0, 0.0, 1.0);

        // Create program
        this.program = gl.createProgram();
        gl.attachShader(this.program, this.compileShader(vertexSource, gl.VERTEX_SHADER));
        gl.attachShader(this.program, this.compileShader(fragmentSource, gl.FRAGMENT_SHADER));
        gl.linkProgram(this.program);
        gl.useProgram(this.program);

        // Send a quad to GPU
        const vertexData = new Float32Array([
            -1.0, 1.0,
            -1.0, -1.0,
            1.0, 1.0,
            1.0, -1.0,
        ]);

        const vertexDataBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(
            0,
            2,
            gl.FLOAT,
            gl.FALSE,
            2 * 4,
            0
        );
 
        this.setSize(window.innerWidth, window.innerHeight);
        this._dummyTex = this._loadTexture(cat);
        this._spawnMetaballs();
    }

    setSize(width, height) {
        const w = width * window.devicePixelRatio;
        const h = height * window.devicePixelRatio;

        const gl = this.context;
        gl.canvas.width = w;
        gl.canvas.height = h;
        gl.canvas.style.width = `${w / window.devicePixelRatio}px`;
        gl.canvas.style.height = `${h / window.devicePixelRatio}px`;

        this.width = gl.canvas.width;
        this.height = gl.canvas.height;
    }

    _loadTexture(url) {
        const gl = this.context;

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            pixel);

        const image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        };
        image.src = url;
        return texture;
    }

    _spawnMetaballs() {
        this.metaballs = [];
        for (let i = 0; i < this.numMetaballs; ++i) {
            const radius = 100;//Math.random() * 50 + 70;
            this.metaballs.push({
                x: Math.random() * (this.width - 2 * radius) + radius,
                y: Math.random() * (this.height - 2 * radius) + radius,
                vx: Math.random() * 5 - 2,
                vy: Math.random() * 5 - 2,
                r: radius
            });
        }
    }

    compileShader(src, type) {
        const gl = this.context;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
        }
        return shader;
    }

    render() {
        const gl = this.context;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, this.width, this.height);

        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_2D, this._dummyTex);
        const location = gl.getUniformLocation(this.program, 'dummyTex');
        gl.uniform1i(location, 0);

        // Step
        for (let i = 0; i < this.numMetaballs; i++) {
            let mb = this.metaballs[i];
            mb.x += mb.vx;
            if (mb.x - mb.r < 0) {
                mb.x = mb.r + 1;
                mb.vx = Math.abs(mb.vx);
            } else if (mb.x + mb.r > this.width) {
                mb.x = this.width - mb.r;
                mb.vx = -Math.abs(mb.vx);
            }
            mb.y += mb.vy;
            if (mb.y - mb.r < 0) {
                mb.y = mb.r + 1;
                mb.vy = Math.abs(mb.vy);
            } else if (mb.y + mb.r > this.height) {
                mb.y = this.height - mb.r;
                mb.vy = -Math.abs(mb.vy);
            }
        }

        let data = new Float32Array(3 * this.numMetaballs);
        for (let i = 0; i < this.numMetaballs; ++i) {
            const baseIndex = 3 * i;
            const mb = this.metaballs[i];
            data[baseIndex + 0] = mb.x;
            data[baseIndex + 1] = mb.y;
            data[baseIndex + 2] = mb.r;
        }
        
        gl.uniform3fv(gl.getUniformLocation(this.program, 'metaballs'), data);
        gl.uniform1f(gl.getUniformLocation(this.program, 'width'), this.width)
        gl.uniform1f(gl.getUniformLocation(this.program, 'height'), this.height)

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }   
}