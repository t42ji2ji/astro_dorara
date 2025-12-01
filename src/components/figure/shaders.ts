export const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const fragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uHover;
uniform float uTime;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Calculate offset based on mouse position and hover state
  vec2 offset = (uMouse - 0.5) * 0.02 * uHover;

  // RGB chromatic aberration - split channels
  float r = texture2D(uTexture, uv + offset).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv - offset).b;

  // Get original alpha
  float a = texture2D(uTexture, uv).a;

  gl_FragColor = vec4(r, g, b, a);
}
`
