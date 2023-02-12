import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { Mesh, MeshBasicMaterial } from 'three'


// 创建相机
const scene = new THREE.Scene()
// 创建场景
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 40)

// 设置位置
camera.position.set(0, 0, 40)

// 把相机加到页面
scene.add(camera)

function createPoints(url, size = 0.5) {
    // 创建星河
    const particlesGeomtry = new THREE.BufferGeometry()
    const count = 5000
    // 设置缓冲区数组
    const positis = new Float32Array(count * 3)
    // 设置每个顶点的颜色随机，但是要设置启用顶点颜色
    const colors = new Float32Array(count * 3)
    // 设置顶点
    for (let i = 0; i < count * 3; i++) {
        positis[i] = (Math.random() - 0.5) * 100,
            colors[i] = Math.random()
    }
    particlesGeomtry.setAttribute('position', new THREE.BufferAttribute(positis, 3))
    particlesGeomtry.setAttribute('color', new THREE.BufferAttribute(colors, 3))


    const pointsMaterial = new THREE.PointsMaterial()
    pointsMaterial.size = 0.5
    pointsMaterial.color.set = (0xfff000)
    pointsMaterial.sizeAttenuation = true

    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(`./texture/${url}.png`)
    // 设置贴图
    pointsMaterial.map = texture
    // 设置alphaMap贴图
    pointsMaterial.alphaMap = texture
    // 设置允许透明
    pointsMaterial.transparent = true
    // 设置深度缓冲区
    pointsMaterial.depthWrite = false
    // 设置混合为叠加
    pointsMaterial.blending = THREE.AdditiveBlending
    // 设置启用顶点着色
    pointsMaterial.vertexColors = true


    // 使用自己创建的物体和材质创建实体星河
    const points =  new THREE.Points(particlesGeomtry, pointsMaterial)
    scene.add(points)
    return points

}

const points = createPoints('002')
// 将星河加入场景中:让我为下场雪
scene.add(points)


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


