import * as THREE from "three";

class HelpersMath {
  static dotProduct(a: THREE.Vector3, b: THREE.Vector3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  static crossProduct(a: THREE.Vector3, b: THREE.Vector3): THREE.Vector3 {
    return new THREE.Vector3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }

  static myLength(v: THREE.Vector3): number {
    return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
  }

  static myNormalized(v: THREE.Vector3): THREE.Vector3 {
    const length = this.myLength(v);
    return new THREE.Vector3(v.x / length, v.y / length, v.z / length);
  }

  static myABS(v: number): number {
    return v >= 0 ? v : -v;
  }

  static myApproach(goal: number, current: number, dt: number): number {
    const differance: number = goal - current;

    if (differance > dt) return current + dt;
    if (differance < -dt) return current - dt;

    return goal;
  }

  static myEulerToVector(euler: THREE.Euler): THREE.Vector3 {
    const vector = new THREE.Vector3();
    vector.x = Math.cos(euler.y) * Math.cos(euler.x);
    vector.y = Math.sin(euler.x); // Sin(pitch)
    vector.z = Math.sin(euler.y) * Math.cos(euler.x);

    // console.log(`Euler: ${euler.x}, ${euler.y}, ${euler.z}`);
    // console.log(`Vector: ${vector.x}, ${vector.y}, ${vector.z}`);

    return vector;
  }

  static myEulerNormalize(euler: THREE.Euler): THREE.Euler {
    // if (euler.x > 89) euler.x = 89;
    // if (euler.x > -89) euler.x = -89;

    // while (euler.y < -180) euler.y += 360;
    // while (euler.y > 180) euler.y -= 360;

    // euler.z = euler.z;

    // Ograniczenie pitch
    euler.x = Math.max(
      -Math.PI / 2 + Math.PI / 180,
      Math.min(Math.PI / 2 - Math.PI / 180, euler.x)
    );

    // Normalizacja yaw
    while (euler.y < -Math.PI) euler.y += 2 * Math.PI;
    while (euler.y > Math.PI) euler.y -= 2 * Math.PI;

    // Roll jest zwykle nieograniczony
    euler.z = euler.z;

    return euler;
  }
}
export { HelpersMath };
