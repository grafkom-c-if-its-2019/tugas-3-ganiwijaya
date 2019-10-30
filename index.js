(function(global) {

  var canvas, gl, program;

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    // Register Callbacks
    window.addEventListener('resize', resizer);

    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    // Initialize the shaders and program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);

    program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    resizer();
  }

  // draw!
  function draw() {
    // renderer info
    gl.clearColor(0, 0.2, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Write the positions of vertices to a vertex shader
    // drawPoint();
    // drawLine();
    // drawTriangle();

    // var pointsVertices = new Float32Array([
    //   -0.5, -0.5
    // ]);
    // var linesVertices = new Float32Array([
    //   -0.25, -0.25,  -0.5, +0.5
    // ]);
    // var triangleVertices = new Float32Array([
    //   +0.5, -0.5,  0.0, 0.25,  +0.5, 0.0
    // ]);

    var panjang = new Float32Array([
      0.5, 0.06,
      0.95, 0.06,
      0.95, -0.08,
      0.5, -0.08,
    ]);

    var vertices = new Float32Array(1244);

    for (var i=90; i<=400; i+=1) {
      // degrees to radians
      var j = i * Math.PI / 180;
      // X Y Z
        vertices[(i - 90) * 4] = Math.sin(j)*0.4 + 0.5;
        vertices[(i - 90) * 4 + 1] = Math.cos(j)*0.4;
        // 0,
      //var vert2 = [
      //  0,
      //  0,
      //  0,
      // ];
      DONUT:
        vertices[(i - 90) * 4 + 2] = Math.sin(j)*0.24 + 0.5;
        vertices[(i - 90) * 4 + 3] = Math.cos(j)*0.24;
    }

    var lengkung = new Float32Array(1224);

    for (var i=97; i<=400; i+=1) {
      // degrees to radians
      var j = i * Math.PI / 180;
      // X Y Z
        lengkung[(i - 97) * 2] = Math.sin(j)*0.4 - 0.5;
        lengkung[(i - 97) * 2 + 1] = Math.cos(j)*0.4;
    }

    for (var i=400; i>=97; i-=1) {
      // degrees to radians
      var j = i * Math.PI / 180;
      // X Y Z
        lengkung[(704 - i) * 2] = Math.sin(j)*0.24 - 0.5;
        lengkung[(704 - i) * 2 + 1] = Math.cos(j)*0.24;
    }

    lengkung[1216] = -0.5; lengkung[1217] = -0.08;
    lengkung[1218] = -0.5; lengkung[1219] = 0.06;
    lengkung[1220] = -0.05; lengkung[1221] = 0.06;
    lengkung[1222] = -0.05; lengkung[1223] = -0.08;

    drawA(gl.LINE_LOOP, lengkung);
    drawA(gl.TRIANGLE_STRIP, vertices);
    drawA(gl.TRIANGLE_FAN, panjang);

    // drawA(gl.POINTS, pointsVertices);
    // drawA(gl.LINES, linesVertices);
    // drawA(gl.TRIANGLES, triangleVertices);
  }

  function drawPoint() {
    var n = initPointBuffers();
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }
    gl.drawArrays(gl.POINTS, 0, n);
  }

  function initPointBuffers() {
    var vertices = new Float32Array([
      -0.5, -0.5
    ]);
    var n = 1;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  function drawLine() {
    var n = initLineBuffers();
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }
    gl.drawArrays(gl.LINES, 0, n);
  }

  function initLineBuffers() {
    var vertices = new Float32Array([
      -0.25, -0.25,  -0.25, +0.5
    ]);
    var n = 2;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  function drawTriangle() {
    var n = initTriangleBuffers();
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  function initTriangleBuffers() {
    var vertices = new Float32Array([
      +0.5, -0.5,  0.0, 0.0,  +0.5, 0.0
    ]);
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  // Generic format
  function drawA(type, vertices) {
    var n = initBuffers(vertices);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }
    gl.drawArrays(type, 0, n);
  }

  function initBuffers(vertices) {
    var n = vertices.length / 2;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  function resizer() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    draw();
  }

})(window || this);
