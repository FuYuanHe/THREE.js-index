import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Mesh, MeshBasicMaterial } from 'three'
import * as CANNON from 'cannon'
import vertexShader from '../shader/flyLight/vertex.glsl'
import fragmentShader from '../shader/flyLight/fragment.glsl'


// 创建相机
const scene = new THREE.Scene()
// 创建场景
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300)
// 加载环境纹理
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync('./texture/001.hdr').then(texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
})
// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load('./texture/bg.jpg')

// 设置位置
camera.position.set(0, 0, 18)

// 把相机加到页面
scene.add(camera)

// 创建球和平面
// const sphereGeomethy = new THREE.SphereGeometry(1,20,20)
// const sphereMaterial = new THREE.MeshStandardMaterial()
// const sphere = new THREE.Mesh(sphereGeomethy,sphereMaterial)
// sphere.castShadow = true
// scene.add(sphere)

const material = new THREE.MeshBasicMaterial({color:"#bfa"})
// 编写程序实现材质
const shaderMaterial = new THREE.RawShaderMaterial({
    vertexShader:vertexShader,
    fragmentShader:fragmentShader,
    // wireframe:true,
    side:THREE.DoubleSide,
    uniforms:{
        uTime:{
            value:0
        },
        // uTexture:{
        //     value:texture
        // }
    },
    // transparent:true
})

// const floor = new THREE.Mesh(
//     new THREE.PlaneGeometry(1,1,64, 64),
//     shaderMaterial
// )
// floor.position.set(0, 0, 0)
// // floor.rotation.x = -Math.PI / 2
// // floor.receiveShadow = true
// scene.add(floor)



// 添加环境光和平行光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
dirLight.castShadow = true
scene.add(dirLight)



// 初始化渲染器
// const renderer = new THREE.WebGL1Renderer({ alpha: true })
const renderer = new THREE.WebGL1Renderer({ alpha: true })
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
// 设置曝光
renderer.toneMappingExposure = 0.01

const gltfLoader = new GLTFLoader()
let lightBox = null
gltfLoader.load('./model/fly.glb',(gltf)=>{
    console.log(gltf);
    // scene.add(gltf.scene)
    lightBox = gltf.scene.children[0]
    lightBox.material = shaderMaterial

    for(let i=0;i<100;i++){
        let flyLight =  gltf.scene.clone(true)
        let x = (Math.random()-0.5)*300
        let z = (Math.random()-0.5)*100
        let y = (Math.random()-0.5)*30+25
        flyLight.position.set(x,y,z)
        gsap.to(flyLight.rotation,{
            y:2*Math.PI,
            duration:10+ Math.random()*10,
            yoyo:true,
            repeat:-1
        })
        gsap.to(flyLight.position,{
           x:'+='+Math.random()*5,
           y:'+='+Math.random()*20,
           duration:5+ Math.random()*10,
           yoyo:true,
           repeat:-1
        })
        scene.add(flyLight)
    }
})
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

// 设置控制器的自动旋转
controls.autoRotate = true
// 旋转的速度
controls.autoRotateSpeed = 0.1
// 旋转的角度
controls.maxPolarAngle = Math.PI/4*3
controls.minPolarAngle = Math.PI/4*3

// 创建坐标轴辅助器
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

// render函数的时间只有一个，如果有多个物体则不方便，这时，可以使用Clock、
let clock = new THREE.Clock()

// function render() { 
//     // 这个函数名可以叫render也可以叫animate等别的，注意下面函数调用和请求关键帧的参数即可
//     // render函数会接收一个time参数，实际移动的距离需要根据时间和速度来计算,不能直接加一个固定的数值
//     // 可以获取两帧之间的时间差  clock.getElapsedTime()
//     // 设置小球随着大球做圆周运动
//     let time = clock.getElapsedTime()
//     let time2 = clock.getDelta()

//     renderer.render(scene, camera)
//     // 请求关键帧，下一帧的时候会继续调用render函数
//     requestAnimationFrame(render)
// }

// render()

function animate() { 
    // 这个函数名可以叫render也可以叫animate等别的，注意下面函数调用和请求关键帧的参数即可
    // render函数会接收一个time参数，实际移动的距离需要根据时间和速度来计算,不能直接加一个固定的数值
    // 可以获取两帧之间的时间差  clock.getElapsedTime()
    // 设置小球随着大球做圆周运动
    controls.update()
    let time = clock.getElapsedTime()
    let time2 = clock.getDelta()
    // shaderMaterial.uniforms.uTime.value = time
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





