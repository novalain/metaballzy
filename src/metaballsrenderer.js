export default class MetaballsRenderer {
    constructor(context) {
        this.context = context
        const gl = this.context;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(1.0, 0.0, 0.0, 1.0);
    }

    render() {
        const gl = this.context;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}