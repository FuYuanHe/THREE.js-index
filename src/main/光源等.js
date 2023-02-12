import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import { Mesh, MeshBasicMaterial } from 'three'



// 加载hdr贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync('texture/001.hdr').then(texture => {
    // texture.mapping = THREE.EquirectangularReflectionMapping
    // scene.background = texture 
    // scene.environment = texture
})
// 创建相机
const scene = new THREE.Scene()
// 创建场景
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// 设置位置
camera.position.set(0, 0, 10)

// 把相机加到页面
scene.add(camera)

// // 创建几何体
// const cubeGeometry = new THREE.BoxGeometry(1,1,1)
// // 材质
// const cubeMaterial = new THREE.MeshBasicMaterial({color:0xffff00})
// // 创建物体,根据材质和几何体
// const cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
// console.log('cube',cube);
// for (let i = 0; i < 50; i++) {
//     const geometry = new THREE.BufferGeometry()
//     const positionArr = new Float32Array(9)
//     for (let j = 0; j < 9; j++) {
//         positionArr[j] = Math.random() * 5
//     }
//     geometry.setAttribute('position', new THREE.BufferAttribute(positionArr, 3))
//     let color = new THREE.Color(Math.random(),Math.random(),Math.random())
//     const material = new THREE.MeshBasicMaterial({ 
//         color,
//         transparent:true,
//         opacity:.3
//      })
//     const mesh = new THREE.Mesh(geometry, material)
//     scene.add(mesh)
// }
// 创建一个加载管理器
let dom = document.createElement('div')
dom.style.height = '200px'
dom.style.width = '200px'
dom.style.position = 'fixed'
dom.style.top='200px'
dom.style.right='200px'
dom.style.color='#fff'
document.body.appendChild(dom)
let event = {}
event.onLoad = function() {
    console.log('加载完成');
}
event.onProgress = function(url,num,total) {
    console.log('加载中');
    console.log('加载地址',url);
    console.log('加载完成数',num);
    console.log('加载总数',total);
    let value = (num/total)*100
    dom.innerHTML = value.toFixed(2) + '%'
    console.log(value);
    if(value == 100){
        document.body.removeChild(dom)
    }
}
event.onError = function() {
    console.log('加载错误');
}
const manager = new THREE.LoadingManager(
    event.onLoad,event.onProgress,event.onError
)


// 创建一个贴图材质
// 先创建一个模型
const cubeGeometry = new THREE.BoxGeometry(2,2,2,100,100,100)
// const planeGemotry = new THREE.PlaneGeometry(1,1,200,200)

// 创建一个纹理加载器
const textureLoader = new THREE.TextureLoader(manager)
// 加载想要的纹理，得到一个纹理对象
const boxtexture = textureLoader.load('./texture/meinv.jpg')
const alphaTexture = textureLoader.load('./texture/01.jpeg')
const planeTexture = textureLoader.load('./texture/02.jpg')
const doorTexture = textureLoader.load('./texture/03.jpeg')
// 导入法线贴图
const normalTexture = textureLoader.load('./texture/03.jpg')
// 设置纹理对象
// 设置纹理偏移
// boxtexture.offset.set(0.5,0.5)
// 设置旋转的原点位置
// boxtexture.center.set(0.5,0.5)
// 纹理的旋转
// boxtexture.rotation = Math.PI / 4  // 旋转45度
// 设置重复，分为xy轴
// boxtexture.repeat.set(2,2)
// 设置xy轴的重复属性，THREE.RepeatWrapping，常量，无限重复   MirroredRepeatWrapping:镜像重复
boxtexture.wrapS = THREE.MirroredRepeatWrapping
boxtexture.wrapT = THREE.RepeatWrapping


// 将纹理付给Material材质对象的map属性
//MeshStandardMaterial基础材质
const cubeMaterial = new THREE.MeshStandardMaterial({
    // map:boxtexture,
    // // 透明背景
    // alphaMap:alphaTexture,
    // // 开启透明
    // transparent:true,
    // // 环境遮挡背景
    // aoMap:planeTexture,
    // aoMapIntensity:1,
    // displacementMap:doorTexture,
    // displacementScale:0.05,
    // // 設置高光的粗糙度,反射
    // roughness:1,
    // // 还可以设置粗糙度贴图
    // // 法线贴图
    // normalMap:normalTexture,

})
cubeMaterial.side = THREE.DoubleSide
// 根据材质和模型创建实际的物体
const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial)

const planeGemotry = new THREE.PlaneGeometry(20,20)
const plane = new Mesh(planeGemotry,cubeMaterial)
plane.position.set(0,-1,0)
plane.rotation.x = -Math.PI/2
// 第四步：设置物体接收阴影
plane.receiveShadow = true

const planeMesh = new THREE.Mesh(planeGemotry,cubeMaterial)

const cubeTexture = new THREE.CubeTextureLoader()
const cubeLoaderMap = cubeTexture.load([
    './texture/posx.jpg',
    './texture/negx.jpg',
    './texture/posy.jpg',
    './texture/negy.jpg',
    './texture/posz.jpg',
    './texture/negz.jpg',
])

// 创建球体
const sephere = new THREE.SphereGeometry(1,20,20)
const sephereMaterial = new THREE.MeshStandardMaterial({
    metalness:0.01,
    roughness:0.01,
    // envMap:cubeLoaderMap
})
const sephereMesh = new THREE.Mesh(sephere, sephereMaterial)
// 第三步：设置物体的投射阴影
sephereMesh.castShadow = true
scene.add(sephereMesh)
// 给场景添加背景
// scene.background = cubeLoaderMap
// 给背景添加默认的环境贴图 ，等同于所有的材质都加这个配置envMap:cubeLoaderMap
// scene.environment = cubeLoaderMap

