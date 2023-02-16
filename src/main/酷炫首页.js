import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { Mesh, MeshBasicMaterial } from 'three'


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



// 创建几何体
let cubeGroup = new THREE.Group()
const cubeGeometry = new THREE.BoxGeometry(2,2,2)
const material = new THREE.MeshBasicMaterial({
    wireframe:true
})
const redMaterial = new THREE.MeshBasicMaterial({
    color:'#ff0000'
})
// 光线效果
let cubeArr = []

for(let i=0;i<5;i++){
    for(let j=0;j<5;j++){
        for(let k=0;k<5;k++){
            const cube = new THREE.Mesh(cubeGeometry,material)
            cube.position.set(i*2-4,j*2-4,k*2-4)
            cubeArr.push(cube)
            cubeGroup.add(cube)
        }
    }
}

// 先加入到组中，最后将组添加至场景中
scene.add(cubeGroup)


// 创建酷炫三角形
let gemoGroup = new THREE.Group()
 for (let i = 0; i < 50; i++) {
    const geometry = new THREE.BufferGeometry()
    const positionArr = new Float32Array(9)
    for (let j = 0; j < 9; j++) {
        if(j%3==1){
            positionArr[j] = Math.random() * 10-5 
        }else{
            positionArr[j] = Math.random() * 10-5 
        }
        
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positionArr, 3))
    let color = new THREE.Color(Math.random(),Math.random(),Math.random())
    const material = new THREE.MeshBasicMaterial({ 
        color,
        transparent:true,
        opacity:.4,
        side:THREE.DoubleSide
     })
    const mesh = new THREE.Mesh(geometry, material)
    gemoGroup.add(mesh)
}
// 向下移动组的位置
gemoGroup.position.set(0,-30,0)
scene.add(gemoGroup)






// 创建跳动的小球
// 创建球体
const sephereGroup = new THREE.Group()
const sephere = new THREE.SphereGeometry(1,20,20)
const planeGemotry = new THREE.PlaneGeometry(30,30)
const cubeMaterial = new THREE.MeshStandardMaterial({
})
cubeMaterial.side = THREE.DoubleSide
const plane = new Mesh(planeGemotry,cubeMaterial)
plane.position.set(0,-1,0)
plane.rotation.x = -Math.PI/2
// 第四步：设置物体接收阴影
plane.receiveShadow = true


const sephereMaterial = new THREE.MeshStandardMaterial({
    metalness:0.01,
    roughness:0.01,
    // envMap:cubeLoaderMap
})
const planeMesh = new THREE.Mesh(planeGemotry,cubeMaterial)
const sephereMesh = new THREE.Mesh(sephere, sephereMaterial)
// 第三步：设置物体的投射阴影
sephereMesh.castShadow = true
sephereGroup.add(sephereMesh)
// 给场景添加背景
// 给背景添加默认的环境贴图 ，等同于所有的材质都加这个配置envMap:cubeLoaderMap
planeMesh.position.set(2,0,0)
// 将物体添加到场景中
sephereGroup.add(plane)

planeGemotry.setAttribute("uv2",new THREE.BufferAttribute(planeGemotry.attributes.uv.array,2))

// 环境光，四面八方打过来的光
const abmLight = new THREE.AmbientLight(0xFFFFFF,0.5)
sephereGroup.add( abmLight );


// 创建一个小球接收光
const smallBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.1,20,20),
    new MeshBasicMaterial({color:0xff0000})
)
smallBall.position.set(2,2,2)


// 直线光 平行光
const pointLight = new THREE.PointLight( 0xFF0000,1);
pointLight.intensity = 2 // intensity 设置为1和new THREE.SpotLight( 0xFFFFFF,1)设置为1的作用是一样的

// 第二步：设置光照投射阴影、
pointLight.castShadow = true
pointLight.shadow.radius = 20
pointLight.shadow.mapSize.set(4096,4096)

// 注意decay属性需要开启物理光照，设置为true
// renderer.physicallyCorrectLights = true
pointLight.distance = 0
pointLight.decay = 0

