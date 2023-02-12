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
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./texture/ball.png')

// 设置位置
camera.position.set(0, 0, 10)

// 把相机加到页面
scene.add(camera)

const params = {
    count:10000, // 数量
    size:0.1,// 大小
    radius:5,// 半径
    branch:6,// 分支
    color:'#ff6030',// 颜色
    rotateScale:0.5,
    endColor:'#1b3984'
}
let geometry = null
let material = null
const centerColor = new THREE.Color(params.color)
const endColor = new THREE.Color(params.endColor)
const getGenerate = () => {
    // 设置物体
    geometry = new THREE.BufferGeometry()
    // 设置位置
    const positions = new Float32Array(params.count * 3)
    const colors = new Float32Array(params.count * 3)

    for(let i=0;i<params.count;i++){
        // 当前的点应该在哪一个分支角度上,计算角度
        const branchAngel = (i % params.branch) * (2*(Math.PI)/params.branch)
        // 点距离圆心的位置
        // const distance = Math.random() * params.radius
        // 修改距离使其在前面集中，这个效果也很好看
        // const distance = Math.random() * params.radius * Math.pow(Math.random()*2,3)
        const distance = Math.random() * params.radius * Math.pow(Math.random(),3)
        // 当前分支
        const current = i*3
        // Math.pow(Math.random()*2 -1,3) 选择-1 到1 开三次方
        // 设置中间和边上的厚度一样
        // const randomX = Math.pow(Math.random()*2 -1,3)
        // 设置中间多到边上少
        const randomX = (Math.pow(Math.random()*2 -1,3) *(params.radius-distance))/5
        const randomY = (Math.pow(Math.random()*2 -1,3) *(params.radius-distance))/5
        const randomZ = (Math.pow(Math.random()*2 -1,3) *(params.radius-distance))/5
        positions[current] = Math.cos(branchAngel +distance*params.rotateScale)* distance+randomX// x坐标的位置
        positions[current +1] = 0+randomY // y坐标的位置
        positions[current +2] = Math.sin(branchAngel+distance*params.rotateScale)* distance+randomZ // z坐标的位置
        
        
        // 设置渐变混合色
        const mixColor = centerColor.clone()
        mixColor.lerp(endColor,distance/params.radius)
        colors[current] = mixColor.r
        colors[current+1] = mixColor.g
        colors[current+2] = mixColor.b
    }
    // 设置位置
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
    geometry.setAttribute('color',new THREE.BufferAttribute(colors,3))
    // 设置材质
    material = new THREE.PointsMaterial({
        color:new THREE.Color(params.color),
        size:params.size,
        sizeAttenuation:true,
        depthWrite:false,
        blending:THREE.AdditiveBlending, // 混合着色
        map:texture, // 贴图
        alphaMap:texture, // 透明度贴图
        transparent:true, // 透明度
        vertexColors:true // 顶点颜色
    })
    let points = new THREE.Points(geometry,material)
    scene.add(points)
    return points
}
getGenerate()


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


