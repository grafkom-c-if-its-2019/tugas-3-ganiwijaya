(function() 
{
  glUtils.SL.init({ callback: function() { main(); } });
  function main() 
  {
    var canvas = document.getElementById("glcanvas");
    var gl = glUtils.checkWebGL(canvas);
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
    var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    var program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    var garis = new Float32Array([
      -0,1,-0.4,
      -0.1,0.4,
      0,3,-0.4,
      0.3,0.4,
      0,5,-0.7,
      0.5,0.7,
    ]);

    var panjang = new Float32Array([
      0.5, 0.06,
      0.95, 0.06,
      0.95, -0.08,
      0.5, -0.08,
    ]);

    var bulet = new Float32Array(1244);
    for (var i=90; i<=400; i+=1) 
    {
      // degrees to radians
      var j = i * Math.PI / 180;
      // X Y Z
        bulet[(i - 90) * 4] = Math.sin(j)*0.4 + 0.5;
        bulet[(i - 90) * 4 + 1] = Math.cos(j)*0.4;
        // 0,
      //var vert2 = [
      //  0,
      //  0,
      //  0,
      // ];
      DONUT:
        bulet[(i - 90) * 4 + 2] = Math.sin(j)*0.24 + 0.5;
        bulet[(i - 90) * 4 + 3] = Math.cos(j)*0.24;
    }

    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, panjang, gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, garis, gl.STATIC_DRAW);

    // Link untuk attribute
    var vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(
      vPosition,	// variabel yang memegang posisi attribute di shader
      2,			// jumlah elemen per atribut
      gl.FLOAT,		// tipe data atribut
      gl.FALSE,
      0,			// ukuran byte tiap vertex
      0				// offset dari posisi elemen di array
    );

    gl.enableVertexAttribArray(vPosition);
    var translation = gl.getUniformLocation(program, 'translation');
    var translationVector = [0.0, 0.0, 0.0];
    gl.uniform3fv(translation, translationVector);
    var thetaLocation = gl.getUniformLocation(program, 'theta');
    var theta = 0.0;
    var scaleXLocation = gl.getUniformLocation(program, 'scaleX');
    var scaleYLocation = gl.getUniformLocation(program, 'scaleY');
    var scaleX = 1.0;
    var scaleY = 1.0;
    var stretch = 1;
    var theta_temp;
    var scaleX_temp;
    var scaleY_temp;

    function render() 
    {
      // Bersihkan layar jadi hitam
      gl.clearColor(0.56, 0.67, 0.86, 1.0);
      // Bersihkan buffernya canvas
      gl.clear(gl.COLOR_BUFFER_BIT);

      scaleX_temp = scaleX;
      theta_temp = theta;

      theta += 0.0101;
	 
      if (scaleX >= 1) stretch = -1;
      else if (scaleX <= -1) stretch = 1;
      scaleX += 0.0101 * stretch;
      drawA(gl.TRIANGLE_STRIP, bulet, 2);
      drawA(gl.TRIANGLE_FAN, panjang, 2);
      drawA(gl.LINE_STRIP, garis);
      requestAnimationFrame(render);
    }
    render();

    function drawA(type, vertices, cek) 
    {
      var n = vertices.length / 2;
      if (cek == 2) 
      {
        gl.uniform1f(thetaLocation, 0.0);
        gl.uniform1f(scaleXLocation, scaleX_temp);
        gl.uniform1f(scaleYLocation, scaleY);
      }
      else
      {
        gl.uniform1f(thetaLocation, 0);
        gl.uniform1f(scaleXLocation, 1.0);
        gl.uniform1f(scaleYLocation, scaleY);
      }

      var vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) 
      {
        console.log('Failed to create the buffer object');
        return -1;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      var aPosition = gl.getAttribLocation(program, 'aPosition');
      if (aPosition < 0) 
      {
        console.log('Failed to get the storage location of aPosition');
        return -1;
      }

      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPosition);
      if (n < 0) 
      {
        console.log('Failed to set the positions of the vertices');
        return;
      }
      gl.drawArrays(type, 0, n);
    }
  }
})();
