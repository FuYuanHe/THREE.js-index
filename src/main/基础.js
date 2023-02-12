import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'

// 创建相机
const scene = new THREE.Scene()
// 创建场景
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

// 设置位置
camera.position.set(0,0,10)

// 把相机加到页面
scene.add(camera)

// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1,1,1)
// 材质
const cubeMaterial = new THREE.MeshBasicMaterial({color:0xffff00})
// 创建物体,根据材质和几何体
const cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
console.log('cube',cube);


// 可以在这里单独修改cube物体的位置和缩放旋转
// cube.scale.set(3,2,1)
// rotation
cube.rotation.set(Math.PI /4,0,0)

// 将几何体添加到场景中
scene.add(cube)


// 创建gui的控制器
const gui = new dat.GUI();
gui.add(cube.position,"y").min(0).max(5).step(0.01).name('Y轴').onChange((value)=>{
    console.log('值被修改了');
}).onFinishChange(value => {
    console.log('停下来的时候会触发');
})
const params = {
    color:'#bfa',
    fn:()=> {
        // 点击使得物体移动
        gsap.to(cube.position,{x:5,duration:5,repeat:-1,yoyo:true,ease:"power1.inOut"})
    }
}
// 添加颜色
gui.addColor(params,"color").onChange(value=> {
    console.log(value);
    cube.material.color.set(value)
})


// 添加一个文件夹
let floder = gui.addFolder("设置物体")
floder.add(cube.material,"wireframe")
// 设置单选框
floder.add(cube,"visible").name('是否显示')
// 加个按钮，点击触发某个事件
floder.add(params,"fn").name('按钮')



// 初始化渲染器
const renderer = new THREE.WebGL1Renderer()
// 设置渲染器的尺寸
renderer.setSize(window.innerWidth,window.innerHeight)

// 将webgl渲染的canvas内容插入页面中
document.body.appendChild(renderer.domElement)

// 使用渲染器，通过相机将场景渲染
// renderer.render(scene,camera)

// 创建轨道控制器
const controls = new OrbitControls(camera,renderer.domElement)
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

window.addEventListener('dblclick',()=>{
    // 设置双击全屏和退出全屏
    // 渲染器的dom元素请求全屏
    if(document.fullscreenElement){
        // 注意退出全屏是在document上执行
        document.exitFullscreen()
        // renderer.domElement
    }else{
        renderer.domElement.requestFullscreen()
    }
    
    // 设置双击暂停和重启
    // if(animate1.isActive()){
    //     animate1.pause()
    // }else{
    //     animate1.resume()
    // }
})

function render(){
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
    controls.update()
    renderer.render(scene,camera)
    // 请求关键帧，下一帧的时候会继续调用render函数
    requestAnimationFrame(render)
}

render()

// 监听画面的变化，如浏览器窗口变大变小，重新渲染画面
window.addEventListener('resize',()=>{
    // 更新摄像镜头
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix()
    // 更新渲染器的宽高
    renderer.setSize(window.innerWidth,window.innerHeight)
    // 设置渲染器的像素比例
    renderer.setPixelRatio(window.devicePixelRatio)
})


