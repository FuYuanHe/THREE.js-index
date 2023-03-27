import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Mesh, MeshBasicMaterial } from 'three'
import * as CANNON from 'cannon'
import vertexShader from '../shader/water/vertex.glsl'
import fragmentShader from '../shader/water/fragment.glsl'

// 创建gui的控制器
const gui = new dat.GUI();
// 创建相机
const scene = new THREE.Scene()
// 创建场景
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300)

// 设置位置
camera.position.set(0, 0, 18)

// 把相机加到页面
scene.add(camera)

// 创建坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)



// 添加环境光和平行光
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)
// const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
// dirLight.castShadow = true
// scene.add(dirLight)


const params = {
    uWaresFrequency:14,
    uScale:0.03,
    uXzScale:1.5,
    uNoiseFrequency:10,
    uNoiseScale:1.5,
    uLowColor:'#ff0000',
    uHightColor:'#ffff00',
    uXspeed:1,
    uZspeed:1,
    uNoiseSpeed:1,
    uOpacity:1
}

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader:vertexShader,
    fragmentShader:fragmentShader,
    side:THREE.DoubleSide,
    uniforms:{
        uScale:{
            value:params.uScale
        },
        uWaresFrequency:{
            value:params.uWaresFrequency 
        },
        uXzScale:{
            value:params.uXzScale
        },
        uNoiseFrequency:{
            value:params.uNoiseFrequency
        },
        uNoiseScale:{
            value:params.uNoiseScale
        },
        uTime:{
            value:params.uTime
        },
        uLowColor:{
            value:new THREE.Color(params.uLowColor)
        },
        uHightColor:{
            value:new THREE.Color(params.uHightColor)
        },
        uXspeed:{
            value:params.uXspeed
        },
        uZspeed:{
            value:params.uZspeed
        },
        uNoiseSpeed:{
            value:params.uNoiseSpeed
        },
        uOpacity:{
            value:params.uOpacity
        }
    },
    transparent:true,
})



// 添加gui控制器
gui.add(params,'uWaresFrequency').min(1).max(100).step(0.1).name('格子数').onChange((value) => {
    shaderMaterial.uniforms.uWaresFrequency.value = value
})
gui.add(params,'uScale').min(0).max(0.2).step(0.001).name('uScale').onChange(value => {
    shaderMaterial.uniforms.uScale.value = value
})
gui.add(params,'uXzScale').min(0).max(5).step(0.1).name('uXzScale').onChange(value => {
    shaderMaterial.uniforms.uXzScale.value = value
})
gui.add(params,'uNoiseFrequency').min(0).max(20).step(0.1).name('uNoiseFrequency').onChange(value => {
    shaderMaterial.uniforms.uNoiseFrequency.value = value
})
gui.add(params,'uNoiseScale').min(0).max(0.2).step(0.001).name('uNoiseScale').onChange(value => {
    shaderMaterial.uniforms.uNoiseScale.value = value
})
gui.addColor(params,'uLowColor').onFinishChange(value=>{
    shaderMaterial.uniforms.uLowColor.value = new THREE.Color(value)
})
gui.addColor(params,'uHightColor').onFinishChange(value=>{
    shaderMaterial.uniforms.uHightColor.value = new THREE.Color(value)
})

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1,1024,1024),
    shaderMaterial
)
plane.rotation.x = -Math.PI /2
scene.add(plane)



// 初始化渲染器
// const renderer = new THREE.WebGL1Renderer({ alpha: true })
const renderer = new THREE.WebGL1Renderer({ alpha: true })
// renderer.outputEncoding = THREE.sRGBEncoding
// 可能会导致颜色变成黑色，注意
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// 设置曝光
// renderer.toneMappingExposure = 0.01

// 设置渲染器的尺寸
renderer.setSize(window.innerWidth, window.innerHeight)

// 设置物体阴影
// 第一步：渲染器开启阴影计算
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true
// 设置渲染器背景透明
//new THREE.WebGL1Renderer({alpha:true})



// 将webgl渲染的canvas内容插入页面中
document.body.appendChild(renderer.domElement)


// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器的阻尼，使其拥有惯性,更加真实，且要在动画循环中更新，在render函数中
controls.enableDamping = true

// 设置控制器的自动旋转
// controls.autoRotate = true
// 旋转的速度
// controls.autoRotateSpeed = 0.1
// 旋转的角度
// controls.maxPolarAngle = Math.PI/4*3
// controls.minPolarAngle = Math.PI/4*3



// render函数的时间只有一个，如果有多个物体则不方便，这时，可以使用Clock、
let clock = new THREE.Clock()


function animate() { 
    // 这个函数名可以叫render也可以叫animate等别的，注意下面函数调用和请求关键帧的参数即可
    // render函数会接收一个time参数，实际移动的距离需要根据时间和速度来计算,不能直接加一个固定的数值
    // 可以获取两帧之间的时间差  clock.getElapsedTime()
    // 设置小球随着大球做圆周运动
    controls.update()
    let time = clock.getElapsedTime()
    let time2 = clock.getDelta()
    shaderMaterial.uniforms.uTime.value = time
    renderer.render(scene, camera)
    // 请求关键帧，下一帧的时候会继续调用render函数
    requestAnimationFrame(animate)
}

animate()


// 监听画面的变化，如浏览器窗口变大变小，重新渲染画面
window.addEventListener('resize', () => {
    // 更新摄像镜头
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix()
    // 更新渲染器的宽高
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置渲染器的像素比例
    renderer.setPixelRatio(window.devicePixelRatio)
})





