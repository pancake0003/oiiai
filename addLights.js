import * as THREE from 'three'

export function addLight() {
	const light = new THREE.DirectionalLight(0xffffff, 10)
	light.position.set(1, 1, 1)
	return light
}
