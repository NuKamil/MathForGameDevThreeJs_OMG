import * as THREE from "three";
import { Main } from "./Main";
import { HelpersDraw } from "./HelpersDraw";

interface KeyState {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}

interface MouseState {
  mousedown: boolean;
  mouseorigin: { x: number; y: number };
  lastX: number;
  lastY: number;
  deltaX: number;
  deltaY: number;
}

interface MoveState {
  forward: number;
  right: number;
}

class ThirdPersonController {
  #keys: KeyState;
  mouse: MouseState;
  #move: MoveState;
  #player: THREE.Mesh;
  #main: Main;
  #camera: THREE.PerspectiveCamera;
  #scene: THREE.Scene;
  #raycaster: THREE.Raycaster;
  #pointer: THREE.Vector2;
  helperArrow: THREE.Mesh;
  cameraWorldPosition: THREE.Vector3;
  difVec: THREE.Vector3;

  constructor(main: Main) {
    this.#main = main;
    this.#player = main.player;
    this.#camera = main.camera;
    this.#scene = main.scene;
    this.#move = { forward: 0, right: 0 };

    this.#raycaster = new THREE.Raycaster();
    this.#pointer = new THREE.Vector2();
    this.cameraWorldPosition = new THREE.Vector3();
    this.difVec = new THREE.Vector3();

    this.initKeyControl();
  }

