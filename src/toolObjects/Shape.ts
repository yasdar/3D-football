import * as THREE from "three";
import { BaseObj } from "./BaseObj";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { AngleBetweenTwoPointsInPlanXZ } from "../utils";
import { shapes_data } from "../config";
export class ShapeC extends BaseObj {
  //points to draw
  Lpoints: any;
  Lgeometry: MeshLineGeometry;
  currentcolor: number;
  //properties of the shape defined as defined in shapes_data (config.ts)
  shapePorps: any;
  constructor(
    scene: THREE.Scene,
    shapeIndex: number,
    terrainZ: number,
    index: number,
    path: string,
    pathObj: string,
    scaleFactor: number,
    currentcolor: any,
    cloneData: any
  ) {
    super(scene, terrainZ, index, path, pathObj, scaleFactor, cloneData);
    this.isShape = true;
    this.currentcolor = currentcolor;
    //console.log("receied shapeIndex",shapeIndex);
    this.shapePorps = shapes_data[shapeIndex];

    //console.log("shapePorps",shapeIndex,"-->",this.shapePorps)
    this.Lgeometry = new MeshLineGeometry();
    this.Lpoints = [];
    //console.log('add shape : createLine shapeIndex',shapeIndex);
    if (shapeIndex == 0 || shapeIndex == 1) {
      this.createLine();
    } //line+arrow
    else if (shapeIndex == 2 || shapeIndex == 3 || shapeIndex == 4) {
      this.createZone();
    } //circle
  }
  /** create line with arrow */
  createLine() {
    this.Lpoints.push(0, -0.01, 0);

    let material: MeshLineMaterial;

    if (this.shapePorps.dashed) {
      material = new MeshLineMaterial({
        color: new THREE.Color(this.currentcolor),
        resolution: new THREE.Vector2(1, 1),
        lineWidth: 0.1,
        dashArray: 0.1,
        dashRatio: 0.3,
        opacity: 1,
      });
      material.transparent = true;
    } else {
      material = new MeshLineMaterial({
        color: new THREE.Color(this.currentcolor),
        resolution: new THREE.Vector2(1, 1),
        lineWidth: 0.1,
        opacity: 1,
      });
      material.transparent = true;
    }
    this.shape_Mesh = new THREE.Mesh(this.Lgeometry, material);
    this.container.add(this.shape_Mesh);

    this.Lpoints[3] = 2;
    this.Lpoints[4] = -0.01;
    this.Lpoints[5] = 2;
    this.Lgeometry.setPoints(this.Lpoints);

    let anchorMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      opacity: 1,
      color: new THREE.Color(this.currentcolor),
      //  wireframe:true
      transparent: true,
    });
    // const lastPosition:any =[ this.Lpoints[3], this.Lpoints[4],this.Lpoints[5]];
    this._anchor = new THREE.Mesh(
      new THREE.CircleGeometry(0.2, 3),
      anchorMaterial
    );
    this._anchor.rotation.x = -Math.PI / 2;

    this._anchor.position.set(
      this.Lpoints[3],
      this.Lpoints[4],
      this.Lpoints[5]
    );
    this._anchor.name = "_anchor";
    this.container.add(this._anchor);
    this._rotate.visible = false;
    //default anchor position
    this.updateAnchor(2, 2);
  }
  /**  create circle */
  createZone() {
    this.isCircle = true;
    this.Lpoints.push(0, -0.01, 0);

    let material: MeshLineMaterial;

    if (this.shapePorps.dashed) {
      material = new MeshLineMaterial({
        color: new THREE.Color(this.currentcolor),
        resolution: new THREE.Vector2(1, 1),
        lineWidth: 0.1,
        dashArray: 0.1,
        dashRatio: 0.3,
        opacity: 1,
      });
      material.transparent = true;
    } else {
      material = new MeshLineMaterial({
        color: new THREE.Color(this.currentcolor),
        resolution: new THREE.Vector2(1, 1),
        lineWidth: 0.1,
        opacity: 1,
      });
      material.transparent = true;
    }
    this.shape_Mesh = new THREE.Mesh(this.Lgeometry, material);
    this.container.add(this.shape_Mesh);

    if (this.Lpoints.length > 0) {
      this.Lpoints = [];
      for (let j = 0; j < Math.PI * 2 + 0.1; j += 0.1) {
        let D: number = 2;
        this.Lpoints.push(Math.cos(j) * D, -0.01, Math.sin(j) * D);
      }
      this.Lgeometry.setPoints(this.Lpoints.flat());
    }

    let anchorMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      opacity: 1,
      color: new THREE.Color(0xff0000),
      //  wireframe:true,
      transparent: true,
    });
    // const lastPosition:any =[ this.Lpoints[3], this.Lpoints[4],this.Lpoints[5]];
    this._anchor = new THREE.Mesh(
      new THREE.CircleGeometry(0.2, 3),
      anchorMaterial
    );
    this._anchor.rotation.x = -Math.PI / 2;

    this._anchor.position.set(this.Lpoints[3], 0.01, this.Lpoints[5]);
    this._anchor.name = "_anchor";
    this.container.add(this._anchor);
    this._rotate.visible = false;
    //default anchor position

    //filled area
    let XX = this.Lpoints[3];
    let ZZ = this.Lpoints[5];
    let D: number = Math.max(Math.abs(XX), Math.abs(ZZ));

    if (this.shapePorps.fillColor) {
      let FilledCirecleMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        opacity: this.shapePorps.fillOpacity,
        color: 0xffffff, //new THREE.Color(this.currentcolor),
        //  wireframe:true,
        transparent: true,
      });

      this.circleZone = new THREE.Mesh(
        new THREE.CircleGeometry(D, 32),
        FilledCirecleMaterial
      );
      this.circleZone.rotation.x = -Math.PI / 2;
      this.container.add(this.circleZone);
    }
  }
  /**update the shape , radius, distance...
   * @param x : mouse x 
   * @param z : mouse z
   */
  updateAnchor(x: number, z: number) {
    if (!this._anchor) {
      return;
    }

    // console.log('updateAnchor');

    if (this.isCircle) {
      if (this.Lpoints.length > 0) {
        this.Lpoints = [];
        let XX = x - this.container.position.x;
        let ZZ = z - this.container.position.z;
        let D: number = Math.max(Math.abs(XX), Math.abs(ZZ));

        for (let j = 0; j < Math.PI * 2 + 0.1; j += 0.1) {
          this.Lpoints.push(Math.cos(j) * D, -0.01, Math.sin(j) * D);
        }
        this.Lgeometry.setPoints(this.Lpoints.flat());

        this._anchor.position.set(Math.cos(0.1) * D, 0.01, Math.sin(0.1) * D);

        if (this.circleZone) {
          this.container.remove(this.circleZone);

          let FilledCirecleMaterial = new THREE.MeshBasicMaterial({
            //side: THREE.DoubleSide,
            opacity: this.shapePorps.fillOpacity,
            color: 0xffffff, //new THREE.Color(this.currentcolor),
            //  wireframe:true,
            transparent: true,
          });

          this.circleZone = new THREE.Mesh(
            new THREE.CircleGeometry(D, 32),
            FilledCirecleMaterial
          );
          this.circleZone.rotation.x = -Math.PI / 2;
          this.container.add(this.circleZone);
        }
      }
    } else {
      this.Lpoints[3] = x - this.container.position.x;
      this.Lpoints[4] = 0;
      this.Lpoints[5] = z - this.container.position.z;
      //rotate anchor with angle
      let A = AngleBetweenTwoPointsInPlanXZ(
        { x: this.Lpoints[3], y: this.Lpoints[4], z: this.Lpoints[5] },
        { x: this.Lpoints[0], y: this.Lpoints[1], z: this.Lpoints[2] }
      );

      this.Lgeometry.setPoints(this.Lpoints);
      this._anchor.rotation.z = A + Math.PI / 6;
      this._anchor.position.set(this.Lpoints[3], 0, this.Lpoints[5]);
    }
  }
  objectIsReady(): void {
    //let SKin_color:any = this.defaultColors.SKin.replace('#','0x');
    if (this.cloneData) {
      //apply scale
      this.CurrentScale = this.cloneData.actual_CurrentScale;
      this.scaleCounter = this.cloneData.actual_scaleCounter;
      this.scaleObj(0);
      //apply rotation
      this.container.rotation.y = this.cloneData.rotation;
    }
  }
  /**apply selected color
   * @param selectedColor : string
   */
  applyshapeColor(selectedColor: string) {
    this.usedColor = selectedColor;
    let n_color: any = selectedColor.replace("#", "0x");

    if (this._anchor) {
      this._anchor.material.color.setHex(n_color);
    }
    if (this.shape_Mesh) {
      this.shape_Mesh.material.color.setHex(n_color);
    }
    //arrow still red for circular zone
    if (this.circleZone) {
      this._anchor.material.color.setHex(0xff0000);
    }
  }
}
