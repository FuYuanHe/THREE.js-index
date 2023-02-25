precision lowp float; // 定义gpu编译精度
varying vec2 vUv; // 接收顶点着色器传递过来的vUv
varying float deep; // 接收顶点着色器传递过来的deep

void main(){
     float deeps = deep + 0.05*10.0; // 不能直接修改deep的值，定义一个中间变量deeps接收修改的值
     gl_FragColor = vec4(0.0,1.0*deeps,0.0,1.0);
}