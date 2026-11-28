/**
 * « L'onde » — still water at dawn, seen from just above it, and a rain that falls in a grid:
 * the 25 points of Proxy's presence, each one a drop. Nothing here is a photograph or a 3D file:
 * the picture is computed for every pixel, every frame (a ray to the water, the slope of the rings
 * under it, the sky that slope reflects). One fragment shader, WebGL 1.
 *
 * World: x to the right, y away from the camera, z up, in metres.
 */

export const VERT = /* glsl */ `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0., 1.); }
`;

export const FRAG = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;      // the drawing buffer, in pixels
uniform float uT;       // seconds
uniform vec4 uD[25];    // per point of the grid: when its last two drops fell, and how heavy each was
uniform vec4 uCam;      // camera: y, z, the y it looks at, tan(half the vertical field)
uniform vec2 uLens;     // lens shift (the horizon's place in the frame), sideways offset of the view
uniform float uLamp;    // the far light: 0 off, 1 on
uniform float uSeed;    // the grain's frame

const float PI = 3.14159265;
const float PITCH = 0.62;   // metres between two drops
const float AHEAD = 0.45;   // how far in front of the camera's foot the grid is centred
const float LIFE = 2.6;     // seconds a ring lasts
const float SPEED = 0.17;   // metres a second
const vec3 DEEP = vec3(0.006, 0.008, 0.011);
const vec3 LAMP = vec3(0.98, 0.105, 0.022);   // the product's orange, lit

float hash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float hash1(float x) { return fract(sin(x * 127.1) * 43758.5453); }

// value noise and its slope
vec3 noised(vec2 x) {
  vec2 i = floor(x), f = fract(x);
  vec2 u = f * f * f * (f * (f * 6. - 15.) + 10.);
  vec2 du = 30. * f * f * (f * (f - 2.) + 1.);
  float a = hash(i), b = hash(i + vec2(1., 0.)), c = hash(i + vec2(0., 1.)), d = hash(i + vec2(1., 1.));
  return vec3(a + (b - a) * u.x + (c - a) * u.y + (a - b - c + d) * u.x * u.y, du * (vec2(b - a, c - a) + (a - b - c + d) * u.yx));
}
float noise1(float x) { float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(hash1(i), hash1(i + 1.), f); }

// the slope of one ring, along its radius: a packet of short waves that travels, opens and dies.
// fp: what a pixel covers on the water along that radius. Waves finer than that are not drawn: they would only shimmer
float ring(float r, float age, float amp, float fp) {
  if (amp <= 0. || age <= 0. || age >= LIFE) return 0.;
  float R = 0.010 + SPEED * age;
  float w = 0.011 + 0.040 * age;
  float q = (r - R) / w;
  if (abs(q) > 2.6) return 0.;
  float lam = 0.018 + 0.016 * age;
  float A = amp * 0.0026 * smoothstep(0., 0.06, age) * exp(-age * 0.95) * (1. - smoothstep(LIFE * 0.55, LIFE, age)) / sqrt(0.30 + age);
  float ph = 2. * PI * (r - R) / lam;
  float keep = exp(-pow(1.9 * fp / lam, 2.));
  // (a slope has no direction at the very centre: it has to be flat there)
  return A * exp(-q * q) * (-2. * q / w * cos(ph) * exp(-pow(0.9 * fp / w, 2.)) - 2. * PI / lam * sin(ph) * keep) * smoothstep(0., 0.014, r);
}

// fx, fy: what one pixel covers on the water, across the view and along it (much more, at a low angle)
vec2 slope(vec2 p, vec2 along, float fx, float fy) {
  vec2 g = vec2(0.);
  // the rain
  p.y -= AHEAD;
  if (abs(p.x) < 2.0 && abs(p.y) < 2.0) {
    vec2 across = vec2(-along.y, along.x);
    for (int k = 0; k < 25; k++) {
      int row = k / 5;
      vec2 c = vec2(float(k - 5 * row) - 2., 2. - float(row)) * PITCH;
      vec2 v = p - c;
      float r2 = dot(v, v);
      if (r2 > 0.52) continue;
      vec4 d = uD[k];
      float r = sqrt(r2) + 1e-5;
      vec2 e = v / r;
      float fp = length(vec2(dot(e, along) * fy, dot(e, across) * fx));
      g += (ring(r, uT - d.x, d.y, fp) + ring(r, uT - d.z, d.w, fp)) * e;
    }
  }
  p.y += AHEAD;
  // a breath of wind: the mirror is never perfect
  float far = exp(-pow(fy / 0.06, 2.));
  vec2 s1 = vec2(1.9, 0.8);
  g += 0.0060 * noised(p * s1 + vec2(uT * 0.05, uT * 0.021)).yz * s1 * far;
  vec2 s2 = vec2(5.3, 2.3);
  g += 0.0011 * noised(p * s2 - vec2(uT * 0.07, uT * 0.03) + 7.3).yz * s2 * exp(-pow(fy / 0.02, 2.));
  return g;
}

