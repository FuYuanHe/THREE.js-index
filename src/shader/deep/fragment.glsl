precision lowp float; // 定义gpu编译精度
varying vec2 vUv; // 接收顶点着色器传递过来的vUv
uniform float uTime;

// 随机函数
float random(vec2 st){
     return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
// 旋转函数
vec2 rotate(vec2 uv,float rotation ,vec2 mid){
     return vec2(
          cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
          cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
     );
}
// 噪音函数
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


void main(){
     // 实现彩色
     // gl_FragColor = vec4(vUv,1.0,1.0);

     // 实现渐变
     // gl_FragColor = vec4(vUv.x,vUv.x,vUv.x,1.0);

     // 使用变量 黑白渐变从左到右
     // float deeps = vUv.x;
     // gl_FragColor = vec4(deeps,deeps,deeps,1.0);

     // 黑白渐变从下到上
     // float deeps = vUv.y;
     // gl_FragColor = vec4(deeps,deeps,deeps,1.0);

     // 黑白渐变从上到下
     // float deeps = 1.0 - vUv.y;
     // gl_FragColor = vec4(deeps,deeps,deeps,1.0);

     // 黑白巨变
     // float deeps = 1.0 - vUv.y*10.0;
     // float deeps = vUv.y*10.0;
     // gl_FragColor = vec4(deeps,deeps,deeps,1.0);

     // 取模实现反复的效果 实现百叶窗效果
     // float deeps = mod(vUv.y*10.0,1.0);
     // gl_FragColor = vec4(deeps,deeps,deeps,1.0);

     // step实现反复的效果 实现百叶窗效果.实现黑白百叶窗
     // float deeps = step(mod(vUv.y*10.0,1.0),0.4);
     // float deeps = step(0.4,mod(vUv.y*10.0,1.0));
     // // deeps += step(0.4,mod(vUv.x*10.0,1.0));
     // gl_FragColor = vec4(deeps,deeps,deeps,1.0);

     // 实现条纹堆叠的效果 窗口的效果
     // float deeps = step(0.4,mod(vUv.y*10.0,1.0));
     // deeps += step(0.4,mod(vUv.x*10.0,1.0));
     // gl_FragColor = vec4(deeps,deeps,deeps,1.0);

     // 条纹相乘或相减 实现条纹或者方块窗户效果，调整‘0.8’
     // float deeps = step(0.8,mod(vUv.x*10.0,1.0));
     // deeps -= step(0.8,mod(vUv.y*10.0,1.0));
     // gl_FragColor = vec4(deeps,deeps,deeps,1.0);

     // 两个堆叠条纹实现7字形的图案
     // float deeps1 = step(0.4,mod(vUv.x*10.0,1.0)) * step(0.8,mod(vUv.y*10.0,1.0));
     // float deeps2 = step(0.4,mod(vUv.y*10.0,1.0)) * step(0.8,mod(vUv.x*10.0,1.0));
     // float deeps = deeps1 + deeps2; // deeps最后也是一个0-1的值
     // gl_FragColor = vec4(deeps,deeps,deeps,1.0);

     // 得到炫彩图形
     // float deeps1 = step(0.4,mod((vUv.x) * 10.0,1.0)) * step(0.8,mod(vUv.y*10.0,1.0));
     // float deeps2 = step(0.4,mod((vUv.y) * 10.0,1.0)) * step(0.8,mod(vUv.x*10.0,1.0));
     // float deeps = deeps1 + deeps2; // deeps最后也是一个0-1的值
     // gl_FragColor = vec4(vUv,1,deeps);

     // 得到炫彩可移动图形
     // float deeps1 = step(0.4,mod((vUv.x +uTime*0.1) * 10.0,1.0)) * step(0.8,mod((vUv.y)*10.0,1.0));
     // float deeps2 = step(0.4,mod((vUv.y +uTime*0.1) * 10.0,1.0)) * step(0.8,mod((vUv.x)*10.0,1.0));
     // float deeps = deeps1 + deeps2; // deeps最后也是一个0-1的值
     // gl_FragColor = vec4(vUv,1,deeps);

          // 得到炫彩可整体移动图形
     // float deeps1 = step(0.4,mod((vUv.x +uTime*0.1) * 10.0,1.0)) * step(0.8,mod((vUv.y +uTime*0.1)*10.0,1.0));
     // float deeps2 = step(0.4,mod((vUv.y +uTime*0.1) * 10.0,1.0)) * step(0.8,mod((vUv.x +uTime*0.1)*10.0,1.0));
     // float deeps = deeps1 + deeps2; // deeps最后也是一个0-1的值
     // gl_FragColor = vec4(vUv,1,deeps);


     // 得到可移动的T字形
     // float deeps1 = step(0.4,mod((vUv.x +uTime*0.1) * 10.0-0.2,1.0)) * step(0.8,mod((vUv.y +uTime*0.1)*10.0,1.0));
     // float deeps2 = step(0.4,mod((vUv.y +uTime*0.1) * 10.0,1.0)) * step(0.8,mod((vUv.x +uTime*0.1)*10.0,1.0));
     // float deeps = deeps1 + deeps2; // deeps最后也是一个0-1的值
     // gl_FragColor = vec4(vUv,1,deeps);

     // 利用绝对值把负数消掉
     // float deeps = abs(vUv.x-0.5);
     // gl_FragColor = vec4(deeps,deeps,deeps,1);

     // 取较小值，得到十字
     // float deeps = min(abs(vUv.x-0.5),abs(vUv.y-0.5));
     // gl_FragColor = vec4(deeps,deeps,deeps,1);

     // 取最大值 得到黑x
     // float deeps = max(abs(vUv.x-0.5),abs(vUv.y-0.5));
     // gl_FragColor = vec4(deeps,deeps,deeps,1);

     // 结合step，得到框或者一个大正方形
     // float deeps = step(max(abs(vUv.x-0.5),abs(vUv.y-0.5)),0.3);
     // gl_FragColor = vec4(deeps,deeps,deeps,1);

     // 尝试floor实现波纹效果
     // float deeps = 1.0-(floor(vUv.y*10.0)/10.0);
     // gl_FragColor = vec4(deeps,deeps,deeps,1);

     // 得到渐变格子
     // float deeps =(ceil(vUv.y*10.0)/10.0) *(ceil(vUv.x*10.0)/10.0) ;
     // gl_FragColor = vec4(deeps,deeps,deeps,1);


     // 设置随机效果
     // float deeps = random(vUv);
     // gl_FragColor = vec4(deeps,deeps,deeps,1);

     // 设置随机加格子 马赛克效果 
     // float deeps =(ceil(vUv.y*10.0)/10.0) *(ceil(vUv.x*10.0)/10.0) ;
     // deeps = random(vec2(deeps,deeps));
     // gl_FragColor = vec4(deeps,deeps,deeps,1);

     // 使用length
     // float deeps = length(vUv);
     // gl_FragColor = vec4(deeps,deeps,deeps,1);


     // 使用distance 计算两个向量的距离
     // float deeps = distance(vUv,vec2(0.5,0.5));
     // gl_FragColor = vec4(deeps,deeps,deeps,1);

     // 使用distance 实现星星点灯的效果
     // float deeps = 0.15/distance(vUv,vec2(0.5,0.5))-1.0;
     // gl_FragColor = vec4(deeps,deeps,deeps,deeps);


     // 星星上升效果,星星拉扁
     // float deeps = 0.15/distance(vec2(vUv.x,(vUv.y-0.5)*5.0),vec2(0.5,0.5))-1.0;
     // gl_FragColor = vec4(deeps,deeps,deeps,1);

     // 实现十字交叉发光星星
     // float deeps = 0.15/distance(vec2(vUv.x,(vUv.y-0.5)*5.0+0.5),vec2(0.5,0.5))-1.0;
     // // deeps *= 0.15/distance(vec2(vUv.y,(vUv.x-0.5)*5.0+0.5),vec2(0.5,0.5))-1.0;
     // deeps += 0.15/distance(vec2(vUv.y,(vUv.x-0.5)*5.0+0.5),vec2(0.5,0.5))-1.0;
     // gl_FragColor = vec4(deeps,deeps,deeps,deeps);


     // 实现选装的飞镖
     // vec2 rotateUv = rotate(vUv,uTime*10.0,vec2(0.5));
     // float deeps = 0.15/distance(vec2(rotateUv.x,(rotateUv.y-0.5)*5.0+0.5),vec2(0.5,0.5))-1.0;
     // deeps += 0.15/distance(vec2(rotateUv.y,(rotateUv.x-0.5)*5.0+0.5),vec2(0.5,0.5))-1.0;
     // gl_FragColor = vec4(deeps,deeps,deeps,deeps);

     // 绘制一个圆 和反圆
     // float deeps =  step(0.5,distance(vUv,vec2(0.5,0.5))+0.25);
     // float deeps =  step(distance(vUv,vec2(0.5,0.5))+0.25,0.5);
     // gl_FragColor = vec4(deeps,deeps,deeps,1);

     // 实现圆环效果1
     // float deeps =  step(0.5,distance(vUv,vec2(0.5,0.5)) + 0.35);
     // deeps *= 1.0-(step(0.5,distance(vUv,vec2(0.5,0.5)) + 0.15));
     // gl_FragColor = vec4(deeps,deeps,deeps,1);

     // 实现圆环效果2
     // float deeps = abs(distance(vUv,vec2(0.5,0.5)) - 0.35);

     // 实现圆环效果3
     // float deeps = step(0.1,abs(distance(vUv,vec2(0.5,0.5)) - 0.25));
     
     // 实现随意图形
     // vec2 waveUv  = vec2 (
     //      vUv.x + sin(vUv.y*30.0)*0.1,
     //      vUv.y + sin(vUv.x*30.0)*0.1
     // );
     // float deeps = step(abs(distance(waveUv,vec2(0.5,0.5)) - 0.25),0.01);

     // 根据角度显示视图
     // float deeps = atan(vUv.x,vUv.y);

     // 根据角度实现螺旋渐变，用在雷达图,颜色从深到浅正好一圈
     // float deep = atan(vUv.x-0.5,vUv.y-0.5);
     // float deeps = (deep+3.14)/6.28;

     // 实现雷达扫射，在之前的基础之上增加圆型图
     // float deep = atan(vUv.x-0.5,vUv.y-0.5);
     // float deeps = (deep+3.14)/6.28;
     // float alpha = 1.0 - step(0.5,distance(vUv,vec2(0.5,0.5)));

     // 实现雷达动态旋转
     // vec2 rotateUv = rotate(vUv,-uTime*5.0,vec2(0.5));
     // float deep = atan(rotateUv.x-0.5,rotateUv.y-0.5);
     // float deeps = (deep+3.14)/6.28;
     // float alpha = 1.0 - step(0.5,distance(vUv,vec2(0.5)));

     // 做万花筒的效果
     // vec2 rotateUv = rotate(vUv,-uTime*2.0,vec2(0.5));
     // float deep = atan(rotateUv.x-0.5,rotateUv.y-0.5)/6.28;
     // float deeps = mod(deep*10.0,1.0);
     float alpha = 1.0 - step(0.5,distance(vUv,vec2(0.5)));

     // 黑白万花筒
     // vec2 rotateUv = rotate(vUv,-uTime*2.0,vec2(0.5));
     // float deep = atan(vUv.x-0.5,vUv.y-0.5)/6.28;
     // float deeps = sin(deep*100.0);

     // 噪声质感
     float deep = noise(vUv*50.0);

     // 配合step实现黑白
     // float deeps = step(0.4,deep);

     // 实现发光效果（尝试），这个噪声函数实现不了
     float deeps = 1.0 - abs(deep);


     gl_FragColor = vec4(deeps,deeps,deeps,1.0);
}