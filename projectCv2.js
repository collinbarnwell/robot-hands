var VSHADER_SOURCE =
  'attribute vec3 a_PositionIn;\n' +
  'attribute vec3 a_NormalIn;\n' +
  'attribute vec3 a_Ka;\n' +
  'attribute vec3 a_Kd;\n' +
  'attribute vec3 a_Ks;\n' +
  'attribute vec3 a_Ke;\n' +

  'varying vec3 v_Ka;\n' +
  'varying vec3 v_Kd;\n' +
  'varying vec3 v_Ks;\n' +
  'varying vec3 v_Ke;\n' +
  'varying vec4 v_Normal;\n' +
  'varying vec4 v_Position;\n' +

  // 'varying vec4 v_eyeCoords;\n' +

  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +

  'void main() {\n' +
  '  vec4 a_Position = vec4(a_PositionIn, 1.0);\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
  '  v_Normal = normalize(u_NormalMatrix * vec4(a_NormalIn, 0));\n' + // ln 20
  '  v_Ka = a_Ka;\n' +
  '  v_Ke = a_Ke;\n' +
  '  v_Kd = a_Kd;\n' +
  '  v_Ks = a_Ks;\n' +

  // '  v_eyeCoords = u_ViewMatrix * u_ModelMatrix * vec4(0.0, 0.0, 0.0, 4.0);\n' +
  '}\n';

var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  // Light Source 0 (eye coords):
  'uniform vec3 u_L0Amb;\n' +
  'uniform vec3 u_L0Diff;\n' +
  'uniform vec3 u_L0Spec;\n' +
  // Light Source 1:
  'uniform vec4 u_L1Pos;\n' + // Should be at eye coord origin
  'uniform vec3 u_L1Amb;\n' +
  'uniform vec3 u_L1Diff;\n' +
  'uniform vec3 u_L1Spec;\n' +

  'uniform vec3 u_eyecoords;\n' +

  'varying vec4 v_Normal;\n' +
  'varying vec4 v_Position;\n' +

  'varying vec3 v_Ke;\n' + // emissive
  'varying vec3 v_Ka;\n' + // ambient
  'varying vec3 v_Kd;\n' + // diffuse
  'varying vec3 v_Ks;\n' + // specular

  // 'varying vec4 v_eyeCoords;\n' +d

  'void main() {\n' +
  '  vec3 lightDirection0 = vec3(normalize(u_eyecoords - vec3(v_Position)));\n' +
  '  float nDotL0 = max(dot(lightDirection0, vec3(v_Normal)), 0.0);\n' +

  '  vec3 lightDirection1 = vec3(normalize(u_L1Pos - v_Position));\n' +
  '  float nDotL1 = max(dot(lightDirection1, vec3(v_Normal)), 0.0);\n' +

  '  vec3 emissive = v_Ke;\n' +
  '  vec3 ambient = (u_L0Amb + u_L1Amb) * v_Ka;\n' +
  '  vec3 diffuse = v_Kd * ((u_L0Diff * nDotL0) + (u_L1Diff * nDotL1));\n' +

  '  float nDoth0 = dot(vec3(v_Normal), lightDirection0 );\n' +
  '  float nDoth1 = dot(vec3(v_Normal), normalize( u_eyecoords - lightDirection1 ));\n' +
  '  vec3 specular = v_Ks * ( (u_L0Spec * pow(nDoth0, 50.0)) + (u_L1Spec * pow(nDoth1, 50.0)) );\n' +

  '  gl_FragColor = vec4(emissive + ambient + diffuse + specular, 1.0);\n' +
  '}\n';

var FLOATS_PER_VERTEX = 18;
var FLOORLENGTH;
var CUBELENGTH;
var SPHERELENGTH;
var BRONZE_BOX_START;
var BRONZE_SPHERE_START;
var GRN_SPHERE_START;
var CHRM_BOX_START;
var LINELENGTH;
var LINESTART;

var RIGHT_SHIFT = 0;
var FORWARD_SHIFT = 0;
var HEIGHT = 3;
var ROTATION = 0;
var VERT_ROTATION = 0;

