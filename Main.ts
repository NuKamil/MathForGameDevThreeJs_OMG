import * as THREE from "three";
import { HelpersMath } from "./HelpersMath";
import { HelpersDraw } from "./HelpersDraw";

export class Main {
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;

  constructor() {
    const $container = $("<div>");
    $("body").append($container);

    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(5, 5, 10);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
    const light = new THREE.DirectionalLight(0xffffff, 3);
    this.scene.background = new THREE.Color(0xffffff);

    light.castShadow = true;
    light.position.set(15, 5, 20);
    light.lookAt(0, 0, 0);
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // var controls = new OrbitControls(this.camera, this.renderer.domElement);
    // controls.update();

    $(window).on("resize", this.resize.bind(this));
    $($container).append(this.renderer.domElement);

    this.#init();

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  #init(): void {
    HelpersDraw.addCustomAxes(this.scene);
    HelpersDraw.addAxesLabels(this.scene);
    HelpersDraw.addAxesLines(this.scene);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    // const dt: number = this.clock.getDelta();
    const dt = 0.016;
  }

  //----------------------------------------------------------------------------------------

  #zadanie1() {
    const startPoint = new THREE.Vector3(0, 0, 0);
    const v1 = new THREE.Vector3(2, 3, 0);
    const v2 = new THREE.Vector3(3, 2, 0);

    const v3 = v1.cross(v2);

    HelpersDraw.arrowHelper(
      v1,
      new THREE.Vector3(0, 0, 0),
      0xdd0000,
      this.scene
    );
    HelpersDraw.labelHelper(v1, this.scene, "vec1: ");

    HelpersDraw.arrowHelper(
      v2,
      new THREE.Vector3(0, 0, 0),
      0xdd0000,
      this.scene
    );
    HelpersDraw.labelHelper(v2, this.scene, "vec2: ");

    HelpersDraw.arrowHelper(
      v3,
      new THREE.Vector3(0, 0, 0),
      0xdd0000,
      this.scene
    );
    HelpersDraw.labelHelper(v3, this.scene, "vec3: ");

    // const v3 = v1.clone().add(v2);
    const v4 = v1.clone().sub(v2);
  }

  #zadanie2() {
    const startPoint = new THREE.Vector3(0, 0, 0);
    const v1 = new THREE.Vector3(2, 3, 0);
    const v5 = new THREE.Vector3(5, 3, 0);

    // const v5 = v1.clone().multiplyScalar(2);
    // const v5 = new THREE.Vector3(v1.x * 2, v1.y * 2, v1.z * 2);

    const dotProduct: THREE.Vector3 = HelpersMath.dotProduct(v1, v5);
    // console.log(dotProduct);

    const lengthtV5: number = Math.sqrt(Math.pow(v5.x, 2) + Math.pow(v5.y, 2));
    const v6: THREE.Vector3 = v1.clone().sub(v5);

    HelpersDraw.arrowHelper(v5, startPoint, 0x00ffee, this.scene);
    HelpersDraw.labelHelper(v5, this.scene, "v5: ");

    HelpersDraw.arrowHelper(v1, startPoint, 0xff00ee, this.scene);
    HelpersDraw.labelHelper(v1, this.scene, "v1: ");
  }

  #zadanie3() {
    let vec1 = new THREE.Vector3(2, 2, 0);
    vec1 = HelpersMath.myNormalized(vec1);
    HelpersDraw.arrowHelper(
      vec1,
      new THREE.Vector3(0, 0, 0),
      0xdd0000,
      this.scene
    );
    HelpersDraw.labelHelper(vec1, this.scene, "vec1: ");

    let vec2 = new THREE.Vector3(5, 5, 0);
    HelpersDraw.arrowHelper(
      vec2,
      new THREE.Vector3(0, 0, 0),
      0x0000ff,
      this.scene
    );
    HelpersDraw.labelHelper(vec2, this.scene, "vec2: ");

    let vec3 = new THREE.Vector3(4, 2, 0);
    HelpersDraw.arrowHelper(
      vec3,
      new THREE.Vector3(0, 0, 0),
      0x00aa00,
      this.scene
    );
    HelpersDraw.labelHelper(vec3, this.scene, "vec3: ");

    let distanceV2_V3 = new THREE.Vector3(
      vec3.x - vec2.x,
      vec3.y - vec2.y,
      vec3.z - vec2.z
    );

    HelpersDraw.arrowHelper(
      distanceV2_V3,
      new THREE.Vector3(5, 5, 0),
      0xaa0000,
      this.scene
    );
    HelpersDraw.labelHelper(distanceV2_V3, this.scene, "dist: ");
    let myDot = HelpersMath.dotProduct(vec1, distanceV2_V3);
    console.log(myDot);
  }
}
