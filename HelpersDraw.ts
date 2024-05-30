import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

class HelpersDraw {
  static arrowHelper(
    v: THREE.Vector3,
    startPoint: THREE.Vector3,
    color: number = 0xffdd00,
    scene: THREE.Scene
  ): void {
    var arrowHelper5 = new THREE.ArrowHelper(
      v.clone().normalize(), //kierunek
      startPoint,
      v.length(),
      color,
      0.4,
      0.2
    );
    scene.add(arrowHelper5);
  }

  static labelHelper(
    vector: THREE.Vector3,
    scene: THREE.Scene,
    prefix?: string,
    suffix?: string,
    offset?: number
  ): void {
    const finalPrefix = prefix ?? "";
    const finalSuffix = suffix ?? "";
    const finalOffset = offset == null ? vector.x : vector.x + offset;
    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const text = `${finalPrefix}(${vector.x.toFixed()}, ${vector.y.toFixed()}, ${
          vector.z !== undefined ? vector.z.toFixed() : 0
        })${finalSuffix}`;
        const textGeometry: TextGeometry = new TextGeometry(text, {
          font: font,
          size: 0.3,
          depth: 0.01,
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(finalOffset, vector.y, vector.z); // Ustawienie pozycji tekstu

        scene.add(textMesh);
      }
    );
  }

  static addAxesLabels(scene: THREE.Scene): void {
    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (font: string) => {
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

        // Label X
        const xGeometry: TextGeometry = new TextGeometry("X", {
          font: font,
          size: 0.5,
          depth: 0.01,
        });
        const xMesh: THREE.Mesh = new THREE.Mesh(xGeometry, textMaterial);
        xMesh.position.set(15.5, 1, 0); // Adjust position as needed
        scene.add(xMesh);

        // Label Y
        const yGeometry: TextGeometry = new TextGeometry("Y", {
          font: font,
          size: 0.5,
          depth: 0.01,
        });
        const yMesh: THREE.Mesh = new THREE.Mesh(yGeometry, textMaterial);
        yMesh.position.set(-1, 15.5, 0); // Adjust position as needed
        scene.add(yMesh);

        // Label Z
        const zGeometry: TextGeometry = new TextGeometry("Z", {
          font: font,
          size: 0.5,
          depth: 0.01,
        });
        const zMesh: THREE.Mesh = new THREE.Mesh(zGeometry, textMaterial);
        zMesh.position.set(-1, 0, 15.5); // Adjust position as needed
        scene.add(zMesh);

        // Adding numbers along X-axis
        for (let i = -15; i <= 15; i++) {
          if (i !== 0) {
            const numGeometry: TextGeometry = new TextGeometry(`${i}`, {
              font: font,
              size: 0.2,
              depth: 0.01,
            });
            const numMesh: THREE.Mesh = new THREE.Mesh(
              numGeometry,
              textMaterial
            );

            if (i < 0) {
              numMesh.position.set(i - 0.2, 0.5, 0);
            } else {
              numMesh.position.set(i - 0.1, 0.5, 0);
            }
            scene.add(numMesh);
          }
        }

        // Adding numbers along Y-axis
        for (let i = -15; i <= 15; i++) {
          if (i !== 0) {
            const numGeometry: TextGeometry = new TextGeometry(`${i}`, {
              font: font,
              size: 0.2,
              depth: 0.01,
            });
            const numMesh: THREE.Mesh = new THREE.Mesh(
              numGeometry,
              textMaterial
            );

            if (i < 0) {
              numMesh.position.set(-0.6, i - 0.1, 0); // Adjust position as needed
            } else {
              numMesh.position.set(-0.5, i - 0.1, 0); // Adjust position as needed
            }

            scene.add(numMesh);
          }
        }

        // Adding numbers along Z-axis
        for (let i = -15; i <= 15; i++) {
          if (i !== 0) {
            const numGeometry: TextGeometry = new TextGeometry(`${i}`, {
              font: font,
              size: 0.2,
              depth: 0.01,
            });
            const numMesh: THREE.Mesh = new THREE.Mesh(
              numGeometry,
              textMaterial
            );
            if (i < 0) {
              numMesh.position.set(-0.2, 0.5, i); // Adjust position as needed
            } else {
              numMesh.position.set(-0.1, 0.5, i); // Adjust position as needed
            }

            scene.add(numMesh);
          }
        }
      }
    );
  }

  static addCustomAxes(scene: THREE.Scene): void {
    const lineMaterialX: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000,
    });
    const lineMaterialY: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
    });
    const lineMaterialZ: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({
      color: 0x0000ff,
    });

    // Os X
    const xGeometry: THREE.BufferGeometry =
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-16, 0, 0),
        new THREE.Vector3(16, 0, 0),
      ]);
    const xLine: THREE.Line = new THREE.Line(xGeometry, lineMaterialX);
    scene.add(xLine);

    // Strzałka osi X
    const arrowHelperX: THREE.ArrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0), // Kierunek strzałki
      new THREE.Vector3(13, 0, 0), // Pozycja startowa strzałki
      3, // Długość strzałki
      0xff0000, // Kolor strzałki (czerwony)
      0.4,
      0.2
    );
    scene.add(arrowHelperX);

    // Os Y
    const yGeometry: THREE.BufferGeometry =
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -16, 0),
        new THREE.Vector3(0, 16, 0),
      ]);
    const yLine: THREE.Line = new THREE.Line(yGeometry, lineMaterialY);
    scene.add(yLine);

    // Strzałka osi Y
    const arrowHelperY: THREE.ArrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0), // Kierunek strzałki
      new THREE.Vector3(0, 13, 0), // Pozycja startowa strzałki
      3, // Długość strzałki
      0x00ff00,
      0.4,
      0.2
    );
    scene.add(arrowHelperY);

    // Os Z
    const zGeometry: THREE.BufferGeometry =
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, -16),
        new THREE.Vector3(0, 0, 16),
      ]);
    const zLine: THREE.Line = new THREE.Line(zGeometry, lineMaterialZ);
    scene.add(zLine);

    // Strzałka osi Z
    const arrowHelperZ: THREE.ArrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1), // Kierunek strzałki
      new THREE.Vector3(0, 0, 13), // Pozycja startowa strzałki
      3, // Długość strzałki
      0x0000ff, // Kolor strzałki (zielony)
      0.4,
      0.2
    );
    scene.add(arrowHelperZ);
  }

  static addAxesLines(scene: THREE.Scene): void {
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    for (let i = -15; i <= 15; i++) {
      if (i !== 0) {
        // Vertical lines (parallel to Y-axis)
        const vertGeometry: THREE.BufferGeometry =
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(i, -0.2, 0),
            new THREE.Vector3(i, 0.2, 0),
          ]);
        const vertLine: THREE.Line = new THREE.Line(vertGeometry, lineMaterial);
        scene.add(vertLine);

        // Horizontal lines (parallel to X-axis)
        const horzGeometry: THREE.BufferGeometry =
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-0.2, i, 0),
            new THREE.Vector3(0.2, i, 0),
          ]);
        const horzLine: THREE.Line = new THREE.Line(horzGeometry, lineMaterial);
        scene.add(horzLine);

        // Horizontal lines (parallel to X-axis)
        const vertGeometryZ: THREE.BufferGeometry =
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -0.2, i),
            new THREE.Vector3(0, 0.2, i),
          ]);
        const vertLineZ: THREE.Line = new THREE.Line(
          vertGeometryZ,
          lineMaterial
        );
        scene.add(vertLineZ);
      }
    }
  }
}

export { HelpersDraw };