const vec3 GLOW = vec3(-0.3254, 0.9297, 0.1720);   // a clearing low in the sky, ahead and a little to the left
const float LAMP_AZ = 0.118;
const float LAMP_EL = 0.0052;

vec3 sky(vec3 d) {
  float up = abs(d.z);
  vec3 c = up < 0.085 ? mix(vec3(0.86, 0.89, 0.93), vec3(0.56, 0.60, 0.65), up / 0.085)
         : up < 0.30 ? mix(vec3(0.56, 0.60, 0.65), vec3(0.19, 0.21, 0.245), (up - 0.085) / 0.215)
         : mix(vec3(0.19, 0.21, 0.245), vec3(0.06, 0.07, 0.085), (up - 0.30) / 0.70);
  float az = atan(d.x, d.y);
  // the far shore: two lines of hills lost in the mist, the nearer one a little darker. Their feet are in it: no waterline
  float mist = 0.42 + 0.58 * smoothstep(0.0006, 0.0062, up);
  float back = 0.0075 + 0.020 * (0.6 * noise1(az * 5. + 31.) + 0.4 * noise1(az * 13. + 2.));
  c = mix(c, vec3(0.585, 0.615, 0.655), smoothstep(-0.0022, 0.0022, back - up) * 0.9 * mist);
  float line = 0.0030 + 0.015 * (0.55 * noise1(az * 9.) + 0.30 * noise1(az * 23. + 4.) + 0.15 * noise1(az * 61. + 9.));
  c = mix(c, vec3(0.40, 0.424, 0.456), smoothstep(-0.0016, 0.0016, line - up) * 0.92 * mist);
  c += pow(max(dot(normalize(vec3(d.xy, up)), GLOW), 0.), 30.) * vec3(0.78, 0.78, 0.765);
  // one light on the far shore, when Proxy has stopped
  if (uLamp > 0.) {
    vec2 o = vec2(az - LAMP_AZ, up - LAMP_EL);
    float l = dot(o, o);
    c = mix(c, LAMP, uLamp * 0.62 * exp(-sqrt(l) / 0.0075));
    c = mix(c, vec3(1.9, 1.05, 0.62), uLamp * exp(-l / 0.0000011));
  }
  return c;
}

// Khronos PBR Neutral: it keeps a colour's hue as it brightens
vec3 neutral(vec3 c) {
  float x = min(c.r, min(c.g, c.b));
  float off = x < 0.08 ? x - 6.25 * x * x : 0.04;
  c -= off;
  float peak = max(c.r, max(c.g, c.b));
  if (peak < 0.76) return c;
  float d = 0.24;
  float np = 1. - d * d / (peak + d - 0.76);
  c *= np / peak;
  float g = 1. - 1. / (0.15 * (peak - np) + 1.);
  return mix(c, vec3(np), g);
}

// the ray through a point of the frame, for a camera that stands at ro
vec3 ray(vec2 frag, vec3 ro) {
  vec3 f = normalize(vec3(uLens.y, uCam.z, 0.) - ro);
  vec3 rt = normalize(cross(f, vec3(0., 0., 1.)));
  vec3 up = cross(rt, f);
  vec2 q = (frag - 0.5 * uRes) / (0.5 * uRes.y);
  return normalize(f + uCam.w * (q.x * rt + (q.y + uLens.x) * up));
}

// the water under one ray: the slope it meets, the sky that slope sends back
vec3 water(vec3 ro, vec3 rd, float sub) {
  float t = -ro.z / rd.z;
  vec2 p = ro.xy + t * rd.xy;
  float fx = t * 2. * uCam.w / uRes.y;
  vec2 g = slope(p, normalize(rd.xy), fx, fx / max(-rd.z, 0.02) / sub);
  vec3 n = normalize(vec3(-g, 1.));
  vec3 rr = reflect(rd, n);
  rr.z = abs(rr.z);
  float fres = 0.02 + 0.98 * pow(1. - max(dot(n, -rd), 0.), 5.);
  vec3 c = mix(DEEP, sky(rr), fres);
  // the far light lies on the water as a thin line that the wind breaks into dashes, and the rings scatter
  if (uLamp > 0.) {
    float az = atan(rr.x, rr.y) - LAMP_AZ;
    float el = rr.z - LAMP_EL;
    float sig = 0.0021 + 0.011 * max(el, 0.);
    float dash = smoothstep(0.34, 0.60, noised(vec2(p.x * 5., log(t) * 7.5 - uT * 0.16)).x);
    float a = exp(-az * az / (sig * sig)) * exp(-max(el, 0.) / 0.052) * smoothstep(-0.003, 0.002, el) * mix(1., dash, smoothstep(0.012, 0.07, el));
    c = mix(c, LAMP, uLamp * min(a * 1.15, 0.94));
  }
  // haze: the far water goes to the colour of the air
  return mix(c, vec3(0.80, 0.83, 0.87), 0.55 * (1. - exp(-t * 0.0045)));
}