var DISPLAY_LINES = true;

var LIGHTX = 0;
var LIGHTY = 0;

var EYEX = 0;
var EYEY = 0;
var EYEZ = 0;
var LOOKX = 0;
var LOOKY = 0;
var LOOKZ = 0;
var UPX = 0;
var UPY = 0;
var UPZ = 0;

var KEYS_PRESSED = new Object();
KEYS_PRESSED['left'] = false;
KEYS_PRESSED['right'] = false;
KEYS_PRESSED['up'] = false;
KEYS_PRESSED['down'] = false;
KEYS_PRESSED['a'] = false;
KEYS_PRESSED['d'] = false;
KEYS_PRESSED['w'] = false;
KEYS_PRESSED['s'] = false;
KEYS_PRESSED['e'] = false;
KEYS_PRESSED['q'] = false;
KEYS_PRESSED['i'] = false;
KEYS_PRESSED['j'] = false;
KEYS_PRESSED['k'] = false;
KEYS_PRESSED['l'] = false;



function main() {
  var START_TIME = Date.now();

  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  gl.clearColor(1.0, .6, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_ModelMatrix || !u_ViewMatrix || !u_ProjMatrix || !u_NormalMatrix) { 
    console.log('Failed to Get the storage locations of u_NormalMatrix, u_ModelMatrix, u_ViewMatrix, and/or u_ProjMatrix');
    return;
  }

  // var u_L0Pos  = gl.getUniformLocation(gl.program,   'u_L0Pos');
  var u_L0Amb  = gl.getUniformLocation(gl.program,   'u_L0Amb');
  var u_L0Diff = gl.getUniformLocation(gl.program,   'u_L0Diff');
  var u_L0Spec = gl.getUniformLocation(gl.program,   'u_L0Spec');
  if(!u_L0Amb  || !u_L0Diff || !u_L0Spec  ) { // !u_L0Pos || 
    console.log('Failed to get the Lamp0 storage locations');
    return;
  }

  var u_L1Pos  = gl.getUniformLocation(gl.program,   'u_L1Pos');
  var u_L1Amb  = gl.getUniformLocation(gl.program,   'u_L1Amb');
  var u_L1Diff = gl.getUniformLocation(gl.program,   'u_L1Diff');
  var u_L1Spec = gl.getUniformLocation(gl.program,   'u_L1Spec');
  if( !u_L1Pos || !u_L1Amb || !u_L1Diff || !u_L1Spec  ) {
    console.log('Failed to get the Lamp1 storage locations');
    return;
  }

  var u_eyecoords = gl.getUniformLocation(gl.program,   'u_eyecoords');
  if (!u_eyecoords) {
    console.log('Failed to get the Eyecoords storage locations');
    return;
  }

  console.log("Box", BRONZE_BOX_START);

  console.log("Sphere: ", BRONZE_SPHERE_START);

  winResize();
  draw();
  camera();

  document.onkeydown = checkDown;
  document.onkeyup = checkUp;
  window.onresize = winResize;

  function camera() {
    if (KEYS_PRESSED['right'])
      RIGHT_SHIFT += .15;
    if (KEYS_PRESSED['left'])
      RIGHT_SHIFT -= .15;
    if (KEYS_PRESSED['up'])
      FORWARD_SHIFT -= .15;
    if (KEYS_PRESSED['down'])
      FORWARD_SHIFT += .15;
    if (KEYS_PRESSED['a'])
      ROTATION += .05;
    if (KEYS_PRESSED['d'])
      ROTATION -= .05;
    if (KEYS_PRESSED['w'])
      HEIGHT += .15
    if (KEYS_PRESSED['s'])
      HEIGHT -= .15;
    if (KEYS_PRESSED['q'])
      VERT_ROTATION += .05;
    if (KEYS_PRESSED['e'])
      VERT_ROTATION -= .05;
    if (KEYS_PRESSED['i'])
      LIGHTY += .15
    if (KEYS_PRESSED['j'])
      LIGHTX -= .15;
    if (KEYS_PRESSED['k'])
      LIGHTY -= .5;
    if (KEYS_PRESSED['l'])
      LIGHTX += .5;
    requestAnimationFrame(camera, canvas);
  }

  function checkDown(e) {
    if (e.keyCode == '39')
      KEYS_PRESSED['right'] = true;
    else if (e.keyCode == '37')
      KEYS_PRESSED['left'] = true;
    else if (e.keyCode == '38')
      KEYS_PRESSED['up'] = true;
    else if (e.keyCode == '40')
      KEYS_PRESSED['down'] = true;
    else if (e.keyCode == '65')
      KEYS_PRESSED['a'] = true;
    else if (e.keyCode == '68')
      KEYS_PRESSED['d'] = true;
    else if (e.keyCode == '87')
      KEYS_PRESSED['w'] = true;
    else if (e.keyCode == '83')
      KEYS_PRESSED['s'] = true;
    else if (e.keyCode == '81')
      KEYS_PRESSED['q'] = true;
    else if (e.keyCode == '69')
      KEYS_PRESSED['e'] = true;
    else if (e.keyCode == '73')
      KEYS_PRESSED['i'] = true;
    else if (e.keyCode == '74')
      KEYS_PRESSED['j'] = true;
    else if (e.keyCode == '75')
      KEYS_PRESSED['k'] = true;
    else if (e.keyCode == '76')
      KEYS_PRESSED['l'] = true;
    else if (e.keyCode == '79') // o
      DISPLAY_LINES = !DISPLAY_LINES;
    else if ((e.keyCode == '49') || (e.keyCode == '112') || (e.keyCode == '72')) { // help keys
      e.preventDefault();
      print_instructions();
    }
  }

  function checkUp(e) {
    if (e.keyCode == '39')
      KEYS_PRESSED['right'] = false;
    else if (e.keyCode == '37')
      KEYS_PRESSED['left'] = false;
    else if (e.keyCode == '38')
      KEYS_PRESSED['up'] = false;
    else if (e.keyCode == '40')
      KEYS_PRESSED['down'] = false;
    else if (e.keyCode == '65')
      KEYS_PRESSED['a'] = false;
    else if (e.keyCode == '68')
      KEYS_PRESSED['d'] = false;
    else if (e.keyCode == '87')
      KEYS_PRESSED['w'] = false;
    else if (e.keyCode == '83')
      KEYS_PRESSED['s'] = false;
    else if (e.keyCode == '81')
      KEYS_PRESSED['q'] = false;
    else if (e.keyCode == '69')
      KEYS_PRESSED['e'] = false;
    else if (e.keyCode == '73')
      KEYS_PRESSED['i'] = false;
    else if (e.keyCode == '74')
      KEYS_PRESSED['j'] = false;
    else if (e.keyCode == '75')
      KEYS_PRESSED['k'] = false;
    else if (e.keyCode == '76')
      KEYS_PRESSED['l'] = false;
  }

  function draw() {
    var elapsed = Date.now() - START_TIME;

    var modelMatrix = new Matrix4();
    var viewMatrix = new Matrix4();
    var projMatrix = new Matrix4();
    var normalMatrix = new Matrix4();

    var vpAspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    gl.clear(gl.COLOR_BUFFER_BIT);

    projMatrix.setPerspective(40, vpAspect, 1, 1000); // (vertical angle, width/height, near, far)

    var d = 40;
    var h = 15;

    LOOKX = LOOKX + Math.cos(ROTATION)*FORWARD_SHIFT - Math.sin(ROTATION)*RIGHT_SHIFT;
    LOOKY = LOOKY + HEIGHT;
    LOOKZ = LOOKZ + Math.sin(ROTATION)*FORWARD_SHIFT - Math.cos(ROTATION)*RIGHT_SHIFT;

    EYEX = LOOKX + d*Math.cos(ROTATION);
    EYEY = LOOKY + h*Math.cos(VERT_ROTATION);
    EYEZ = LOOKZ + d*Math.sin(ROTATION);

    UPX = 0; // Math.sin(VERT_ROTATION);
    UPY = 1; // Math.cos(VERT_ROTATION);
    UPZ = 0;

    FORWARD_SHIFT = 0;
    RIGHT_SHIFT = 0;
    HEIGHT = 0;

    viewMatrix.setLookAt(EYEX, EYEZ, EYEY, // eye
                         LOOKX, LOOKZ, LOOKY,  // lookat
                         UPX, UPZ, UPY); // up

    gl.uniform3f(u_eyecoords, EYEX, EYEZ, EYEY);

    // Light Source 0
    // gl.uniform4f(u_L0Pos, 0.0, 0.0, 0.0, 0.0);
    gl.uniform3f(u_L0Amb, .25, .5, .5);    // ambient
    gl.uniform3f(u_L0Diff, .7, .5, .5);   // diffuse
    gl.uniform3f(u_L0Spec, .5, .5, .5);   // Specular
    // gl.uniform3f(u_L0Amb, 0, 0, 0);    // ambient
    // gl.uniform3f(u_L0Diff, 0, 0, 0);   // diffuse
    // gl.uniform3f(u_L0Spec, 0, 0, 0);   // Specular

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    // Light source 1
    console.log('Light position: ', LIGHTX, LIGHTY);
    gl.uniform4f(u_L1Pos, LIGHTX, LIGHTY, 10, 1.0);
    gl.uniform3f(u_L1Amb, .2, .4, .7);    // ambient
    gl.uniform3f(u_L1Diff, .4, .5, .4);   // diffuse
    gl.uniform3f(u_L1Spec, .2, .2, .2);   // Specular
    // gl.uniform3f(u_L1Amb, 0, 0, 0);    // ambient
    // gl.uniform3f(u_L1Diff, 0, 0, 0);   // diffuse
    // gl.uniform3f(u_L1Spec, 0, 0, 0);   // Specular

    pushMatrix(modelMatrix); // !!!!!!!!!!!!!
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);  // Square

    // CENTRAL HAND /////////////////////////////////////////////////////////////////////////////
    // Sphere
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Floor, sphere
    gl.drawArrays(gl.TRIANGLE_STRIP, (CUBELENGTH + SPHERELENGTH)/FLOATS_PER_VERTEX, FLOORLENGTH/FLOATS_PER_VERTEX);
    gl.drawArrays(gl.TRIANGLE_STRIP, CUBELENGTH/FLOATS_PER_VERTEX, SPHERELENGTH/FLOATS_PER_VERTEX);  // Sphere

    // First arm
    var current_angle = Math.sin(elapsed / 1000)*45;
    modelMatrix.rotate(current_angle, 1, 0, 0);

    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, CUBELENGTH/FLOATS_PER_VERTEX);  // Box

    // Sphere joint
    modelMatrix.translate(0, 0, 3);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, CUBELENGTH/FLOATS_PER_VERTEX, SPHERELENGTH/FLOATS_PER_VERTEX);  // Sphere

    // 2nd Arm
    modelMatrix.rotate(-current_angle, 1, 0, 0);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, CUBELENGTH/FLOATS_PER_VERTEX);  // Box

    // Sphere joint
    modelMatrix.rotate(current_angle/3, 0, 1, 0);
    modelMatrix.translate(0, 0, 4);
    modelMatrix.rotate(-current_angle/3, 1, 0, 0);

    pushMatrix(modelMatrix); // !!!!!!
    modelMatrix.scale(.75, 1.5, 1.5);
    // modelMatrix.translate(0, 0, .5);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, CUBELENGTH/FLOATS_PER_VERTEX, SPHERELENGTH/FLOATS_PER_VERTEX);  // Sphere

    // Thumb
    modelMatrix = popMatrix(); // !!!!!!!

    modelMatrix.rotate(15 + current_angle/3, 0, 0, 1); // All fingers grab

    pushMatrix(modelMatrix);  // !!!!!!!
    modelMatrix.rotate(90, 1, 0, 0);
    pushMatrix(modelMatrix); // !!!!!!!!!
    modelMatrix.scale(.5, 1, .75);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, CUBELENGTH/FLOATS_PER_VERTEX);  // Box
    // Thumb ball
    modelMatrix = popMatrix(); // !!!!!
    modelMatrix.scale(.75, .75, .6);
    modelMatrix.translate(0, 0, 4);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, CUBELENGTH/FLOATS_PER_VERTEX, SPHERELENGTH/FLOATS_PER_VERTEX);  // Sphere    

    // 1st Finger
    modelMatrix = popMatrix();  // !!!!!!!
    pushMatrix(modelMatrix);  // !!!!!!
    modelMatrix.rotate(20, 1, 0, 0);

    modelMatrix.translate(0, 0, 1);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, CUBELENGTH/FLOATS_PER_VERTEX);  // Box

    modelMatrix.translate(0, 0, 3);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, CUBELENGTH/FLOATS_PER_VERTEX, SPHERELENGTH/FLOATS_PER_VERTEX);  // Sphere    

    // Second finger
    modelMatrix = popMatrix();  // !!!!!!!
    pushMatrix(modelMatrix);  // !!!!!!
    modelMatrix.rotate(-15 - current_angle/3, 0, 0, 1)
    modelMatrix.rotate(-20, 1, 0, 0);

    modelMatrix.translate(0, 0, 1);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, CUBELENGTH/FLOATS_PER_VERTEX);  // Box

    modelMatrix.translate(0, 0, 3);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, CUBELENGTH/FLOATS_PER_VERTEX, SPHERELENGTH/FLOATS_PER_VERTEX);  // Sphere    

    // Third finger
    modelMatrix = popMatrix();  // !!!!!!!
    // pushMatrix(modelMatrix);  // !!!!!!
    modelMatrix.rotate(-15 - current_angle/3, 0, 0, 1)
    modelMatrix.rotate(-60, 1, 0, 0);

    modelMatrix.translate(0, 0, 1);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, CUBELENGTH/FLOATS_PER_VERTEX);  // Box

    modelMatrix.translate(0, 0, 3);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, CUBELENGTH/FLOATS_PER_VERTEX, SPHERELENGTH/FLOATS_PER_VERTEX);  // Sphere 
    //////////////////////////////////////////////////////////////////////////////////

    // TREE /////////////////////////////////////////////////////////////////////////////
    modelMatrix.setTranslate(0, 0, 0);
    modelMatrix.translate(5, 10, 0);
    modelMatrix.scale(.5, .5, .5);
    pushMatrix(modelMatrix); // !!!!!!!!!

    // Trunk 1 part a
    modelMatrix.scale(2, 2, 1);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, BRONZE_BOX_START, CUBELENGTH/FLOATS_PER_VERTEX); // Box
    gl.drawArrays(gl.TRIANGLE_STRIP, BRONZE_SPHERE_START, SPHERELENGTH/FLOATS_PER_VERTEX);  // Sphere

    // Trunk 1 part b
    modelMatrix.rotate(45, 0, 0, 1);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, BRONZE_BOX_START, CUBELENGTH/FLOATS_PER_VERTEX); // Box

    // Treetop 1
    modelMatrix = popMatrix();  // !!!!!!!!!
    modelMatrix.translate(0, 0, 8);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, GRN_SPHERE_START, SPHERELENGTH/FLOATS_PER_VERTEX);  // Sphere

    // Treelets
    pushMatrix(modelMatrix); // !!!!!!!!

    for (k = 0; k < 5; k++) {
      modelMatrix = popMatrix(); // !!!!!!!!
      pushMatrix(modelMatrix); // !!!!!!!!

      modelMatrix.rotate(k*360/5, 0, 0, 1);
      modelMatrix.rotate(45 - current_angle/2, 1, 0, 0);

      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      gl.drawArrays(gl.TRIANGLE_STRIP, BRONZE_BOX_START, CUBELENGTH/FLOATS_PER_VERTEX); // Box

      modelMatrix.translate(0, 0, 8);
      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      gl.drawArrays(gl.TRIANGLE_STRIP, GRN_SPHERE_START, SPHERELENGTH/FLOATS_PER_VERTEX); 

      pushMatrix(modelMatrix); 

      for (q = 0; q < 5; q++) {
        modelMatrix = popMatrix(); // !!!!!!!!
        pushMatrix(modelMatrix); // !!!!!!!!

        modelMatrix.rotate(q*360/5, 0, 0, 1);
        modelMatrix.rotate(45 - current_angle/3, 1, 0, 0);

        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        gl.drawArrays(gl.TRIANGLE_STRIP, BRONZE_BOX_START, CUBELENGTH/FLOATS_PER_VERTEX); // Box

        modelMatrix.translate(0, 0, 8);
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        gl.drawArrays(gl.TRIANGLE_STRIP, GRN_SPHERE_START, SPHERELENGTH/FLOATS_PER_VERTEX); 
      }
      popMatrix();
    }
    ////////////////////////////////////////////////////////////////////////////////////

    // Panicked Robot //////////////////////////////////////////////////////////////////
    // Body
    modelMatrix.setTranslate(-6, -6, 0);
    modelMatrix.rotate(elapsed/10, 0, 0, 1);
    modelMatrix.translate(3, 0, 0);

    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, CHRM_BOX_START, CUBELENGTH/FLOATS_PER_VERTEX);

    pushMatrix(modelMatrix); // !!!!!!!!!!!

    // First arm
    modelMatrix.translate(0, 0, 1.5);
    modelMatrix.rotate(Math.sin(elapsed/150)*30 + 90, 0, 1, 0);

    pushMatrix(modelMatrix); // !!!!

    modelMatrix.scale(.25, .25, .75);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, CHRM_BOX_START, CUBELENGTH/FLOATS_PER_VERTEX); 

    // Lower arm
    modelMatrix = popMatrix(); // !!!!!!!!!!!
    modelMatrix.translate(0, 0, 1.5);

    modelMatrix.rotate(Math.sin(elapsed/150)*30, 0, 1, 0);
    modelMatrix.scale(.25, .25, .5);

    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, CHRM_BOX_START, CUBELENGTH/FLOATS_PER_VERTEX);   

    // Other arm
    modelMatrix = popMatrix(); // !!!!!!!!!!!
    modelMatrix.translate(0, 0, 1.5);
    modelMatrix.rotate(-Math.sin(elapsed/150)*30 - 90, 0, 1, 0);

    pushMatrix(modelMatrix); // !!!!!!!!!!!

    modelMatrix.scale(.25, .25, .75);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, CHRM_BOX_START, CUBELENGTH/FLOATS_PER_VERTEX);

    // Lower other arm
    modelMatrix = popMatrix(); // !!!!!!!!!!!
    modelMatrix.translate(0, 0, 1.5);

    modelMatrix.rotate(-Math.sin(elapsed/150)*30, 0, 1, 0);
    modelMatrix.scale(.25, .25, .5);

    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, CHRM_BOX_START, CUBELENGTH/FLOATS_PER_VERTEX);

    // GRID LINES ///////////////////////////////////////////////////////////////////////////////////
    if (DISPLAY_LINES) {
      modelMatrix.setTranslate(0, 0, 0);
      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      gl.drawArrays(gl.LINES, LINESTART, LINELENGTH/FLOATS_PER_VERTEX);

      modelMatrix.rotate(90, 0, 0, 1);
      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      gl.drawArrays(gl.LINES, LINESTART, LINELENGTH/FLOATS_PER_VERTEX);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////



    requestAnimationFrame(draw, canvas);
  }

  function winResize() {
    var nuCanvas = document.getElementById('webgl');
    nuCanvas.width = innerWidth;
    nuCanvas.height = innerHeight;
  }
}

function print_instructions() {
  var help = document.getElementById('instructions');
  if (help.style.display !== 'none') {
    help.style.display = 'none';
  }
  else {
    help.style.display = 'block';
  }
}
