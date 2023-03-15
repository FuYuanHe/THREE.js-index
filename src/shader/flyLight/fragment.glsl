precision lowp float; // 定义gpu编译精度
varying vec2 vUv; // 接收顶点着色器传递过来的vUv

varying vec4 vPosition;
varying vec3 gPosition;

void main(){ 
     vec4 redcolor = vec4(1,0,0,1);
     vec4 yelcolor = vec4(1,1,0,1);
     vec4 mixColor = mix(yelcolor,redcolor,gPosition.y/1.0);
     // gl_FragColor = vec4(mixColor.xyz,1);
     if(gl_FrontFacing){
          gl_FragColor = vec4(mixColor.xyz - (vPosition.y-20.0)/60.0-0.1 ,1);
     }else{
          gl_FragColor = vec4(mixColor.xyz,1);
     };
}