precision lowp float; // 定义gpu编译精度
varying vec2 vUv; // 接收顶点着色器传递过来的vUv
varying float deep; // 接收顶点着色器传递过来的deep

uniform sampler2D uTexture; // 设置采样的纹理

void main(){
     float deeps = deep + 0.05*20.0; // 不能直接修改deep的值，定义一个中间变量deeps接收修改的值
     vec4 textureColor = texture2D(uTexture,vUv);
     textureColor.rgb *= deeps;
     gl_FragColor = textureColor;
}