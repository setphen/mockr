// REQUIREMENTS
var THREE = require('three');
var dat = require('./vendor/dat.gui.js');

//THREE.JS
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, 4/3, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({
  preserveDrawingBuffer: true,
  alpha: true,
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio || 1);
window.renderer = renderer;
renderer.setSize( 800, 600 );
renderer.setClearColor( 0xffffff, 0 );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.renderSingleSided = false;
renderer.shadowMap.rendereingleSided = false;
document.body.appendChild( renderer.domElement );
dropzone = renderer.domElement;
window.dropzone = dropzone;
dropzone.setAttribute("draggable", "true");


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
  console.log(e);

  var file = e.dataTransfer.files[0];
  reader = new FileReader();
  reader.onload = function (event) {
    var data = reader.result;//new Uint8Array(reader.result);
    var image = document.createElement( 'img' );
    texture = new THREE.Texture(image);
    image.onload = function()  {
      plane.scale.x = image.width/image.height;
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
plane.castShadow = true;
scene.add( plane );

var groundMaterial = new THREE.ShadowMaterial({opacity: 0.3});
var groundGeom = new THREE.PlaneGeometry(40,40);
groundPlane = new THREE.Mesh( groundGeom, groundMaterial );
groundPlane.receiveShadow = true;
scene.add( groundPlane );
groundPlane.position.z = -2.9;
// groundPlane.rotation.x = -0.6;

camera.position.z = 2;
// camera.rotation.x = 0.2;


shadowLight = new THREE.DirectionalLight( 0xffffff, 1, 100 );
shadowLight.position.set( 1, 1, 23 );
shadowLight.castShadow = true;            // default false
scene.add(shadowLight);
console.log(shadowLight.target);

shadowLight.shadow.mapSize.width = 2048;  // default
shadowLight.shadow.mapSize.height = 2048; // default
shadowLight.shadow.camera.near = 0.5;       // default
shadowLight.shadow.camera.far = 100;      // default

// var helper = new THREE.CameraHelper( shadowLight.shadow.camera );
// scene.add( helper );

renderer.render( scene, camera );

animate();

function animate() {
  requestAnimationFrame( animate );

  renderer.render( scene, camera );
  // renderer.render( scene, camera, renderBuffer);
}

window.ss = function(){
  window.open(renderer.domElement.toDataURL("image/png"));
}


// var gui = new dat.GUI();
//var folder = gui.addFolder( 'folder' );
// folder.open();

window.onload = function() {

};