// 把点光源添加给小球
smallBall.add(pointLight)

sephereGroup.add( smallBall );
sephereGroup.position.set(0,-60,0)
scene.add(sephereGroup)

let groupList = [cubeGroup,gemoGroup,sephereGroup]




// 鼠标的位置对象
const mouse = new THREE.Vector2()

// 创建投射光线
const raycaster = new THREE.Raycaster()
// 监听鼠标移动位置
window.addEventListener('click',(event)=>{
    mouse.x = (event.clientX/window.innerWidth)*2-1 // 得到一个-1 - 1的数值
    mouse.y = -((event.clientY/window.innerHeight)*2-1)
    // 检测
    raycaster.setFromCamera(mouse,camera)
    let result =  raycaster.intersectObjects(cubeArr)
    console.log(result);
    // result[0].object.material = redMaterial
    result.forEach(item=> {
        item.object.material = redMaterial
    })
})


// 创建gui的控制器
const gui = new dat.GUI();
// 初始化渲染器
const renderer = new THREE.WebGL1Renderer({alpha:true})
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

// 使用渲染器，通过相机将场景渲染
// renderer.render(scene,camera)

// 创建轨道控制器
// const controls = new OrbitControls(camera, renderer.domElement)
// // 设置控制器的阻尼，使其拥有惯性,更加真实，且要在动画循环中更新，在render函数中
// controls.enableDamping = true

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

// 设置每一个组的旋转
gsap.to(cubeGroup.rotation,{
    x:'+='+Math.PI,
    y:'+='+Math.PI,
    z:'+='+Math.PI,
    duration:5,
    ease:'power2.inOut',
    repeat:-1
})
gsap.to(gemoGroup.rotation,{
    x:'-='+Math.PI,
    z:'+='+Math.PI,
    duration:6,
    ease:'power2.inOut',
    repeat:-1
})
gsap.to(smallBall.position,{
    x:-5,
    duration:5,
    ease:'power2.inOut',
    repeat:-1,
    yoyo:true
})
gsap.to(smallBall.position,{
    y:0,
    duration:.5,
    ease:'power2.inOut',
    repeat:-1,
    yoyo:true
})

function render() {
    // render函数会接收一个time参数，实际移动的距离需要根据时间和速度来计算,不能直接加一个固定的数值
    // 可以获取两帧之间的时间差  clock.getElapsedTime()
    // 设置小球随着大球做圆周运动
    let time = clock.getElapsedTime()
    let time2 = clock.getDelta()

    // 这里的rotation会和监听滚动中的冲突
    // cubeGroup.rotation.x = time*0.5
    // cubeGroup.rotation.y = time*0.5
    // gemoGroup.rotation.z = time*0.4
    // gemoGroup.rotation.y = time*0.4

    // smallBall.position.x = Math.sin(time) * 3
    // smallBall.position.y = 2+ Math.sin(time *10)
    // smallBall.position.z = Math.cos(time) * 3

    // sephereGroup.rotation.z = Math.sin(time)*0.05
    // sephereGroup.rotation.x = Math.sin(time)*0.05


    // 根据滚动位置 设置相机移动的位置
    camera.position.y = -(window.scrollY/window.innerHeight)*30
    camera.position.x += (mouse.x * 10 - camera.position.x) * time2 * 5
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

window.addEventListener('mousemove',(event)=>{
    mouse.x = event.clientX / window.innerWidth - 0.5
    mouse.y = event.clientY / window.innerHeight - 0.5
})

// 设置当前页
let currentPage = 0
// 监听滚动事件
window.addEventListener('scroll',()=>{
    const newPage = Math.round(window.scrollY / window.innerHeight)
    if(newPage!==currentPage){
        console.log('页码改变了');
        currentPage = newPage
        gsap.to(groupList[currentPage].rotation,{
            z:'+='+Math.PI*2,
            duration:1,
        })
        // 给每一页的文字加动效
        gsap.to(`.page${currentPage} h1`,{
            rotate:'+=360',
            duration:1,
        })
    }
})


