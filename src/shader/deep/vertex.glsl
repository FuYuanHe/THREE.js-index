precision lowp float; // 声明gpu低精度 一般放在程序最前面
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv; // 将顶点着色器的信息传递给片元着色器



void main(){
    vUv = uv;
    vec4 modelPosition = modelMatrix *vec4(position,1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}