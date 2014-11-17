function initVertexBuffers(gl) {
  // pink cube
  qbVerts = makeCube([-.5, -.5, 0], 1, 1, 3, [1.0, .1, .1], [.6, .6, .6], [.6, .6, .6], [0.5, 0.5, 0.5]);
  // pink sphere
  sverts = makeSphere([0,0,0], 1, [1.0, .1, .1], [.6, .6, .6], [.6, .6, .6], [0.5, 0.5, 0.5]);
  // floor
  flrVerts = makeFloor(15);
  // (square)
  sqverts = makeSquare();
  // Shiny bronze sphere
  brsphverts = makeSphere([0, 0, 0], 1, [0.25, 0.15, 0.06], [0.4, 0.23, 0.10], [0.77, 0.45, 0.2], [0, 0, 0]);
  // Shiny bronze tree trunk
  brboxverts = makeCube([-.5, -.5, 0], 1, 1, 8, [0.25, 0.148, 0.06475], [0.4, 0.2368, 0.1036], [0.774597, 0.458561, 0.200621], [0, 0, 0]);
  // Grn plastic tree sphere
  grnsphereverts = makeSphere([0, 0, 0], 3, [0.05, 0.05, 0.05], [0.0, 0.6, 0.0], [0.2, 0.2, 0.2], [0, 0, 0]);
  // Chrome Box
  chrmboxverts = makeCube([-.5, -.5, 0], 1, 1, 2, [0.25, 0.25, 0.25], [0.4,0.4,0.4], [0.774597, 0.774597, 0.774597], [0, 0, 0]);
  // Grid lines
  lineverts = makeLines();

  var verticesColors = new Float32Array(LINELENGTH + 4*FLOATS_PER_VERTEX + 3*CUBELENGTH + 3*SPHERELENGTH + FLOORLENGTH);

  var ii = 0;

  for (jj = 0; jj < CUBELENGTH; jj++, ii++) {
    verticesColors[ii] = qbVerts[jj];
  }
  for (jj = 0; jj < SPHERELENGTH; jj++, ii++) {
    verticesColors[ii] = sverts[jj];
  }
  for (jj = 0; jj < FLOORLENGTH; jj++, ii++) {
    verticesColors[ii] = flrVerts[jj];
  }
  for (jj = 0; jj < (4 * FLOATS_PER_VERTEX); jj++, ii++) {
    verticesColors[ii] = sqverts[jj];
  }
  BRONZE_SPHERE_START = ii/FLOATS_PER_VERTEX;
  for (jj = 0; jj < SPHERELENGTH; jj++, ii++) {
    verticesColors[ii] = brsphverts[jj];
  }
  BRONZE_BOX_START = ii/FLOATS_PER_VERTEX;
  for (jj = 0; jj < CUBELENGTH; jj++, ii++) {
    verticesColors[ii] = brboxverts[jj];
  }
  GRN_SPHERE_START = ii/FLOATS_PER_VERTEX;
  for (jj = 0; jj < SPHERELENGTH; jj++, ii++) {
    verticesColors[ii] = grnsphereverts[jj];
  }
  CHRM_BOX_START = ii/FLOATS_PER_VERTEX;
  for (jj = 0; jj < CUBELENGTH; jj++, ii++) {
    verticesColors[ii] = chrmboxverts[jj];
  }
  LINESTART = ii/FLOATS_PER_VERTEX;
  for (jj = 0; jj < LINELENGTH; jj++, ii++) {
    verticesColors[ii] = lineverts[jj];
  }

  function makeCube(origin, x, y, z, Ka, Kd, Ks, Ke) {
    var cubeVerts = new Float32Array(24*FLOATS_PER_VERTEX);
    var i = 0;

    // First square
    for (var j = 0; j < 4; j++) {
      if ((j == 0) || (j == 2))
        var ymove = 0;
      else
        var ymove = y;

      if (j > 1)
        var xmove = x;
      else
        var xmove = 0;

      cubeVerts[i] = origin[0] + xmove; // location
      i++;
      cubeVerts[i] = origin[1] + ymove;
      i++;
      cubeVerts[i] = origin[2];
      i++;
      cubeVerts[i] = 0.0;  // normal
      i++;
      cubeVerts[i] = 0.0;
      i++;
      cubeVerts[i] = -1.0;
      i++;
      fillKs(); // Phong constants 
    }

    // Second square
    for (var j = 0; j < 4; j++) {
      if ((j == 0) || (j == 2))
        var ymove = 0;
      else
        var ymove = y;

      if (j > 1)
        var zmove = z;
      else
        var zmove = 0;

      cubeVerts[i] = origin[0] + x; // location
      i++;
      cubeVerts[i] = origin[1] + ymove;
      i++;
      cubeVerts[i] = origin[2] + zmove;
      i++;
      cubeVerts[i] = 1.0;  // normal
      i++;
      cubeVerts[i] = 0.0;
      i++;
      cubeVerts[i] = 0.0;
      i++;
      fillKs(); // Phong constants 
    }

    // Third square
    for (var j = 0; j < 4; j++) {
      if ((j == 0) || (j == 2))
        var ymove = 0;
      else
        var ymove = y;

      if (j > 1)
        var xmove = x;
      else
        var xmove = 0;

      cubeVerts[i] = origin[0] + xmove; // location
      i++;
      cubeVerts[i] = origin[1] + ymove;
      i++;
      cubeVerts[i] = origin[2] + z;
      i++;
      cubeVerts[i] = 0.0;  // normal
      i++;
      cubeVerts[i] = 0.0;
      i++;
      cubeVerts[i] = 1.0;
      i++;
      fillKs(); // Phong constants 
    }

    // Fourth square
    for (var j = 0; j < 4; j++) {
      if ((j == 0) || (j == 2))
        var ymove = 0;
      else
        var ymove = y;

      if (j > 1)
        var zmove = z;
      else
        var zmove = 0;

      cubeVerts[i] = origin[0]; // location
      i++;
      cubeVerts[i] = origin[1] + ymove;
      i++;
      cubeVerts[i] = origin[2] + zmove;
      i++;
      cubeVerts[i] = -1.0;  // normal
      i++;
      cubeVerts[i] = 0.0;
      i++;
      cubeVerts[i] = 0.0;
      i++;
      fillKs(); // Phong constants
    }

    // Fifth square
    for (var j = 0; j < 4; j++) {
      if ((j == 0) || (j == 2))
        var xmove = 0;
      else
        var xmove = x;

      if (j > 1)
        var zmove = z;
      else
        var zmove = 0;

      cubeVerts[i] = origin[0] + xmove; // location
      i++;
      cubeVerts[i] = origin[1];
      i++;
      cubeVerts[i] = origin[2] + zmove;
      i++;
      cubeVerts[i] = 0.0;  // normal
      i++;
      cubeVerts[i] = -1.0;
      i++;
      cubeVerts[i] = 0.0;
      i++;
      fillKs(); // Phong constants
    }

    // Sixth square
    for (var j = 0; j < 4; j++) {
      if ((j == 0) || (j == 2))
        var xmove = 0;
      else
        var xmove = x;

      if (j > 1)
        var zmove = z;
      else
        var zmove = 0;

      cubeVerts[i] = origin[0] + xmove; // location
      i++;
      cubeVerts[i] = origin[1] + y;
      i++;
      cubeVerts[i] = origin[2] + zmove;
      i++;
      cubeVerts[i] = 0.0;  // normal
      i++;
      cubeVerts[i] = 1.0;
      i++;
      cubeVerts[i] = 0.0;
      i++;
      fillKs(); // Phong constants
    }

    function fillKs() {
      cubeVerts[i] = Ka[0];
      i++;
      cubeVerts[i] = Ka[1];
      i++;
      cubeVerts[i] = Ka[2];
      i++;

      cubeVerts[i] = Kd[0];
      i++;
      cubeVerts[i] = Kd[1];
      i++;
      cubeVerts[i] = Kd[2];
      i++;

      cubeVerts[i] = Ks[0];
      i++;
      cubeVerts[i] = Ks[1];
      i++;
      cubeVerts[i] = Ks[2];
      i++;

      cubeVerts[i] = Ke[0];
      i++;
      cubeVerts[i] = Ke[1];
      i++;
      cubeVerts[i] = Ke[2];
      i++;
    }

    CUBELENGTH = i;
    return cubeVerts;
  }

  function makeSphere(center, r, Ka, Kd, Ks, Ke) {
    var slices = 50;
    var sliceAngle = Math.PI/slices;
    sphverts = new Float32Array(slices*slices*12*2);


    var up, x, y, z;
    var i = 0;

    for (ii = 0; ii < slices; ii++) {  // loop for each layer
      for (jj = 0; jj < slices; jj++) {  // loop for each vertex in layer
        for (kk = 0; kk < 2; kk++) {
            x = center[0] + r*Math.sin(2*jj*sliceAngle)*Math.sin(2*(ii + kk)*sliceAngle);
            y = center[1] + r*Math.cos(2*jj*sliceAngle)*Math.sin(2*(ii + kk)*sliceAngle);
            z = center[2] + r*Math.cos(2*(ii + kk)*sliceAngle);

            sphverts[i] = x;  // Position
            i++;
            sphverts[i] = y;
            i++;
            sphverts[i] = z;
            i++;

            sphverts[i] = x - center[0];  // Normal (same as normalized 
            i++;                          // relative position, gets normalized in shader)
            sphverts[i] = y - center[1];
            i++;
            sphverts[i] = z - center[2];
            i++;
            fillKs();
        }
      }
    }

    function fillKs() {
      sphverts[i] = Ka[0];
      i++;
      sphverts[i] = Ka[1];
      i++;
      sphverts[i] = Ka[2];
      i++;

      sphverts[i] = Kd[0];
      i++;
      sphverts[i] = Kd[1];
      i++;
      sphverts[i] = Kd[2];
      i++;

      sphverts[i] = Ks[0];
      i++;
      sphverts[i] = Ks[1];
      i++;
      sphverts[i] = Ks[2];
      i++;

      sphverts[i] = Ke[0];
      i++;
      sphverts[i] = Ke[1];
      i++;
      sphverts[i] = Ke[2];
      i++;
    }

    SPHERELENGTH = i;
    return sphverts;
  }  

  function makeSquare() {
    squareverts = new Float32Array([
      0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
      0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  
      1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
      1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
    ]);

    return squareverts;
  }

  function makeFloor(rad) {
    var slices = 40;
    var sliceAngle = 2*Math.PI/slices;
    var num_circles = 10;
    fVerts = new Float32Array(2*slices*num_circles*FLOATS_PER_VERTEX);
    var i = 0;
    var total_rad = 0;

    widths = new Float32Array([
      rad/10, rad/20, rad/10, 3*rad/20, rad/5, rad/10, rad/20, rad/20, 3*rad/20, rad/20
    ]);

    colors = ['y', 'pi', 'b', 'p', 'y', 'b', 'pi', 'y', 'p', 'b'];

    for (ii = 0; ii < num_circles; ii++) { // num circles
      var total_angle = 0;

      for (jj = 0; jj < slices; jj++) {           // slices around circle
        for (kk = 0; kk < 2; kk++) {
          if (kk == 0)
            r = total_rad;
          else
            r = total_rad - widths[ii];

          var x = r*Math.sin(total_angle);
          var y = r*Math.cos(total_angle);

          fVerts[i] = x // x coord
          i++;
          fVerts[i] = y // y coord
          i++;
          z = .25*Math.cos(5*r*Math.sin(total_angle) + 9*r*Math.cos(total_angle));
          fVerts[i] = z; // z coord
          i++;

          assignNorm(x, y, z); // Normal

          if (colors[ii] == 'y') // Assign all Ks
            yellow();
          else if (colors[ii] == 'pi')
            pink();
          else if (colors[ii] == 'b')
            blue();
          else if (colors[ii] == 'p')
            purple();
        }
        total_angle = total_angle + sliceAngle;
      }
      total_rad = total_rad - widths[ii];  
    }

    function assignNorm(x, y, z) {
      fVerts[i] = 0;
      i++;
      fVerts[i] = 0;
      i++;
      fVerts[i] = 1;
      i++;
    }

    function yellow() {
      Ka = [1, 1, .6];
      Kd = [.5, .5, .3];
      Ks = [.5, .5, .3];
      Ke = [0, 0, 0];
      fillKs(Ka, Kd, Ks, Ke);      
    }

    function pink() {
      Ka = [.4, .4, 1.0];
      Kd = [1, .2, .6];
      Ks = [.6, .6, .6];
      Ke = [0, 0, 0];
      fillKs(Ka, Kd, Ks, Ke);
    }

    function blue() {
      Ka = [.4, .4, 1.0];
      Kd = [.1, .1, .1];
      Ks = [.6, .6, .6];
      Ke = [0, 0, 0];
      fillKs(Ka, Kd, Ks, Ke);
    }

    function purple() {
      Ka = [.9, .5, 1.0];
      Kd = [.9, .5, 1.0];
      Ks = [.6, .6, .6];
      Ke = [0, 0, 0];
      fillKs(Ka, Kd, Ks, Ke);
    }

    function fillKs(Ka, Kd, Ks, Ke) {
      fVerts[i] = Ka[0];
      i++;
      fVerts[i] = Ka[1];
      i++;
      fVerts[i] = Ka[2];
      i++;

      fVerts[i] = Kd[0];
      i++;
      fVerts[i] = Kd[1];
      i++;
      fVerts[i] = Kd[2];
      i++;

      fVerts[i] = Ks[0];
      i++;
      fVerts[i] = Ks[1];
      i++;
      fVerts[i] = Ks[2];
      i++;

      fVerts[i] = Ke[0];
      i++;
      fVerts[i] = Ke[1];
      i++;
      fVerts[i] = Ke[2];
      i++;
    }

    FLOORLENGTH = i;
    return fVerts;
  }

  function makeLines() {
    lineverts = new Float32Array(41 * 2 * FLOATS_PER_VERTEX);
    var i = 0
    var z = .25;
    for (q = -20; q < 21; q++) {
      for (v = -1; v < 2; v+=2) {
        lineverts[i] = q; // x
        i++;
        lineverts[i] = v*20; // y
        i++;
        lineverts[i] = z; // z
        i++;
        lineverts[i] = 0; // normal
        i++;
        lineverts[i] = 0;
        i++;
        lineverts[i] = 1;
        i++;
        for (b = 0; b < 12; b++, i++) { // fill in k's
          lineverts[i] = 0; // black
        }
      }
    }
    LINELENGTH = i;
    console.log(i, lineverts.length);
    return lineverts;
  }

  // Create a buffer object
  var vertexColorbuffer = gl.createBuffer();  
  if (!vertexColorbuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write the vertex information and enable it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;

  // Assign the buffer object to a_PositionIn and enable the assignment
  var a_Position = gl.getAttribLocation(gl.program, 'a_PositionIn');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_PositionIn');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * FLOATS_PER_VERTEX, 0);
  gl.enableVertexAttribArray(a_Position);

  // Assign the buffer object to a_Normal and enable the assignment
  var a_Normal = gl.getAttribLocation(gl.program, 'a_NormalIn');
  if(a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return -1;
  }
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * FLOATS_PER_VERTEX, FSIZE * 3);
  gl.enableVertexAttribArray(a_Normal);

  // Assign the buffer object to a_Ke and enable the assignment
  var a_Ke = gl.getAttribLocation(gl.program, 'a_Ke');
  if(a_Ke < 0) {
    console.log('Failed to get the storage location of a_Ke');
    return -1;
  }
  gl.vertexAttribPointer(a_Ke, 3, gl.FLOAT, false, FSIZE * FLOATS_PER_VERTEX, FSIZE * 15);
  gl.enableVertexAttribArray(a_Ke);

  // Assign the buffer object to a_Ka and enable the assignment
  var a_Ka = gl.getAttribLocation(gl.program, 'a_Ka');
  if(a_Ka < 0) {
    console.log('Failed to get the storage location of a_Ka');
    return -1;
  }
  gl.vertexAttribPointer(a_Ka, 3, gl.FLOAT, false, FSIZE * FLOATS_PER_VERTEX, FSIZE * 6);
  gl.enableVertexAttribArray(a_Ka);

  // Assign the buffer object to a_Kd and enable the assignment
  var a_Kd = gl.getAttribLocation(gl.program, 'a_Kd');
  if(a_Kd < 0) {
    console.log('Failed to get the storage location of a_Kd');
    return -1;
  }
  gl.vertexAttribPointer(a_Kd, 3, gl.FLOAT, false, FSIZE * FLOATS_PER_VERTEX, FSIZE * 9);
  gl.enableVertexAttribArray(a_Kd);

  // Assign the buffer object to a_Ks and enable the assignment
  var a_Ks = gl.getAttribLocation(gl.program, 'a_Ks');
  if(a_Ks < 0) {
    console.log('Failed to get the storage location of a_Ks');
    return -1;
  }
  gl.vertexAttribPointer(a_Ks, 3, gl.FLOAT, false, FSIZE * FLOATS_PER_VERTEX, FSIZE * 12);
  gl.enableVertexAttribArray(a_Ks);


}