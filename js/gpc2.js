import * as THREE from "../lib/three.module.js";
import * as OrbitControls from '../lib/OrbitControls.module.js'; 
import {BrazoRobotico} from "./brazo_robotico.js";
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
    robot =  new BrazoRobotico(true)
    scene.add( robot.model());
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