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

  constructor(main: Main) {
    this.#main = main;
    this.#player = main.player;
    this.#move = { forward: 0, right: 0 };

    this.initKeyControl();
  }

  initKeyControl() {
    document.addEventListener("keydown", this.#keyDown.bind(this));
    document.addEventListener("keyup", this.#keyUp.bind(this));
    document.addEventListener("mousedown", this.#mouseDown.bind(this));
    document.addEventListener("mouseup", this.#mouseUp.bind(this));
    document.addEventListener("mousemove", this.#mouseMove.bind(this));

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

  // #mouseMove(e: MouseEvent): void {
  //   const deltaX = e.clientX - this.mouse.lastX;
  //   const deltaY = e.clientY - this.mouse.lastY;

  //   const sensitivity = 0.01;

  //   this.#player.rotation.y += deltaX * sensitivity;
  //   // this.#player.rotation.x += deltaY * sensitivity;

  //   // Użyj metody copy() do zaktualizowania obecnej rotacji
  //   this.#player.rotation.copy(
  //     HelpersMath.myEulerNormalize(this.#player.rotation)
  //   );

  //   this.mouse.lastX = e.clientX;
  //   this.mouse.lastY = e.clientY;
  // }

  #mouseMove(e: MouseEvent): void {
    const deltaX = e.clientX - this.mouse.lastX;
    const deltaY = e.clientY - this.mouse.lastY;

    this.mouse.deltaX = deltaX;
    this.mouse.deltaY = deltaY;

    this.mouse.lastX = e.clientX;
    this.mouse.lastY = e.clientY;
  }
}
export { ThirdPersonController };