vec3 shade(vec2 frag) {
  vec3 ro = vec3(uLens.y, uCam.x, uCam.y);
  vec3 rd = ray(frag, ro);
  if (rd.z > -0.0006) return sky(rd);
  // seen from this low, one pixel covers several centimetres of water in depth, more than a ring's wave:
  // where the rain falls, the pixel is cut into up to four slices, top to bottom
  float t = -ro.z / rd.z;
  vec2 p = ro.xy + t * rd.xy;
  float fy = t * 2. * uCam.w / uRes.y / max(-rd.z, 0.02);
  float n = 1.;
  if (abs(p.x) < 1.9 && abs(p.y - AHEAD) < 1.9) n = clamp(ceil(fy / 0.0045), 1., 4.);
  if (n < 1.5) return water(ro, rd, 1.);
  vec3 c = vec3(0.);
  for (int j = 0; j < 4; j++) {
    if (float(j) >= n) break;
    c += water(ro, ray(frag + vec2(0., (float(j) + 0.5) / n - 0.5), ro), n);
  }
  return c / n;
}

void main() {
  vec3 c = shade(gl_FragCoord.xy);
  vec2 uv = gl_FragCoord.xy / uRes;
  // the lens: a little darker in the corners
  vec2 v = uv - 0.5;
  c *= 1. - 0.42 * dot(v, v);
  c = neutral(c);
  c = pow(max(c, 0.), vec3(1. / 2.2));
  // film grain, heavier in the mid-tones
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  float n = hash(gl_FragCoord.xy + uSeed * 17.31) + hash(gl_FragCoord.yx * 1.37 + uSeed * 5.7) - 1.;
  c += n * 0.022 * (0.35 + 1.3 * l * (1. - l) * 2.);
  gl_FragColor = vec4(c, 1.);
}
`;

/** The presence at work, frame by frame, as the product draws it: 'a' lit, 'h' half lit. */
export const WORK = ['..a...aha.ahaha.aha...a..', '.....a...a..a..a...a.....', '..h...aaa.hahah.aaa...h..', '.a.a.a...a..a..a...a.a.a.'];
/** Waiting: the four points of the request screen. Stopped: the cross of the pause screen. */
export const WAIT = '......a.a.......a.a......';
export const STOP = 'a...a.a.a...a...a.a.a...a';

/**
 * How the camera stands for a frame of a given shape (width / height): [y, z, the y it looks at, tan(half field), lens shift].
 * Wide: a longer lens, low over the water, the grid in the lower half under a high horizon.
 * Tall: a wider lens, higher over the water, so the grid stays whole, the horizon stays in the frame and the lower third is left dark and calm.
 */
export function camera(aspect: number): [number, number, number, number, number] {
  const k = Math.min(1, Math.max(0, (aspect - 0.8) / (16 / 9 - 0.8)));
  const lerp = (a: number, b: number) => a + (b - a) * k;
  const tan = lerp(0.47, 0.2896);
  // the near row of drops takes about two thirds of the frame's width
  const dist = 1.24 / (lerp(0.78, 0.67) * tan * Math.min(aspect, 16 / 9));
  const dep = (lerp(23.3, 20.1) * Math.PI) / 180;
  const z = dist * Math.sin(dep);
  const y = 0.45 - 1.24 - dist * Math.cos(dep);
  const pitch = (lerp(19.6, 14.6) * Math.PI) / 180;
  return [y, z, y + z / Math.tan(pitch), tan, lerp(0.205, 0.373)];
}

/**
 * The same water from very close and very low: one column of the rain, ring after ring, going off towards the light.
 * No horizon in this one. [y, z, the y it looks at, tan(half field), lens shift]
 */
export const CLOSE: [number, number, number, number, number] = [-0.3, 0.34, 0.8, 0.24, 0.1];
