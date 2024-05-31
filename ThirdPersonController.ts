import * as THREE from "three";
import { Main } from "./Main";

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

  constructor(main: Main) {
    this.#main = main;
    this.#player = main.player;
    this.#camera = main.camera;
    this.#move = { forward: 0, right: 0 };

    this.initKeyControl();
  }

  initKeyControl() {
    document.addEventListener("keydown", this.#keyDown.bind(this));
    document.addEventListener("keyup", this.#keyUp.bind(this));
    document.addEventListener("mousedown", this.#mouseDown.bind(this));
    document.addEventListener("mouseup", this.#mouseUp.bind(this));
    document.addEventListener("mousemove", this.#mouseMove.bind(this));
    document.addEventListener("wheel", this.#onDocumentMouseWheel.bind(this));

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

  #mouseDown(e: MouseEvent): void {
    this.mouse.mousedown = true;
    this.mouse.mouseorigin.x = e.clientX;
    this.mouse.mouseorigin.y = e.clientY;
  }

  #mouseUp(e: MouseEvent): void {
    this.mouse.mousedown = false;
  }

  #onDocumentMouseWheel(e: WheelEvent): void {
    const v = this.#camera.position.z + e.deltaY * 0.005;
    if (v >= 2 && v <= 10) {
      this.#camera.position.z = v;
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
