const vertexShaderText = ` 
    precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;
    void main(){
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }`

const fragmentShaderText = `
    precision mediump float;
    varying vec3 fragColor;
    void main(){
        gl_FragColor = vec4(fragColor, 1.0);
    }`

const paintITriangles = function (triangle, gl, positionAttribute, colorAttribute, program) {
    //Create buffer triangle
    const triangleVertexBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle), gl.STATIC_DRAW)

    gl.vertexAttribPointer(
        positionAttribute, //Attribute location
        2, //Number of elements per attribute
        gl.FLOAT, //Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex
        0 //Offset from the begining of a single vertex to this attribute
    )

    gl.vertexAttribPointer(
        colorAttribute, //Attribute color
        3, //Number of elements per attribute
        gl.FLOAT, //Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT //Offset from the begining of a single vertex to this attribute
    )

    gl.enableVertexAttribArray(positionAttribute)
    gl.enableVertexAttribArray(colorAttribute)

    //Main render loop
    gl.useProgram(program)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
}

const compileShaders = function (gl, vertexShader, vertexShaderText, fragmentShader, fragmentShaderText) {
    gl.shaderSource(vertexShader, vertexShaderText)
    gl.shaderSource(fragmentShader, fragmentShaderText)

    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader', gl.getShaderInfoLog(vertexShader))
        return;
    }

    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader', gl.getShaderInfoLog(fragmentShader))
        return;
    }
}

const unitProgram = function (gl, program, vertexShader, fragmentShader) {
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program', gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Error validating program', gl.getProgramInfoLog(program));
        return;
    }
}

const paintTriangles = function (triangles, gl, positionAttribute, colorAttribute, program) {
    triangles.forEach(triangle => {
        paintITriangles(triangle, gl, positionAttribute, colorAttribute, program);
    });
}

const main = function () {
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl");
    if (!gl) {
        alert("No se puede inicializar WebGL. Tu navegador puede ser que no lo soporte.");
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    compileShaders(gl, vertexShader, vertexShaderText, fragmentShader, fragmentShaderText);

    const program = gl.createProgram();
    unitProgram(gl, program, vertexShader, fragmentShader);

    const positionAttribute = gl.getAttribLocation(program, 'vertPosition');
    const colorAttribute = gl.getAttribLocation(program, 'vertColor');

    //Creación de Vertices
    let vertices = []

    let luna =
        [ //X, Y        RGB
            0.68, 0.95, 1.0, 1.0, 1.0,
            0.93, 0.95, 1.0, 1.0, 1.0,
            0.93, 0.65, 1.0, 1.0, 1.0
        ]

    let luna2 =
        [
            0.68, 0.95, 1.0, 1.0, 1.0,
            0.68, 0.65, 1.0, 1.0, 1.0,
            0.93, 0.65, 1.0, 1.0, 1.0,
        ]

    let ground =
        [ //X, Y              
            -1.0, -0.25, 0.08, 255.04, 0.10,
            -1.0, -1.0, 0.08, 255.04, 0.10,
            1.0, -1.0, 0.08, 255.04, 0.10
        ]
    //255.08, 0.04, 0.10 Rojo
    //0.08, 0.04, 255.10 Azul
    //0.08, 255.04, 0.10 Verde

    let ground2 =
        [ //X, Y            
            1.0, -1.0, 0.08, 255.04, 0.10,
            1.0, -0.25, 0.08, 255.04, 0.10,
            -1.0, -0.25, 0.08, 255.04, 0.10
        ]

    let houseRed =
        [
            0.1, 0.1, 255.08, 0.04, 0.10,
            0.5, -0.5, 255.08, 0.04, 0.10,
            0.1, -0.5, 255.08, 0.04, 0.10
        ]

    let houseRedTwo =
        [
            0.1, 0.1, 255.08, 0.04, 0.10,
            0.5, 0.1, 255.08, 0.04, 0.10,
            0.5, -0.5, 255.08, 0.04, 0.10
        ]

    let houseRedTop =
        [
            0.5, 0.1, 255.08, 0.04, 0.10,
            0.1, 0.1, 255.08, 0.04, 0.10,
            0.3, 0.4, 255.08, 0.04, 0.10
        ]

    let houseBlue =
        [
            -0.2, 0.1, 0.08, 0.04, 255.10,
            -0.5, 0.1, 0.08, 0.04, 255.10,
            -0.2, -0.25, 0.08, 0.04, 255.10
        ]

    let houseBlueTwo =
        [
            -0.5, 0.1, 0.08, 0.04, 255.10,
            -0.5, -0.25, 0.08, 0.04, 255.10,
            -0.2, -0.25, 0.08, 0.04, 255.10
        ]

    let houseBlueTop =
        [
            -0.5, 0.1, 0.08, 0.04, 255.10,
            -0.2, 0.1, 0.08, 0.04, 255.10,
            -0.34, 0.3, 0.08, 0.04, 255.10
        ]

    let starOne =
        [
            -0.8, 0.85, 1.0, 1.0, 1.0,
            -0.75, 0.8, 1.0, 1.0, 1.0,
            -0.85, 0.8, 1.0, 1.0, 1.0
        ]

    let starOne2 =
        [
            -0.85, 0.8, 1.0, 1.0, 1.0,
            -0.8, 0.75, 1.0, 1.0, 1.0,
            -0.75, 0.8, 1.0, 1.0, 1.0
        ]

    let starTwo =
        [
            -0.6, 0.94, 1.0, 1.0, 1.0,
            -0.62, 0.9, 1.0, 1.0, 1.0,
            -0.58, 0.9, 1.0, 1.0, 1.0
        ]

    let starTwo2 =
        [
            -0.62, 0.9, 1.0, 1.0, 1.0,
            -0.58, 0.9, 1.0, 1.0, 1.0,
            -0.6, 0.86, 1.0, 1.0, 1.0
        ]

    let starTree =
        [
            0.1, 0.84, 1.0, 1.0, 1.0,
            0.08, 0.8, 1.0, 1.0, 1.0,
            0.12, 0.8, 1.0, 1.0, 1.0
        ]

    let starTree2 =
        [
            0.08, 0.8, 1.0, 1.0, 1.0,
            0.12, 0.8, 1.0, 1.0, 1.0,
            0.1, 0.76, 1.0, 1.0, 1.0
        ]

    let starFour =
        [
            0.55, 0.95, 1.0, 1.0, 1.0,
            0.5, 0.9, 1.0, 1.0, 1.0,
            0.6, 0.9, 1.0, 1.0, 1.0
        ]

    let starFour2 =
        [
            0.5, 0.9, 1.0, 1.0, 1.0,
            0.6, 0.9, 1.0, 1.0, 1.0,
            0.55, 0.85, 1.0, 1.0, 1.0
        ]

    vertices =
        [
            luna,
            luna2,
            ground,
            ground2,
            houseRed,
            houseRedTwo,
            houseRedTop,
            houseBlue,
            houseBlueTwo,
            houseBlueTop,
            starOne,
            starOne2,
            starTwo,
            starTwo2,
            starTree,
            starTree2,
            starFour,
            starFour2
        ]

    paintTriangles(vertices, gl, positionAttribute, colorAttribute, program);
}

window.onload = main;