planeMesh.position.set(2,0,0)
// 将物体添加到场景中
// scene.add(mesh)
scene.add(plane)

planeGemotry.setAttribute("uv2",new THREE.BufferAttribute(planeGemotry.attributes.uv.array,2))

// 环境光，四面八方打过来的光
const abmLight = new THREE.AmbientLight(0xFFFFFF,0.5)
scene.add( abmLight );


// 创建一个小球接收光
const smallBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.1,20,20),
    new MeshBasicMaterial({color:0xff0000})
)
smallBall.position.set(2,2,2)


// 直线光 平行光
const pointLight = new THREE.PointLight( 0xFF0000,1);
pointLight.intensity = 2 // intensity 设置为1和new THREE.SpotLight( 0xFFFFFF,1)设置为1的作用是一样的
// pointLight.position.set(2,2,2)
// 第二步：设置光照投射阴影、
pointLight.castShadow = true
pointLight.shadow.radius = 20
pointLight.shadow.mapSize.set(4096,4096)
// pointLight.target = sephereMesh
// pointLight.angle = Math.PI/6
// pointLight.penumbra = 0
// 注意decay属性需要开启物理光照，设置为true
// renderer.physicallyCorrectLights = true
pointLight.distance = 0
pointLight.decay = 0

// 设置平行光投射相机的属性
// direlight.shadow.camera.near = 0.5
// direlight.shadow.camera.far = 500

// direlight.shadow.camera.top = 5
// direlight.shadow.camera.bottom = -5
// direlight.shadow.camera.left = -5
// direlight.shadow.camera.right = 5

// 把点光源添加给小球
smallBall.add(pointLight)

// const helper = new THREE.DirectionalLightHelper( light, 5 );
scene.add( smallBall );


// planeGemotry.setAttribute("uv2",new THREE.BufferAttribute(planeGemotry.attributes.uv.array,2))


// 创建指定坐标位置的点
// const vertices = new Float32Array([
//     -1.0, -1.0, 1.0,  1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0
// ])



// 可以在这里单独修改cube物体的位置和缩放旋转
// cube.scale.set(3,2,1)
// rotation
// cube.rotation.set(Math.PI /4,0,0)

// 将几何体添加到场景中
// scene.add(cube)


// 创建gui的控制器
const gui = new dat.GUI();
gui.add(pointLight.shadow.camera,'near').min(0).max(10).step(0.1).onChange(()=>{
    spotLight.shadow.camera.updateProjectionMatrix()
})
gui.add(pointLight.position,'x').min(-5).max(5).step(0.1)
gui.add(pointLight,'distance').min(0).max(5).step(0.001)
gui.add(pointLight,'decay').min(0).max(5).step(0.01)
// gui.add(cube.position,"y").min(0).max(5).step(0.01).name('Y轴').onChange((value)=>{
//     console.log('值被修改了');
// }).onFinishChange(value => {
//     console.log('停下来的时候会触发');
// })
// const params = {
//     color:'#bfa',
//     fn:()=> {
//         // 点击使得物体移动
//         gsap.to(cube.position,{x:5,duration:5,repeat:-1,yoyo:true,ease:"power1.inOut"})
//     }
// }
// 添加颜色
// gui.addColor(params,"color").onChange(value=> {
//     console.log(value);
//     cube.material.color.set(value)
// })


// 添加一个文件夹
// let floder = gui.addFolder("设置物体")
// floder.add(cube.material,"wireframe")
// // 设置单选框
// floder.add(cube,"visible").name('是否显示')
// // 加个按钮，点击触发某个事件
// floder.add(params,"fn").name('按钮')



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
// 通过gsap动画来控制物体的移动
/**
 * cube.position:物体的位置
 * {x:5,duration:5}：x表示x移动到5，duration：表示用时间5秒
 * ease:"power1.inOut":表示速率，可以查看gasp的文档，这里表示先慢再快再慢
 * 
 */
// 设置移动和旋转
// let animate1 = gsap.to(cube.position,{
//     x:5,
//     duration:5,
//     ease:"power1.inOut",
//     repeat:-1,
//     yoyo:true,
//     onStart:()=>{
//         console.log('动画开始了！');
//     },
//     onComplete:()=>{
//         window.alert('动画完成了！')
//     },
// })
// let animate2 = gsap.to(cube.rotation,{
//     x:2*Math.PI,
//     duration:5,
//     repeat:-1,
//     yoyo:true,
//     ease:"power1.inOut"
// })

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

    // 设置双击暂停和重启
    // if(animate1.isActive()){
    //     animate1.pause()
    // }else{
    //     animate1.resume()
    // }
})

function render() {
    // render函数会接收一个time参数，实际移动的距离需要根据时间和速度来计算,不能直接加一个固定的数值
    // 可以获取两帧之间的时间差  clock.getElapsedTime()
    // let dlt = clock.getDelta()
    // console.log('dlt',dlt);
    // let time = clock.getElapsedTime() // 这个函数获取的时间单位是秒
    // let t = time % 5
    // let t = time / 1000 % 5
    // cube.position.x = t * 1
    // cube.rotation.x = t * 1
    // cube.position.x += 0.01
    // cube.rotation.x += 0.01
    // cube.position.y += 0.1
    // cube.position.z += 0.1
    // if(cube.position.x >=5)cube.position.x= 0
    // if(cube.position.y >=5)cube.position.y= 0
    // if(cube.position.z >=5)cube.position.z= 0
    // 设置小球随着大球做圆周运动
    let time = clock.getElapsedTime()
    smallBall.position.x = Math.sin(time) * 3
    smallBall.position.y = 2+ Math.sin(time *10)
    smallBall.position.z = Math.cos(time) * 3
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


