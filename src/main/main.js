import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { Mesh, MeshBasicMaterial } from 'three'
import * as CANNON from 'cannon'


// 创建相机
const scene = new THREE.Scene()
// 创建场景
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300)
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./texture/ball.png')

// 设置位置
camera.position.set(0, 0, 18)

// 把相机加到页面
scene.add(camera)

// 创建球和平面
const sphereGeomethy = new THREE.SphereGeometry(1,20,20)
const sphereMaterial = new THREE.MeshStandardMaterial()
const sphere = new THREE.Mesh(sphereGeomethy,sphereMaterial)
sphere.castShadow = true
scene.add(sphere)
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.MeshStandardMaterial()
)
floor.position.set(0,-5,0)
floor.rotation.x = -Math.PI/2
floor.receiveShadow = true
scene.add(floor)


// 创建物理世界
const world = new CANNON.World()
world.gravity.set(0, -9.8, 0)
// 或者world.gravity.set(0,-9.8,0)
// 创建物理小球
const sphereShape = new CANNON.Sphere(1)
// 设置材质
const sphereShapeMaterial = new CANNON.Material()
const sphereBody = new CANNON.Body({
    shape:sphereShape,
    position:new CANNON.Vec3(0,0,0),
    // 小球的质量
    mass:1,
    // 小球的材质
    material:sphereShapeMaterial
})
// 将物体添加到世界
world.addBody(sphereBody)



// 添加环境光和平行光
const ambientLight =  new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambientLight)
const dirLight = new THREE.DirectionalLight(0xffffff,0.5)
dirLight.castShadow = true
scene.add(dirLight)



// 初始化渲染器
const renderer = new THREE.WebGL1Renderer({alpha:true})
// 设置渲染器的尺寸
renderer.setSize(window.innerWidth, window.innerHeight)

// 设置物体阴影
// 第一步：渲染器开启阴影计算
renderer.shadowMap.enabled = true
// renderer.physicallyCorrectLights = true
// 设置渲染器背景透明
//new THREE.WebGL1Renderer({alpha:true})



// 将webgl渲染的canvas内容插入页面中
document.body.appendChild(renderer.domElement)


// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器的阻尼，使其拥有惯性,更加真实，且要在动画循环中更新，在render函数中
controls.enableDamping = true

// 创建坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// render函数的时间只有一个，如果有多个物体则不方便，这时，可以使用Clock、
let clock = new THREE.Clock()

function render() {
    // render函数会接收一个time参数，实际移动的距离需要根据时间和速度来计算,不能直接加一个固定的数值
    // 可以获取两帧之间的时间差  clock.getElapsedTime()
    // 设置小球随着大球做圆周运动
    let time = clock.getElapsedTime()
    let time2 = clock.getDelta()
    // console.log('sphereBody.position',sphereBody.position);
    // 及时推进物理世界，更新物理引擎里世界的物体
    //step 参数为多少帧，两帧的时间差
    world.step(1/120,time2)
    // 将两个物体关联，拷贝物理世界物体的位置给sphere
    sphere.position.copy(sphereBody.position)

    // controls.update()
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





