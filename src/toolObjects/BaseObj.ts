import * as THREE from 'three'
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import {MeshSurfaceSampler} from'three/examples/jsm/math/MeshSurfaceSampler';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import  { Tools_Options } from '../config';
import $ from "jquery";
export class BaseObj {
  mixer:THREE.AnimationMixer;
    container:THREE.Object3D;
    clickableZone : THREE.Mesh;
    _rotate!: THREE.Mesh;
    _move!: THREE.Mesh;
   _active:boolean = true;
    scene:THREE.Scene;

    CurrentScale:number = 1;
    scaleCounter:number = 1;
    usedColor:any= null;


    _index:number;

    _path:string;
    _pathOBJ:string;
    _currentOBj:any;
    _scaleFactor:number=1;
    isPlayer:boolean = false;
    playerid:number;
    
    isEquipment:boolean = false;
    EquipmentId:number;

    isShape:boolean = false;
    shapeId:number;

    isLabel:boolean = false;
    labelId:number;
    cloneData:any;
    fontUrl:string='';
    text:string='';
    mesh_text:any;//THREE.Mesh;


    //line with arrow
    shape_Mesh:any;
    _anchor!: any;
    isCircle:boolean = false;
    //filled circle zone
    circleZone:any;
    constructor(
        scene:THREE.Scene,
        terrainZ:number,
        index:number,
        path:string,
        pathObj:string,
        scaleFactor:number,
        clonedbData:any) {
    this.scene = scene;
    this._path = path;
    this._pathOBJ = pathObj;
    this._scaleFactor = scaleFactor*0.7;
    this._index = index;
    this.container = new THREE.Object3D();
    this.container.name = "obj"+this._index;
    //console.log('name_index:',this.container.name)
    this.container.userData ={Me:this};
    this.scene.add(this.container);
    this.container.position.set(0,terrainZ,0)
       
    this.addTools();

    if(this._path.length>1){this.addObj();}
    
    $('#bt_scale').removeClass('flipped');
    $('#objTool').hide();
    //$('#loaderImg').show();
    this.cloneData = clonedbData;
    }showTools(){

        if( !this.isShape ){this._rotate.visible = true;}
        
        this._move.visible = true;
        
        if(this._anchor){this._anchor.visible = true;}
 

        this._active = true;

        //actual scale tool button state
        if(this.scaleCounter <= Tools_Options.maxScale){
          $('#bt_scale').removeClass('flipped');
        }else{
          $('#bt_scale').addClass('flipped');
        }
    }hideTools(){

        this._rotate.visible = false;
        this._move.visible = false;

        if(this.isCircle){ this._anchor.visible = false;}

        this._active = false;
    }
    addTools(){
      //clickableZone
      this.clickableZone = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.33,
            0.33,
            0.7,
            6,
            1
            ),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          opacity: 0,
          //wireframe:true,
          transparent:true
        })
      )
      
        this.clickableZone.position.set(0, 1, 0);
        this.clickableZone.name = 'clickableZone';
        this.container.add(this.clickableZone);
        this.clickableZone.visible = false;
         //rotation tool
       // const textTureLoader = new THREE.TextureLoader()
        //let texture = textTureLoader.load('../assets/images/rot.png')
        let circleMat = new THREE.MeshBasicMaterial({
          //map: texture,
          //side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
          color:0xffff00
        })
        this._rotate = new THREE.Mesh(new THREE.CircleGeometry(0.75,8), circleMat);
        this._rotate.rotation.x = -Math.PI / 2;
        this._rotate.position.set(0, 0.01, 0);
        this._rotate.name = '_rotate';
        this.container.add(this._rotate);

        //moving tool
        this._move = new THREE.Mesh(
            new THREE.CircleGeometry(0.4,12),
            new THREE.MeshStandardMaterial({
              color: 0xff0000,
              opacity: 0.4,
              transparent:true
            })
          )
          
          this._move.position.set(0,0.02, 0);
          this._move.name = '_move';
          this._move.rotation.x = -Math.PI / 2;
          this.container.add(this._move);

        
    }
    addObj(){
        //load the object
        if(this._pathOBJ.indexOf('.obj') != -1){
            new OBJLoader()
            .setPath(this._path)//'../assets/obj'
            .load(
                this._pathOBJ,//'/rp_mei_posed_001_30k.obj'
              (object) => {
                object.name = this._pathOBJ;
                console.log("loaded obj",object)
                this._currentOBj = object;
               this.addLoadedObj(object);
              },
              this.onProgress,this.onError
            )
        }
        else if(this._pathOBJ.indexOf('.glb') != -1 || this._pathOBJ.indexOf('.gltf') != -1){
            new GLTFLoader()
            .setPath(this._path)//'../assets/obj'
            .load(
                this._pathOBJ,//'/rp_mei_posed_001_30k.obj'
              (object) => {
                object.scene.name = this._pathOBJ;
               // object.scene.castShadow = true;
                console.log("loaded .glb or .gltf",object)
                this._currentOBj = object;
                this.addLoadedObj(object.scene);
                this.checkNodes(object);
              },
              this.onProgress,this.onError
            )
        }
        else if(this._pathOBJ.indexOf('.fbx') != -1){
            new FBXLoader()
            .setPath(this._path)//'../assets/obj'
            .load(
                this._pathOBJ,//'/rp_mei_posed_001_30k.obj'
              (object) => {
                object.name = this._pathOBJ;

                const model = object;
                console.log("voila ---> loaded .fbx",model)

               this._currentOBj = object;
               this.addLoadedObj(object);
              
              },
              this.onProgress,this.onError
            )
        }else{
          console.log('.mtl','.obj');
          new MTLLoader()
					.setPath( this._path)
					.load( this._pathOBJ,  ( materials )=> {

						materials.preload();
						new OBJLoader()
							.setMaterials( materials )
							.setPath( this._path )
							.load( this._pathOBJ.replace('.mtl','.obj'),  ( object )=> {

                this.addLoadedObj(object);


							}, this.onProgress,this.onError );

					} );
        }


        //GLTFLoader
    }
    addLoadedObj(object:THREE.Group){
     // console.log('this.container',this.container)
      this.container.add(object);

     // console.log(object)
      let boundingBox = new THREE.Box3().setFromObject(object);
      let height = Math.abs(boundingBox.min.y - boundingBox.max.y);
     // console.log(height);
      object.scale.setScalar( (1/height) *1.5*this._scaleFactor)
     // object.position.set(0, 0.01, 0);
      //$('#loaderImg').hide();
      $('#objTool').show();
    
      this.objectIsReady();
     
    }
    objectIsReady(){
      
      console.log('cloneData',this.cloneData);
      if(this.cloneData){
        //apply scale
        this.CurrentScale = this.cloneData.actual_CurrentScale;
        this.scaleCounter = this.cloneData.actual_scaleCounter;
        this.scaleObj(0);
        //apply rotation
        this.container.rotation.y = this.cloneData.rotation;
        //color
        this.applyEquipmentColor(this.cloneData.color);

      }
    }
    onError(err: any){
    console.log("error loading!",err)
    }
    onProgress(xhr: any) {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100
        //  console.log(percentComplete.toFixed(2) + '% downloaded')
        }
      }

    scaleObj(v:number){
      if(this.isShape){return};//don't scale a shape
        console.log(v,this.scaleValue())
        this.CurrentScale += v*this.scaleValue();
        this.container.scale.setScalar(this.CurrentScale);
    }
    scaleValue(){
      let Direction:number = 1;
      if(this.scaleCounter <= Tools_Options.maxScale){
      Direction=1;
      $('#bt_scale').removeClass('flipped');
    }
      else{
        Direction=-1;
        $('#bt_scale').addClass('flipped');
      }
      if(this.CurrentScale-0.1 <= Tools_Options.minScale){
        this.scaleCounter = Tools_Options.minScale; 
        Direction=1;
        $('#bt_scale').removeClass('flipped');
      }
      this.scaleCounter+=0.1;
      return Direction;
    }

    /** rmove from scene */
    destroy(){
      console.log("destroy",this.container.name)
      this.scene.remove(this.container);
    }


    checkNodes(obj:any){
      console.log("@--->",obj);
        /*
        //console.log("@",obj);
        this.mixer = new THREE.AnimationMixer(obj.scene)
        const clips = obj.animations;
        const clip = THREE.AnimationClip.findByName(clips,'player16');
        console.log("clip",clip);
       const action = this.mixer.clipAction(clip);
       // console.log("action",action);
        action.play();
        action.repetitions = 0;*/


      //just apply shadow
      let model = obj.scene;
      model.traverse((node:any) =>{
        if (node.isMesh) {
          //add shadow
          node.castShadow = true;
      }
      });

    }
  
    update(){
      if(this.mixer){this.mixer.update(new THREE.Clock().getDelta());}
    }
    applyEquipmentColor(selectedColor:string){
     if( !selectedColor ){return;}
      //color as number
    this.usedColor = selectedColor;
    let n_color:any = selectedColor.replace('#','0x');

     if(this.isLabel){
      console.log('app l',this.mesh_text==undefined,n_color)
      this.mesh_text.material.color.setHex(n_color);
      return;
     }
       //get object
    let model = this._currentOBj.scene;
   
    //apply color
      model.traverse((node:any) =>{
        if (node.isMesh) {
          //console.log("Mesh",node.name)
          if( 
            node.name != 'flag' &&
            node.name != 'hole'&&
            node.name != 'steps'&&
            node.name != 'pole2'&&
            node.name != 'net'&&
            node.name != 'goal_2'
            ){
            console.log("apply color to ",node.name,n_color)
            node.material.color.setHex(n_color);
          }
          if( node.name.indexOf('football')!=-1 ){
           
            node.material.color.setHex(n_color);
          }
      }
      });
    }
    addText(fontPath:string,text:string){
      this.text = text;
      this.fontUrl = fontPath;
      const loader = new FontLoader()
      loader.load(fontPath, (font)=> {
         const geometry = new TextGeometry(text, {
            font: font,
            size: 0.5,
            height: 0.01,
            curveSegments: 6,
            bevelEnabled: false,
            /*bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 3,*/
         });
      
         const material = new THREE.MeshStandardMaterial({
          color: 0xff0000,/*opacity: 0.8,transparent:true*/
        })
       this.mesh_text = new THREE.Mesh(geometry, material)
       this.mesh_text.name = 'text';
       //center the text
      // console.log("ee",(text.length)/2)
     //  mesh.position.set(-((text.length/2)*0.5)+0.75,0,0);
     this.mesh_text.position.set(-(Math.ceil(text.length/2)+1)*0.25,0,0);
       //text rotation with Terrain
       this.mesh_text.rotation.x = -Math.PI / 2;
       this.container.add( this.mesh_text );



       if(this.cloneData){

        this.objectIsReady();
      }

      })

    }MoveIt(x:number,z:number){
      this.container.position.x = x;
      this.container.position.z = z;
      
    }rotateIt(angle:number){
      if(this.isShape){return};//don't rotate
      this.container.rotation.y = angle;
    }
    FilpObj(){
      if(this.isShape){return};//don't rotate
      this.container.rotation.y +=  Math.PI;
    }
    
}

