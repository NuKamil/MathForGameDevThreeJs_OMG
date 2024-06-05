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
  pivot: THREE.Object3D;
  yaw: THREE.Object3D;
  pitch: THREE.Object3D;
  euler: THREE.Euler;
  quaternion: THREE.Quaternion;
  v: THREE.Vector3;
  bilbord: THREE.Mesh;
  enemies: THREE.Mesh;
  helperArrowBilbord_F: THREE.Vector3;
  helperArrowBilbord_R: THREE.Vector3;
  helperArrowBilbord_U: THREE.Vector3;
  helperArrowPlayerDir: THREE.Vector3;
  rotationMatrix: THREE.Matrix4;
  playerDirection: THREE.Vector3;
  matrix4x4: THREE.Matrix4;
  cameraDirection: THREE.Vector3;
  enemiesArr: THREE.Mesh[] = [];
  enemiesArrowDir: THREE.ArrowHelper[] = [];
  randomPos: THREE.Vector3;

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

    this.pivot = new THREE.Object3D();
    this.yaw = new THREE.Object3D();
    this.pitch = new THREE.Object3D();
    this.v = new THREE.Vector3();
    this.cameraDirection = new THREE.Vector3();

    this.helperArrowBilbord_F = new THREE.Vector3();
    this.helperArrowBilbord_R = new THREE.Vector3();
    this.helperArrowBilbord_U = new THREE.Vector3();

    this.playerDirection = new THREE.Vector3();
    this.helperArrowPlayerDir = new THREE.Vector3();

    this.matrix4x4 = new THREE.Matrix4();
    this.rotationMatrix = new THREE.Matrix4();

    this.euler = new THREE.Euler();
    this.quaternion = new THREE.Quaternion();

    this.camera.position.set(0, 2, 3);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
    const light: THREE.DirectionalLight = new THREE.DirectionalLight(
      0xffffff,
      3
    );
    this.scene.background = new THREE.Color(0xffffff);

    this.scene.add(new THREE.GridHelper(30, 30));
    light.castShadow = true;
    light.position.set(15, 5, 20);
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    $(window).on("resize", this.resize.bind(this));
    $($container).append(this.renderer.domElement);

    this.#init();
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  #init(): void {
    this.player = this.#createPlayerGeometry();

    this.thirdPersonController = new ThirdPersonController(this);

    this.pivot.position.set(0, 5, 10);

    this.scene.add(this.pivot);
    this.pivot.add(this.yaw);
    this.yaw.add(this.pitch);
    this.pitch.add(this.camera);

    this.bilbord = this.#bilbordGeometry();

    for (let i = 0; i <= 10; i++) {
      this.enemies = this.#createRandomGeometries();
      this.enemiesArr.push(this.enemies);
    }

    const enemieScaleMatrix: THREE.Matrix4 = new THREE.Matrix4().makeScale(
      5,
      5,
      5
    );
    this.enemiesArr.forEach((enemie, i) => {
      if (i === 2) {
        enemie.position.set(0, 0, 0);
        enemie.applyMatrix4(enemieScaleMatrix);
        enemie.position.copy(this.randomPos);
      }
    });

    // const autodescCube = this.#createChamferedCube(10, 2);

    HelpersDraw.addCustomAxes(this.scene);
    HelpersDraw.addAxesLabels(this.scene);
    HelpersDraw.addAxesLines(this.scene);

    // const F: THREE.Vector3 = this.player.position
    //   .clone()
    //   .sub(this.bilbord.position);

    this.helperArrowBilbord_F = HelpersDraw.arrowHelper(
      new THREE.Vector3(),
      this.bilbord.position,
      0x0000ff,
      this.scene
    );

    this.helperArrowBilbord_R = HelpersDraw.arrowHelper(
      new THREE.Vector3(),
      this.bilbord.position,
      0xdd0000,
      this.scene
    );

    this.helperArrowBilbord_U = HelpersDraw.arrowHelper(
      new THREE.Vector3(),
      this.bilbord.position,
      0x00ff00,
      this.scene
    );

    // this.enemiesArr.forEach((enemie) => {
    //   if (enemie) {
    //     this.helperArrowPlayerDir = HelpersDraw.arrowHelper(
    //       this.player.position,
    //       enemie.position,
    //       0x0000dd,
    //       this.scene
    //     );
    //     this.enemiesArrowDir.push(this.helperArrowPlayerDir);
    //   }
    // });

    // console.log(this.enemiesArrowDir);

    // do celów pomocniczych
  }

  resize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(): void {
    const dt: number = 0.016;
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

    this.camera.getWorldDirection(this.cameraDirection).normalize();
    this.cameraDirection.y = 0;

    const vecForward: THREE.Vector3 = this.cameraDirection.clone().normalize();
    const actualUp: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
    const vecRight: THREE.Vector3 = new THREE.Vector3()
      .crossVectors(actualUp, vecForward)
      .normalize();

    const velocityVector: THREE.Vector3 = new THREE.Vector3(
      vecRight.x * this.#velocity.x + vecForward.x * this.#velocity.z,
      0,
      vecRight.z * this.#velocity.x + vecForward.z * this.#velocity.z
    );

    this.matrix4x4.makeBasis(vecRight, actualUp, vecForward);
    this.player.rotation.setFromRotationMatrix(this.matrix4x4);
    velocityVector.applyQuaternion(this.quaternion);
    this.player.position.add(velocityVector.multiplyScalar(dt));

    //interpolacja kamery
    this.player.getWorldPosition(this.v);
    this.pivot.position.set(
      HelpersMath.myApproach(this.pivot.position.x, this.v.x, 0.1),
      HelpersMath.myApproach(this.pivot.position.y, this.v.y, 0.1),
      HelpersMath.myApproach(this.pivot.position.z, this.v.z, 0.1)
    );

    const F: THREE.Vector3 = this.player.position
      .clone()
      .sub(this.bilbord.position);
    const R: THREE.Vector3 = new THREE.Vector3().crossVectors(
      new THREE.Vector3(0, 1, 0),
      F
    );
    const U: THREE.Vector3 = new THREE.Vector3().crossVectors(F, R);

    this.helperArrowBilbord_F.setDirection(F.clone().normalize());
    this.helperArrowBilbord_F.setLength(F.length());
    this.helperArrowBilbord_F.position.copy(this.bilbord.position);

    this.helperArrowBilbord_R.setDirection(R.normalize());
    this.helperArrowBilbord_R.setLength(R.length());
    this.helperArrowBilbord_R.position.copy(this.bilbord.position);

    this.helperArrowBilbord_U.setDirection(U.normalize());
    this.helperArrowBilbord_U.setLength(U.length());
    this.helperArrowBilbord_U.position.copy(this.bilbord.position);

    this.rotationMatrix.makeBasis(R.normalize(), U.normalize(), F.normalize());
    this.bilbord.rotation.setFromRotationMatrix(this.rotationMatrix);

    this.enemiesArr.forEach((enemie, i) => {
      const Fe: THREE.Vector3 = this.player.position
        .clone()
        .sub(enemie.position);
      const Re: THREE.Vector3 = new THREE.Vector3().crossVectors(
        new THREE.Vector3(0, 1, 0),
        Fe
      );
      const Ue: THREE.Vector3 = new THREE.Vector3().crossVectors(Fe, Re);

      // this.enemiesArrowDir[i].setDirection(Fe.clone().normalize());
      // this.enemiesArrowDir[i].setLength(Fe.length(), 0.4, 0.2);
      // this.enemiesArrowDir[i].position.copy(enemie.position);

      const enemieRotationMatrix: THREE.Matrix4 = new THREE.Matrix4();

      enemie.rotation.setFromRotationMatrix(
        enemieRotationMatrix.makeBasis(
          Re.normalize(),
          Ue.normalize(),
          Fe.normalize()
        )
      );
    });
  }

  //----------------------------------------------------------------------------------------

  #createPlayerGeometry(): THREE.Mesh {
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1.5, 1);
    const material: THREE.BoxGeometry = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
    });

    const player: THREE.Mesh = new THREE.Mesh(geometry, material);
    player.position.y = 0.75;
    // player.rotation.set(0, Math.PI / 2, 0);

    this.scene.add(player);
    return player;
  }

  #createRandomGeometries(): THREE.Mesh {
    const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(0.5, 2);
    const material: THREE.BoxGeometry = new THREE.MeshBasicMaterial({
      color: 0xaaaaaa,
    });

    const enemies: THREE.Mesh = new THREE.Mesh(geometry, material);
    this.randomPos = new THREE.Vector3(
      HelpersMath.getRandomIntInRange(-15, 15),
      1,
      HelpersMath.getRandomIntInRange(-15, 15)
    );

    this.scene.add(enemies);
    enemies.position.copy(this.randomPos);
    // player.rotation.set(0, Math.PI / 2, 0);

    return enemies;
  }

  #bilbordGeometry(): THREE.PlaneGeometry {
    const map: THREE.TextureLoader = new THREE.TextureLoader().load(
      "./lepetyna.png"
    );

    const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(2, 2);
    const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      map: map,
    });

    const plane: THREE.Mesh = new THREE.Mesh(geometry, material);
    this.scene.add(plane);

    plane.position.y = 1;
    return plane;
  }

  #createChamferedCube(size: number, chamfer: number): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(size, size, size); // Tworzenie sześcianu o podanym rozmiarze
    const position = geometry.attributes.position; // Pobieranie atrybutu pozycji wierzchołków
    const vector = new THREE.Vector3(); // Tworzenie wektora pomocniczego

    for (let i = 0; i < position.count; i++) {
      vector.fromBufferAttribute(position, i); // Pobieranie współrzędnych wierzchołka

      // Ścięcie krawędzi
      vector.x =
        Math.sign(vector.x) * Math.max(Math.abs(vector.x) - chamfer, 0);
      vector.y =
        Math.sign(vector.y) * Math.max(Math.abs(vector.y) - chamfer, 0);
      vector.z =
        Math.sign(vector.z) * Math.max(Math.abs(vector.z) - chamfer, 0);

      position.setXYZ(i, vector.x, vector.y, vector.z); // Ustawienie nowych współrzędnych wierzchołka
    }

    geometry.computeVertexNormals(); // Przeliczenie normalnych, aby uzyskać odpowiednie oświetlenie

    const material = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
    });
    const cube = new THREE.Mesh(geometry, material);

    this.scene.add(cube);

    return cube; // Zwracanie zmodyfikowanej geometrii
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
