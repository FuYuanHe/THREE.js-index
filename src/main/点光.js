import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import { Mesh, MeshBasicMaterial } from 'three'


// 创建相机
const scene = new THREE.Scene()
// 创建场景
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// 设置位置
camera.position.set(0, 0, 10)

// 把相机加到页面
scene.add(camera)



// 创建球
const sphere = new THREE.SphereGeometry(3,30,30 )
const material = new THREE.MeshBasicMaterial({color:0xff0000,wireframe:true})
// const mesh = new THREE.Mesh(sphere,material)
// 设置点材质及大小
const pointMaterial = new THREE.PointsMaterial()
pointMaterial.size = 0.1
pointMaterial.color.set (0xff00)
pointMaterial.sizeAttenuation = true

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./texture/002.png')
// 设置贴图
pointMaterial.map = texture
// 设置alphaMap贴图
pointMaterial.alphaMap = texture
// 设置允许透明
pointMaterial.transparent = true
// 设置深度缓冲区
pointMaterial.depthWrite = false
pointMaterial.blending = THREE.AdditiveBlending



const points = new THREE.Points(sphere,pointMaterial)

scene.add(points)


// 创建gui的控制器
const gui = new dat.GUI();


// 初始化渲染器
const renderer = new THREE.WebGL1Renderer()
// 设置渲染器的尺寸
renderer.setSize(window.innerWidth, window.innerHeight)

// 设置物体阴影
// 第一步：渲染器开启阴影计算
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true

// 将webgl渲染的canvas内容插入页面中
document.body.appendChild(renderer.domElement)

// 使用渲染器，通过相机将场景渲染
// renderer.render(scene,camera)

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器的阻尼，使其拥有惯性,更加真实，且要在动画循环中更新，在render函数中
controls.enableDamping = true

// 创建坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// render函数的时间只有一个，如果有多个物体则不方便，这时，可以使用Clock、
let clock = new THREE.Clock()

window.addEventListener('dblclick', () => {
    // 设置双击全屏和退出全屏
    // 渲染器的dom元素请求全屏
    if (document.fullscreenElement) {
        // 注意退出全屏是在document上执行
        document.exitFullscreen()
        // renderer.domElement
    } else {
        renderer.domElement.requestFullscreen()
    }
})

function render() {
    // render函数会接收一个time参数，实际移动的距离需要根据时间和速度来计算,不能直接加一个固定的数值
    // 可以获取两帧之间的时间差  clock.getElapsedTime()
    // 设置小球随着大球做圆周运动
    let time = clock.getElapsedTime()
    controls.update()
    renderer.render(scene, camera)
    // 请求关键帧，下一帧的时候会继续调用render函数
    requestAnimationFrame(render)
}

render()

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


