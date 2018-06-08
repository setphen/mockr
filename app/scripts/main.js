// REQUIREMENTS
var THREE = require('three');
var dat = require('./vendor/dat.gui.js');

//THREE.JS
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 25, 4/3, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({
  preserveDrawingBuffer: true,
  alpha: true,
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize( 800, 600 );
renderer.setClearColor( 0xed3e44);
document.body.appendChild( renderer.domElement );
dropzone = renderer.domElement;
window.dropzone = dropzone;
dropzone.setAttribute("draggable", "true");



var saveRenderer = new THREE.WebGLRenderer({
  preserveDrawingBuffer: true,
  alpha: true,
  antialias: true
});
saveRenderer.setSize( 800*3, 600*3 );
saveRenderer.setClearColor( 0xed3e44);

//OFFSCREEN RENDER TARGET
var renderBuffer = new THREE.WebGLRenderTarget({width:800*3, height:600*3});

//DRAG AND DROP
dropzone.ondragstart = function(e) {
  e.preventDefault();
  return false;
};

dropzone.ondragover = function(e) {
  e.preventDefault();
  return false;
};

dropzone.ondrop = function (e) {
  e.preventDefault();

  var file = e.dataTransfer.files[0];
  reader = new FileReader();
  reader.onload = function (event) {
    var data = reader.result;//new Uint8Array(reader.result);
    var image = document.createElement( 'img' );
    texture = new THREE.Texture(image);
    image.onload = function()  {
      plane.scale.x = image.width/image.height;
      shadowPlane.scale.y = 2 * image.width/image.height;
      texture.needsUpdate = true;
    };
    image.src = data;
    material.map = texture;
    material.needsUpdate = true;
  };
  reader.readAsDataURL(file);
  // reader.readAsDataURL(file);
  //
  // return false;

}

// SHADER MATERIAL

var colorUniforms = {
  resolution: { value: new THREE.Vector2() },
}

var shaderMaterial = new THREE.ShaderMaterial( {
  uniforms: colorUniforms,
  vertexShader: document.getElementById( 'vertexProgram' ).textContent,
  fragmentShader: document.getElementById( 'fragmentProgram' ).textContent
} );

var material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide});

var plane;

var geom = new THREE.PlaneGeometry(1,1);
plane = new THREE.Mesh( geom, material );
scene.add( plane );
plane.position.z = 0.5;
plane.position.y = -0.015;
plane.rotation.x = Math.PI/2;

var groundMaterial = new THREE.ShadowMaterial({opacity: 0.3});
var groundGeom = new THREE.PlaneGeometry(40,40);
groundPlane = new THREE.Mesh( groundGeom, groundMaterial );
scene.add( groundPlane );
groundPlane.position.z = -2.9;
// groundPlane.rotation.x = -0.6;

camera.position.z = 0.71;
camera.position.y = -2.5;
camera.position.x = 1.5;
camera.up = new THREE.Vector3(0,0,1);
camera.lookAt(new THREE.Vector3(0,0,0.5));

var shadowTexture = new THREE.TextureLoader().load( 'assets/shadow.jpg' );

// immediately use the texture for material creation
var shadowMaterial = new THREE.MeshBasicMaterial({
  map: shadowTexture,
  blending: THREE.MultiplyBlending,
  transparent: true
});

shadowPlane =  new THREE.Mesh( geom, shadowMaterial );
shadowPlane.scale.x = 3;
shadowPlane.scale.y = 2;
shadowPlane.position.z = -0.001;
shadowPlane.rotation.z = Math.PI * 3/2;
scene.add(shadowPlane);

renderer.render( scene, camera );

animate();

function animate() {
  setTimeout(function(){
    requestAnimationFrame( animate );
  }, 1000/30);

  renderer.render( scene, camera );
}

window.ss = function(){
  saveRenderer.render( scene, camera );
  imgData = saveRenderer.domElement.toDataURL("image/png");
  window.open(imgData);
}


// var gui = new dat.GUI();
//var folder = gui.addFolder( 'folder' );
// folder.open();

window.onload = function() {

};
