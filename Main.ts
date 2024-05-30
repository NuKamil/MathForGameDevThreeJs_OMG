import * as THREE from "three";
import { HelpersMath } from "./HelpersMath";
import { HelpersDraw } from "./HelpersDraw";
import { ThirdPersonController } from "./ThirdPersonController";

export class Main {
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  thirdPersonController: ThirdPersonController;
  #velocity: THREE.Vector3;
  velocityGoal: THREE.Vector3;
  player: THREE.Mesh;

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
    this.velocityGoal = new THREE.Vector3(0, 0, 0);
    this.#velocity = new THREE.Vector3(0, 0, 0);

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
    this.player = this.#createPlayerGeometry();

    this.thirdPersonController = new ThirdPersonController(this);
    this.#cameraController();
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
    const dt = 0.016;
    // const dt: number = this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);

    this.thirdPersonController.update(dt);

    this.#velocity.x = HelpersMath.myApproach(
      this.velocityGoal.x,
      this.#velocity.x,
      dt * 10
    );

    this.#velocity.z = HelpersMath.myApproach(
      this.velocityGoal.z,
      this.#velocity.z,
      dt * 10
    );

    const vecForward = HelpersMath.myEulerToVector(
      this.player.rotation
    ).normalize();
    // const vecRight = new THREE.Vector3(0, 1, 0).cross(vecForward).normalize();
    const vecRight: THREE.Vector3 = HelpersMath.crossProduct(
      new THREE.Vector3(0, 1, 0),
      vecForward
    ).normalize();

    // Aplikuj prędkości zgodnie z kierunkiem patrzenia i boku
    const velocityVector = new THREE.Vector3(
      vecRight.x * this.#velocity.x + vecForward.x * this.#velocity.z,
      0, // Y-axis is not affected
      vecRight.z * this.#velocity.x + vecForward.z * this.#velocity.z
    );
    console.log(velocityVector);

    this.player.position.add(velocityVector.multiplyScalar(dt));
  }

  //----------------------------------------------------------------------------------------

  #createPlayerGeometry(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(1, 1.5, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    const player = new THREE.Mesh(geometry, material);
    player.position.y = 1;
    // player.rotation.set(0, Math.PI / 2, 0);

    this.scene.add(player);
    return player;
  }

  #cameraController(): void {
    const pivot = new THREE.Object3D();
    pivot.position.set(0, 1, 10);

    const yaw: THREE.Object3D = new THREE.Object3D();
    const pitch: THREE.Object3D = new THREE.Object3D();

    this.scene.add(pivot);
    pivot.add(yaw);
    yaw.add(pitch);
    pitch.add(this.camera);
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
