import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
const pointer = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
let check = 0
//set it to true when the audio plays in the playAudio function
const startTime = 0
let endTime = 0
let isplaying = false

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setClearColor(new THREE.Color(0xffffff))
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()

	//lights
	lights.defaultLight = addLight()

	//changes
	meshes.default.scale.set(2, 2, 2)

	//scene operations
	//scene.add(meshes.default)
	//scene.add(meshes.standard)
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
			console.log(object)
			while(object){
				if(object.userData.groupName === 'oiiai'){
					check ++
					if (check > 0 && check < 2){
						//for some reason endTime always starts at 5
						endTime -= 2.5
						playAudio()
						// gsap.to(meshes.oiiai.rotation, {
						// 	y: '+=100',
						// 	duration: 20
						// })
					}
					if (check == 2){
						endTime += 3.5
						playAudio()
						// gsap.to(meshes.oiiai.rotation, {
						// 	y: '+=100',
						// 	duration: 20
						// })
					}
					else {
						endTime += 5
						playAudio()
						// gsap.to(meshes.oiiai.rotation, {
						// 	y: '+=300',
						// 	duration: 20
						// })
					}
					// console.log(check)
					// console.log(endTime)

					break
				}
				if(object.userData.groupName === 'target1'){
					alert('bye')
					break
				}
				object = object.parent
			}
		}

	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()
	const elapseTime = clock.getElapsedTime()

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	if(check <3 && meshes.oiiai && isplaying){
		meshes.oiiai.position.y = Math.sin(elapseTime*12)/4 -1
		meshes.oiiai.rotation.y += 50
	}
	else if (meshes.oiiai && isplaying){
		meshes.oiiai.position.y = Math.sin(elapseTime*12)/4 -1
		meshes.oiiai.rotation.y += 300
	}

	// meshes.default.scale.x += 0.01

	renderer.render(scene, camera)
}


function playAudio() {
	const audio = document.getElementById('audio')

	audio.addEventListener('loadedmetadata', () => {
		audio.currentTime = startTime // set start time
	})

	audio.addEventListener('timeupdate', () => {
		if (audio.currentTime >= endTime) {
			audio.pause() // pause the playback
			isplaying = false;
		}
	})

	console.log('playing')
	audio.play() //
	isplaying = true;

}

//document.addEventListener('DOMContentLoaded', playAudio)
