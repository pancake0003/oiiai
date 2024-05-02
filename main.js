import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { postprocessing } from './postprocessing'
import {gsap} from 'gsap'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 0, 5)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
controls.zoomSpeed = 5;
const pointer = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
let check = 0
let composer
const startTime = 5
let endTime = 0
let isplaying = false
let effects = false;
let invertToggle = false;
let saturateToggle = false;
let pinkToggle = false;

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setClearColor(new THREE.Color(0xffffff))
	document.body.appendChild(renderer.domElement)

	//lights
	lights.defaultLight = addLight()

	composer = postprocessing(scene, camera, renderer)

	scene.add(lights.defaultLight)

	//load aduio before everythbg else
	//audio.addEventListener('canplaythrough', (event)=> {
		models()
		raycast()
		resize()
		animate()
	//})
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function models(){
	const oiiai = new Model({
		name:'oiiai',
		scene: scene,
		meshes: meshes,
		url: 'catPNG.glb',
		//if i take out matcap, it prompts the alert twice in a row when clicked
		//replace: true,
		//replaceURL: 'cat.png',
		scale: new THREE.Vector3(1, 1, 1),
		position: new THREE.Vector3(-0.2, -1.1, 2),
	})
	oiiai.init()
}

function raycast(){
	window.addEventListener('click', (event)=>{
		pointer.x = (event.clientX/window.innerWidth)*2-1
		pointer.y = -(event.clientY/window.innerHeight)*2+1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(scene.children, true)
		for(let i = 0; i < intersects.length; i ++){
			let object = intersects[i].object
			//console.log(object)
			while(object){
				if(object.userData.groupName === 'oiiai'){
					check ++
					if (check > 0 && check < 2){
						//for some reason endTime always starts at 5
						endTime -= 3
						playAudio()
					}
					if (check == 2){
						endTime += 2.4
						playAudio()
					}
					else {
						endTime += 5
						playAudio()
					}
					// console.log(check)
					// console.log(endTime)
					console.log(endTime)
					break
				}
				//if time is 16 seconds in, add effects
				object = object.parent
			}
		}

	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()
	const elapseTime = clock.getElapsedTime()
	// console.log(testDiv)

	if(check <3 && meshes.oiiai && isplaying){
		meshes.oiiai.position.y = Math.sin(elapseTime*12)/4 -1
		meshes.oiiai.rotation.y += 50
	}

	else if (meshes.oiiai && isplaying){
		meshes.oiiai.position.y = Math.sin(elapseTime*12)/4 -1
		meshes.oiiai.rotation.y += 300
	}

	composer.composer.render()
	composer.glitch.enabled = effects

	document.addEventListener('keydown', function(event) {
		if (event.key == 'd'){
			invertToggle = true;
		}
		else if(event.key == 'j'){
			saturateToggle = true;
		}
		else if (event.key == 'k'){
			pinkToggle = true;
		}
		else {
			effects = true;
		}
	});
	if (invertToggle) {
        document.body.classList.add('invert-colors');
    }
	if(saturateToggle){
		document.body.classList.add('saturate');
	}
	if(pinkToggle){
		renderer.setClearColor(new THREE.Color(0x0000ff));
	}
	document.addEventListener('keyup', function(event) {
		if(event.key == 'd'){
			invertToggle=false;
			document.body.classList.remove('invert-colors');
		}
		else if(event.key == 'j'){
			saturateToggle=false;
			document.body.classList.remove('saturate');
		}
		else if (event.key == 'k'){
			renderer.setClearColor(new THREE.Color(0xffffff));
			pinkToggle = false;
		}
		else {
			effects = false;
		}
	});
	// meshes.default.scale.x += 0.01

	//renderer.render(scene, camera)
}


function playAudio() {
	const audio = document.getElementById('audio')
	//composer.bloom.enabled = effects	
	audio.addEventListener('loadedmetadata', () => {
		audio.currentTime = startTime // set start time
	})

	audio.addEventListener('timeupdate', () => {
		if (audio.currentTime >= endTime) {
			audio.pause() // pause the playback
			isplaying = false;
		}
	})
	audio.addEventListener('ended', () => {
		//resets
		isplaying = false;
		check = 0;
		endTime =0;
	});

	audio.play() //
	isplaying = true;
}

//document.addEventListener('DOMContentLoaded', playAudio)
