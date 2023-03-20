uniform vec3 uResolution;
void main() {;
  float y = gl_FragCoord.y / uResolution.y;
  gl_FragColor = vec4(1.0, y, y, 1.0);
}