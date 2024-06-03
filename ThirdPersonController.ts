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

  constructor(main: Main) {
    this.#main = main;
    this.#player = main.player;
    this.#camera = main.camera;
    this.#scene = main.scene;
    this.#move = { forward: 0, right: 0 };

    this.#raycaster = new THREE.Raycaster();
    this.#pointer = new THREE.Vector2();

    this.helperArrow = HelpersDraw.arrowHelper(
      this.#raycaster.ray.direction,
      this.#camera.position,
      0x00ffdd,
      this.#scene
    );
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

    if (this.helperArrow) {
      this.helperArrow.setDirection(
        this.#raycaster.ray.direction.clone().normalize()
      );
      this.helperArrow.setLength(1000, 0.4, 0.2);
      this.helperArrow.position.copy(this.#player.position);
    }

    // console.log(this.#move.forward, this.#move.right);
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

    console.log(this.#raycaster.ray.direction);

    // calculate objects intersecting the picking ray
    const intersects: THREE.Raycaster = this.#raycaster.intersectObjects(
      this.#scene.children
    );

    // console.log(intersects[0].object);

    for (let i = 0; i < intersects.length; i++) {
      if (
        intersects[0].object.type === "GridHelper" ||
        intersects[0].object.type === "Line"
      ) {
        return;
      } else {
        intersects[i].object.material.color.set(0xff0000);
      }
    }
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
    if (v > -1 && v < 0.1) {
      this.#main.pitch.rotation.x = v;
    }
  }
}
export { ThirdPersonController };
