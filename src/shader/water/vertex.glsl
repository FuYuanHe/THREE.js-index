precision lowp float;
uniform float uWaresFrequency;
uniform float uScale;
uniform float uXzScale;
uniform float uNoiseFrequency;
uniform float uNoiseScale;
uniform float uTime;
uniform float uXspeed;
uniform float uZspeed;
uniform float uNoiseSpeed;
uniform float uOpacity;

varying float vElevation;
#define PI 3.1415926535897932384626433832795

// 随机函数
float random (vec2 st){
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

vec4 permute(vec4 x){
        return mod(((x*34.0)+1.0)*x,289.0);
}

vec2 fade(vec2 t){
        return t*t*t*(t*(t*6.0-15.0)+10.0);
}


float cnoise(vec2 p){
        vec4 pi = floor(p.xyxy) + vec4(0.0,0.0,1.0,1.0);
        vec4 pf = fract(p.xyxy) - vec4(0.0,0.0,1.0,1.0);
        pi = mod(pi,289.0);
        vec4 ix = pi.xzxz;
        vec4 iy = pi.yyww;
        vec4 fx = pf.xzxz;
        vec4 fy = pf.yyww;
        vec4 i = permute(permute(ix)+iy);
        vec4 gx = 2.0 * fract(i*0.0243902439) - 1.0;
        vec4 gy = abs(gx) - 0.5;
        vec4 tx = floor(gx + 0.5);
        gx = gx -tx;
        vec2 g00 = vec2(gx.x,gy.x);
        vec2 g10 = vec2(gx.y,gy.y);
        vec2 g01 = vec2(gx.z,gy.z);
        vec2 g11 = vec2(gx.w,gy.w);
        vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00,g00),dot(g01,g01),dot(g10,g10),dot(g11,g11));
        g00 *= norm.x;
        g01 *= norm.y;
        g10 *= norm.z;
        g11 *= norm.w;
        float n00 = dot(g00,vec2(fx.x,fy.x));
        float n10 = dot(g10,vec2(fx.y,fy.y));
        float n01 = dot(g01,vec2(fx.z,fy.z));
        float n11 = dot(g11,vec2(fx.w,fy.w));
        vec2 fade_xy = fade(pf.xy);
        vec2 n_x = mix(vec2(n00,n01),vec2(n10,n11),fade_xy.x);
        float n_xy = mix(n_x.x,n_x.y,fade_xy.y);
        return 2.3 * n_xy;
}   


void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    float elevation = sin(modelPosition.x*uWaresFrequency+uTime*uXspeed)*sin(modelPosition.z*uWaresFrequency*uXzScale+uTime*uZspeed);
    elevation += -abs(cnoise(vec2(modelPosition.xz*uNoiseFrequency+uTime*uNoiseSpeed)))*uNoiseScale;
    vElevation = elevation;
    elevation *= uScale;
    
    modelPosition.y += elevation;
    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}