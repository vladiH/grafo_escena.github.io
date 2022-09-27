import * as THREE from "../lib/three.module.js";
import * as OrbitControls from '../lib/OrbitControls.module.js'; 
// Variables estandar
let renderer, scene, camera, orbit;

// Otras globales
let robot;
let angulo = 0;

// Acciones
init();
loadScene();
render();

function init()
{
    // Instanciar el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.getElementById('container').appendChild( renderer.domElement );
    // Instanciar el nodo raiz de la escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5,0.5,0.5);
    // Instanciar la camara
    camera= new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    orbit = new OrbitControls.OrbitControls( camera, renderer.domElement );

    camera.position.set(500,180,-50);
    camera.lookAt(0,60,0);

    orbit.update();

    window.addEventListener('resize',function(){
        let width = window.innerWidth;
        let height = window.innerHeight;
        renderer.setSize(width,height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix;
    });
}

function loadScene()
{
    const sueloMaterial = new THREE.MeshBasicMaterial({color:'yellow',wireframe:true});
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(1000,1000, 20,20), sueloMaterial );
    suelo.rotation.x = -Math.PI/2;
    suelo.position.y = -0.2;
    suelo.position.z= 0;
    scene.add(suelo);
    robot =  baseRobot();
    const brazo = brazoRobot();
    const anteBrazo = anteBrazoRobot();
    const pinzaIzq = pinza();
    pinzaIzq.position.z = 50
    const pinzaDer = pinza();
    pinzaDer.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    pinzaDer.position.z = -50
    brazo.add(anteBrazo);
    anteBrazo.add(pinzaIzq);
    anteBrazo.add(pinzaDer);
    robot.add(brazo);
    scene.add( robot );
}

function update()
{
    //angulo += 0.01;
    //robot.rotation.y = angulo;
    orbit.update();
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(scene,camera);
}

function pinza(){
    const geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    var vertices = new Float32Array( [      
        //Left
        1.0, 0.7, 0.0,
        1.0, 0.3, 0.0,
        0.0, 0.0, 0.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        1.0, 0.7, 0.0,

        //rigth horario
        1.0, 0.7, 0.5,
        0.0, 1.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        1.0, 0.3, 0.5,
        1.0, 0.7, 0.5,

        //top
        0.0, 1.0, 1.0,
        0.0, 1.0, 0.0,
        1.0, 0.7, 0.0,
        1.0, 0.7, 0.0,
        1.0, 0.7, 0.5,
        0.0, 1.0, 1.0,
        
        //botton hora
        0.0, 0.0, 1.0,
        0.0, 0.0, 0.0,
        1.0, 0.3, 0.0,

        1.0, 0.3, 0.0,
        1.0, 0.3, 0.5,
        0.0, 0.0, 1.0,

        //back
        0.0, 0.0, 1.0,
        0.0, 1.0, 1.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 0.0,
        0.0, 0.0, 1.0,

        //front anti
        1.0, 0.3, 0.5,
        1.0, 0.3, 0.0,
        1.0, 0.7, 0.0,
        1.0, 0.7, 0.0,
        1.0, 0.7, 0.5,
        1.0, 0.3, 0.5,
        
    ] );
    var dim = new Array(36).fill([19, 20, 4]).flat();
    vertices = vertices.map((value,index)=>{
        return value*dim[index];
    });

    const normales = [ // 24 x3
    1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,      // Right
    -1,0,0, -1,0,0, -1,0,0, -1,0,0, -1,0,0, -1,0,0,  // Left
    0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0,     // Top 
    0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,  // Bottom
    0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, // Back 
    0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,     // Front
                 ];
    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute(normales,3));
    const pinzaMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 ,wireframe:false} );
    const mesh = new THREE.Mesh( geometry, pinzaMaterial );
    mesh.position.x = 9.5;
    mesh.position.y = -10;
    mesh.position.z = -2;
    const boxGeometry = new THREE.Mesh( new THREE.BoxGeometry(19,20,4), pinzaMaterial);
    boxGeometry.add(mesh);
    // boxGeometry.rotation.y =90*Math.PI/180;
    // boxGeometry.position.y =20;
    //boxGeometry.add(new THREE.AxesHelper(60))
    boxGeometry.position.y = -80
    boxGeometry.position.x = 10
    //boxGeometry.rotation.x =90*Math.PI/180;
    return boxGeometry;
}


function baseRobot(){
    const baseMaterial = new THREE.MeshBasicMaterial({color:'red',wireframe:false});
    return (new THREE.Mesh( new THREE.CylinderGeometry(50,50,15,100), baseMaterial ));
}

function brazoRobot(){
    const baseMaterial = new THREE.MeshBasicMaterial({color:'red',wireframe:false});
    const cylinder = new THREE.Mesh( new THREE.CylinderGeometry(20,20,18,20), baseMaterial );
    cylinder.rotation.z = 90*Math.PI/180;
    const rectangle = new THREE.Mesh( new THREE.BoxGeometry(18,120,18,2), baseMaterial );
    rectangle.rotation.z = 90*Math.PI/180;
    rectangle.position.x = 60;
    cylinder.add(rectangle);
    const sphere = new THREE.Mesh( new THREE.SphereGeometry(20,20,10), baseMaterial );
    sphere.position.y = -60;
    rectangle.add(sphere);
    return cylinder;
}

function anteBrazoRobot(){
    const baseMaterial = new THREE.MeshBasicMaterial({color:'red',wireframe:false});
    const cylinder = new THREE.Mesh( new THREE.CylinderGeometry(22,22,6,20), baseMaterial );
    cylinder.rotation.z = 90*Math.PI/180;
    const rectangle1 = new THREE.Mesh( new THREE.BoxGeometry(4,80,4,2), baseMaterial );
    const rectangle2 = rectangle1.clone();
    const rectangle3 = rectangle1.clone();
    const rectangle4 = rectangle1.clone();
    //rectangle.rotation.z = Math.PI/180;
    rectangle1.position.y = -40;
    rectangle1.position.x = 7;
    rectangle1.position.z = 10;

    rectangle2.position.y = -40;
    rectangle2.position.x = -7;
    rectangle2.position.z = 10;

    rectangle3.position.y = -40;
    rectangle3.position.x = -7;
    rectangle3.position.z = -10;
    //rectangle3.position.x = -10;
    rectangle4.position.y = -40;
    rectangle4.position.x = 7;
    rectangle4.position.z = -10;
    //rectangle4.position.x = 10;
    cylinder.add(rectangle1);
    cylinder.add(rectangle2);
    cylinder.add(rectangle3);
    cylinder.add(rectangle4);
    const cylinder1 = new THREE.Mesh( new THREE.CylinderGeometry(15,15,40,20), baseMaterial );
    cylinder1.position.y = -80;
    cylinder1.rotation.x = 90*Math.PI/180;
    cylinder.add(cylinder1);
    cylinder.position.x = 120;
    return cylinder;
}