  initKeyControl() {
    document.addEventListener("keydown", this.#keyDown.bind(this));
    document.addEventListener("keyup", this.#keyUp.bind(this));
    document.addEventListener("mousedown", this.#mouseDown.bind(this));
    document.addEventListener("mouseup", this.#mouseUp.bind(this));
    document.addEventListener("mousemove", this.#mouseMove.bind(this));
    document.addEventListener("wheel", this.#onDocumentMouseWheel.bind(this));
    document.addEventListener("pointermove", this.#onPointerMove.bind(this));

    this.#keys = {
      w: false,
      a: false,
      s: false,
      d: false,
    };
    this.mouse = {
      mousedown: false,
      mouseorigin: { x: 0, y: 0 },
      lastX: 0,
      lastY: 0,
      deltaX: 0,
      deltaY: 0,
    };
  }

  update(dt: number): void {
    this.#main.velocityGoal.x = this.#move.right;
    this.#main.velocityGoal.z = this.#move.forward;

    this.#camera.getWorldPosition(this.cameraWorldPosition);
    if (this.helperArrow) {
      const length = this.difVec.length() === 0 ? 1000 : this.difVec.length();
      this.helperArrow.setLength(length, 0.4, 0.4);
    }
    // console.log("Camera position:", this.#camera.position);
  }

  #keyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case "w":
        this.#keys.w = true;
        this.#move.forward = 5;
        break;
      case "a":
        this.#keys.a = true;
        this.#move.right = 5;
        break;
      case "s":
        this.#keys.s = true;
        this.#move.forward = -5;
        break;
      case "d":
        this.#keys.d = true;
        this.#move.right = -5;
        break;
      case " ":
        // this.jump();
        break;
    }
  }

  #keyUp(e: KeyboardEvent): void {
    switch (e.key) {
      case "w":
        this.#keys.w = false;
        if (!this.#keys.s) this.#move.forward = 0;
        break;
      case "a":
        this.#keys.a = false;
        if (!this.#keys.d) this.#move.right = 0;
        break;
      case "s":
        this.#keys.s = false;
        if (!this.#keys.w) this.#move.forward = 0;
        break;
      case "d":
        this.#keys.d = false;
        if (!this.#keys.a) this.#move.right = 0;
        break;
    }
  }
  #onPointerMove(event: PointerEvent) {
    this.#pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.#pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  #mouseDown(e: MouseEvent): void {
    this.mouse.mousedown = true;
    this.mouse.mouseorigin.x = e.clientX;
    this.mouse.mouseorigin.y = e.clientY;

    this.#raycaster.setFromCamera(this.#pointer, this.#camera);

    // console.log(this.#raycaster.ray.direction);

    // calculate objects intersecting the picking ray
    const intersects: THREE.Raycaster = this.#raycaster.intersectObjects(
      this.#scene.children,
      true
    );

    this.helperArrow = HelpersDraw.arrowHelper(
      this.#raycaster.ray.direction,
      this.cameraWorldPosition,
      0x00ffdd,
      this.#scene
    );

    for (let i = 0; i < intersects.length; i++) {
      if (
        intersects[i].object.type === "GridHelper" ||
        intersects[i].object.type === "Line"
      ) {
        this.difVec = new THREE.Vector3(0, 0, 0);
      } else {
        const hit = intersects[i];

        // Geometria kostki
        const geometry = hit.object.geometry;

        // Pobierz wierzchołki trafionego trójkąta

        if (!geometry.attributes.color) {
          const colors = new Float32Array(
            geometry.attributes.position.count * 3
          );
          for (let i = 0; i < colors.length; i += 3) {
            colors[i] = 1; // R
            colors[i + 1] = 1; // G
            colors[i + 2] = 1; // B
          }
          geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        }

        const colorAttribute = geometry.attributes.color;
        const face = hit.face;

        const a = geometry.attributes.position.array[face.a * 3];
        const b = geometry.attributes.position.array[face.b * 3];
        const c = geometry.attributes.position.array[face.c * 3];

        const vertexA = new THREE.Vector3().fromBufferAttribute(
          geometry.attributes.position,
          face.a
        );
        const vertexB = new THREE.Vector3().fromBufferAttribute(
          geometry.attributes.position,
          face.b
        );
        const vertexC = new THREE.Vector3().fromBufferAttribute(
          geometry.attributes.position,
          face.c
        );

        hit.object.localToWorld(vertexA);
        hit.object.localToWorld(vertexB);
        hit.object.localToWorld(vertexC);

        // Narysuj linie pomiędzy wierzchołkami
        this.#drawTriangleEdges(vertexA, vertexB, vertexC);

        // Pobranie atrybutu koloru

        // Ustawienie nowego koloru dla wierzchołków trójkąta
        const newColor = new THREE.Color(0xff0000); // Czerwony

        colorAttribute.setXYZ(face.a, newColor.r, newColor.g, newColor.b);
        colorAttribute.setXYZ(face.b, newColor.r, newColor.g, newColor.b);
        colorAttribute.setXYZ(face.c, newColor.r, newColor.g, newColor.b);

        colorAttribute.needsUpdate = true;

        // Upewnij się, że materiał używa kolorów wierzchołków
        hit.object.material.vertexColors = true;

        hit.object.material.needsUpdate = true;

        this.difVec.subVectors(intersects[i].point, this.cameraWorldPosition);
        // intersects[i].object.material.color.set(0xff0000);
      }
    }
  }
  #drawTriangleEdges(vertexA, vertexB, vertexC) {
    // Utwórz geometrię linii
    const geometry = new THREE.BufferGeometry().setFromPoints([
      vertexA,
      vertexB,
      vertexC,
      vertexA,
    ]);

    // Utwórz materiał linii
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 2,
    }); // Zielony

    // Utwórz linię
    const lineKurwa = new THREE.Line(geometry, material);
    lineKurwa.name = "lineKurwa";
    // Dodaj linię do sceny
    this.#scene.add(lineKurwa);
  }

  #mouseUp(e: MouseEvent): void {
    this.mouse.mousedown = false;
  }

  #onDocumentMouseWheel(e: WheelEvent): void {
    const v = this.#camera.position.z + e.deltaY * 0.005;
    if (v >= 2 && v <= 10) {
      this.#camera.position.z = v;
      this.#camera.position.y = v;
    }
  }

  #mouseMove(e: MouseEvent): void {
    this.#main.yaw.rotation.y -= e.movementX * 0.005;
    const v: number = this.#main.pitch.rotation.x - e.movementY * 0.005;
    if (v > -1 && v < 1) {
      this.#main.pitch.rotation.x = v;
    }
  }
}
export { ThirdPersonController };
