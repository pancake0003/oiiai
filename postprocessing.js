import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlineEffect } from 'three/examples/jsm/Addons.js'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js'


export function postprocessing(scene, camera, renderer){
    const composer = new EffectComposer(renderer)
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    composer.setSize(window.innerWidth, window.innerHeight)

    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const glitchPass = new GlitchPass()
    glitchPass.goWild = true
    glitchPass.enabled = false;
    composer.addPass(glitchPass)

    // const pixelPass = new RenderPixelatedPass(8, scene, camera)
    // pixelPass.normalEdgeStrength = 1
    // composer.addPass(pixelPass)

    // const afterPass = new AfterimagePass()
    // afterPass.uniforms.damp.value = 0.96
    // composer.addPass(afterPass)


    //the real effect
    // const bloomPass = new UnrealBloomPass()
    // bloomPass.strength = 0.1
    // composer.addPass(bloomPass)
    //bloomPass.enabled = false

    const outputPass = new OutputPass()
    composer.addPass(outputPass)

    return { composer: composer, glitch: glitchPass }
}