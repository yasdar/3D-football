import $ from "jquery";
import "@melloware/coloris/dist/coloris.css";
import Coloris from "@melloware/coloris";
//import gsap from "gsap";
import THREE, {Scene, WebGLRenderer } from "three";
import { Terrain } from "./toolObjects/Terrain";
import { Camera } from "./Camera";
import { Player } from "./toolObjects/Player1";
import { AngleBetweenTwoPointsInPlanXZ } from "./utils";
import { BaseObj } from "./toolObjects/BaseObj";
import { addEquipmentsColorPicker, addPitchBorderColorPicker, addPitchColorPicker, addPitchLineColorPicker, addplayerClothesColorPicker, addplayerSkinColorPicker, bgs_data, coloris_Close_Event, font_data, playerParts, player_color_parts, sportCharaters, sportEquipment } from "./config";
import { ActivateRightBt, Clone_UI, Filp_UI, Remove_UI, Scale_UI, addBgsList, addEList, addPitcheList, addPlayersList, addTextsList, addZone_UI, addlabel_UI, addshapesList, changeBackgroundImage_UI, changeCharacters_UI, changeEquipments_UI, changePitcheTexture_UI, changeTexts_UI, editUserData_UI, exportAsImage_UI, getSavedData, handleBgsselection, handleFontsselection, handlePitcheselection, handlePlayersselection, initButtons, save, saveUserData_UI } from "./UI";
import { ShapeC } from "./toolObjects/Shape";

export class App
{
    private canExport:boolean = true;
    private scene: Scene;
    private renderer: WebGLRenderer;
    public terrain:Terrain;
    public camera:Camera;
    public mousePosition : THREE.Vector2;
    public ray_caster : THREE.Raycaster;

    pickableObjects: THREE.Mesh[] = []
    intersectedObject!: THREE.Object3D | null
    addedObgetcs:Array<any> = [];

    onDown:boolean = false;
    selectedColor:string = '';
    selectedColorPitch:string='';
    
    selectedColorPitchBorder:string='';
    selectedColorPitchLine:string='';
    selectedObject:{
      container:THREE.Object3D|null,
      Action:string
    };
    lastSelectedObject:{
      container:THREE.Object3D|null,
      Action:string
    }
    terrainLimits:any;
   backGroundImageUrl:string = '';
    SelectedFont:{name:string,jsonurl:string};



    
    constructor()
    {

      //renderer
        this.renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
        this.renderer.setClearColor(0xff0000, 1); 
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        //add to web page
        const _div:HTMLElement|null =  document.getElementById('app');
        if(_div){ _div.appendChild(this.renderer.domElement);}
        //create scene
        this.scene = new Scene();
        const Bcolor = new THREE.Color(0x000000);
        this.scene.background = Bcolor
        this.setSceneBackground(bgs_data[0].url);
        this.camera = new Camera(this.renderer);
        this.addLight();
        this.terrain = new Terrain(this.scene);
        this.terrainLimits = this.terrain.terrainLimits;
        this.pickableObjects.push(this.terrain._terrainMesh);
        this.selectedObject={container:null,Action:'0'}
        this.lastSelectedObject={container:null,Action:'0'}
        $('#objTool').hide();
        this.ray_caster = new THREE.Raycaster()

        this.addToolEvents();
        ActivateRightBt();
        this.addedObgetcs = [];
      //listen too reseize
        window.addEventListener("resize", this.onWindowResize.bind(this), false);
        //looping
        this.animate();
      this.addColoris();
      initButtons();
      saveUserData_UI(this.saveUserData.bind(this));
      editUserData_UI(this.editUserData.bind(this));
      //equipments
      addEList();
      changeEquipments_UI(this.addEquipment.bind(this));
      Filp_UI(this.filpIt.bind(this));
      Scale_UI(this.scaleIt.bind(this));
      Remove_UI(this.removeIt.bind(this));
      //3D texts
      addTextsList();
      changeTexts_UI(this.setSelectedFont.bind(this));
      addlabel_UI(this.addLabel.bind(this));
      //background images
      addBgsList();
      changeBackgroundImage_UI(this.setSceneBackground.bind(this));
      //pitches textures
      addPitcheList();
      this.ApplyTerrainTexture(0);
      changePitcheTexture_UI(this.ApplyTerrainTexture.bind(this));
      //players : characters
      addPlayersList();
      changeCharacters_UI(this.addPlayer.bind(this));

      //arrow and zones
      addshapesList();
      addZone_UI(this.addShape.bind(this))
      //save canvas as image
      exportAsImage_UI(this.getCanvasContent.bind(this));
      //clone
      Clone_UI(this.cloneIt.bind(this));
      //get "user Saved data, List :"
     //setTimeout(() => { getSavedData();}, 300);
      
     setTimeout(() => { 

    //this.addShape(1);
     }, 3000);
/*
     this.Lgeometry = new MeshLineGeometry()

this.Lpoints = []

  this.Lpoints.push(0, 0.5, 0);

this.Lgeometry.setPoints(this.Lpoints);//,(p) =>  0.1
const material:any = new MeshLineMaterial({
  color: new THREE.Color(0xff0000),
  resolution:new THREE.Vector2( 1,1 ),
  lineWidth:0.1,
  dashArray:0.1,
  dashRatio:0.5,
  opacity:1
})
material.transparent = true;
const mesh = new THREE.Mesh(this.Lgeometry, material)
this.scene.add(mesh)
*/



/*const axesHelper = new THREE.AxesHelper( 8 );
this.scene.add( axesHelper );*/


}
setSelectedFont(f:number){
  this.SelectedFont = {name:font_data[f].name,jsonurl:font_data[f].pathObj};
}
setSceneBackground(imgUrl:string){
  if( !this.canExport ){return;}
  this.backGroundImageUrl  = imgUrl;
  this.canExport = false
  var img = new Image();
  img.src = imgUrl;
  img.onload =  ()=> {
    this.scene.background = new THREE.TextureLoader().load(img.src);
    this.canExport = true;
  };
}
private addColoris(){
Coloris.init();
Coloris.coloris({el: "#coloris",themeMode: 'dark',alpha: false,margin: 20});
coloris_Close_Event(this.applySelectedColor.bind(this));
//listen to onchange and select a color
addEquipmentsColorPicker((color:any) =>{this.selectedColor = color});
addPitchBorderColorPicker((color:any) =>{this.selectedColorPitchBorder = color});
addPitchLineColorPicker((color:any) =>{this.selectedColorPitchLine = color});
addPitchColorPicker((color:any) =>{this.selectedColorPitch = color});
addplayerClothesColorPicker((color:any) =>{
  if(color.length<1){return;}player_color_parts.Shirt = color;
},'.instance5');
addplayerClothesColorPicker((color:any) =>{
  if(color.length<1){return;}player_color_parts.Shoulder = color;
},'.instance6');
addplayerClothesColorPicker((color:any) =>{
  if(color.length<1){return;}player_color_parts.Short = color;
},'.instance7');
addplayerClothesColorPicker((color:any) =>{
  if(color.length<1){return;}player_color_parts.Socks = color;
},'.instance8');
addplayerClothesColorPicker((color:any) =>{
  if(color.length<1){return;}player_color_parts.SocksTop = color;
},'.instance9');
addplayerSkinColorPicker((color:any) =>{
  if(color.length<1){return;}player_color_parts.SKin = color;
},'.instance9');
}
applySelectedColor(coloprPicker_index:number){
  //console.log('coloprPicker_index',coloprPicker_index)
  if(coloprPicker_index == 1){this.applyColor();}
 else if(coloprPicker_index == 2){
  let n_color:any = this.selectedColorPitchBorder.replace('#','0x');
  this.terrain.setPitcheBorderColor(n_color );
 }
 else if(coloprPicker_index == 3){
  let n_color:any = this.selectedColorPitchLine.replace('#','0x');
  this.terrain.setTracageColor(n_color );
 }
 else if(coloprPicker_index == 4){
  let n_color:any = this.selectedColorPitch.replace('#','0x');
  this.terrain.setpitchColor(n_color );
 }
 else if(coloprPicker_index == 5){
  let n_color:any = player_color_parts.Shirt.replace('#','0x');
  this.applyPlayerColors(["Shirt","Collar","clothes.003","clothes.001","clothes.002"],n_color);//"Shirt","Collar"
  $("#Shirt").css("border-color", player_color_parts.Shirt);
 }
 else if(coloprPicker_index == 6){
  let n_color:any = player_color_parts.Shoulder.replace('#','0x');
  this.applyPlayerColors(["Shoulder"],n_color);
  $("#Shoulder").css("border-color", player_color_parts.Shoulder);
 }
 else if(coloprPicker_index == 7){
  let n_color:any = player_color_parts.Short.replace('#','0x');
  this.applyPlayerColors(["Short"],n_color);
  $("#Short").css("border-color", player_color_parts.Short);
 }
 else if(coloprPicker_index == 8){
  let n_color:any = player_color_parts.Socks.replace('#','0x');
  this.applyPlayerColors(["Socks","Bottom_Socks"],n_color);
  $("#Socks").css("border-color", player_color_parts.Socks);
 }
 else if(coloprPicker_index == 9){
  let n_color:any = player_color_parts.SocksTop.replace('#','0x');
  this.applyPlayerColors(["Upper_Socks"],n_color);
  $("#SocksTop").css("border-color", player_color_parts.SocksTop);
 }
 else if(coloprPicker_index == 10){
  let n_color:any = player_color_parts.SKin.replace('#','0x');
  this.applyPlayerColors(["Model","skin.001"],n_color);//"Model"
  $("#SKin").css("border-color", player_color_parts.SKin);
 }
}
applyPlayerColors(parts:Array<string>,n_color:any){
  if (this.lastSelectedObject.container &&  
    this.lastSelectedObject.container.userData.Me._active &&
    this.lastSelectedObject.container.userData.Me.isPlayer){
      let player:any = this.lastSelectedObject.container.userData.Me;
      parts.forEach((part:string)=>{
      player.color_part(part,n_color);
     // player.color_part(part,n_color);
    })
  }
}
private applyColor(){
 console.log("this.selectedColor",this.selectedColor)
  if(this.selectedColor.length<1){return;}
  console.log("applyColor",this.selectedColor);
  if (this.lastSelectedObject.container &&  this.lastSelectedObject.container.userData.Me._active){
    // console.log('isPlayer',this.lastSelectedObject.container.userData.Me.isPlayer)
    if(this.lastSelectedObject.container.userData.Me.isPlayer){return;}
    if(this.lastSelectedObject.container.userData.Me.isShape){
      this.lastSelectedObject.container.userData.Me.applyshapeColor(this.selectedColor)
      return;}
    this.lastSelectedObject.container.userData.Me.applyEquipmentColor(this.selectedColor)
  }
}

    private onWindowResize(): void
    {
        this.camera._camera.aspect = window.innerWidth / window.innerHeight;
        this.camera._camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate(): void
    {
        requestAnimationFrame(this.animate.bind(this));

        this.camera.update();
        this.update();
        this.renderer.render(this.scene, this.camera._camera);

    }
    private update(){
      this.addedObgetcs.forEach((obg:BaseObj)=>{
        if(obg == null){return;}
        obg.update();
      })
      this.ray_caster.setFromCamera(this.mousePosition,this.camera._camera);
      const intersetcs = this.ray_caster.intersectObjects(this.pickableObjects);
      //pointerclick on rotate or move tools of an object
      if (intersetcs.length>0) {
      
        if( this.onDown  &&  this.selectedObject.Action == "0")
        {

          if(intersetcs[0].object.name =="terrain"){ 
           // console.log("on terrain -->",intersetcs[0].object.name)
           this.highlightSelected();
          }else if(
            intersetcs[0].object.name =="_move" || 
            intersetcs[0].object.name =="_anchor" || 
            intersetcs[0].object.name =="_rotate"|| 
            intersetcs[0].object.name =="clickableZone"
            ){
            console.log("on object with tool -->",intersetcs[0].object.name)
            this.selectedObject={
              container:intersetcs[0].object.parent,
              Action:intersetcs[0].object.name
            }
            this.lastSelectedObject={
              container:intersetcs[0].object.parent,
              Action:intersetcs[0].object.name
            }
            $('#objTool').show();
            this.highlightSelected();
          }
         
          
        }
        this.manageSelected(intersetcs[0].point);
      }

    }
    private manageSelected(intersectionPoint:any){
      if(this.onDown && this.selectedObject.container){
        this.camera.controls.enabled = false;

        if(this.selectedObject.Action =='_rotate'){
          this.selectedObject.container.userData.Me.rotateIt(
            AngleBetweenTwoPointsInPlanXZ(
              intersectionPoint,
              this.selectedObject.container.position
            )
          );
            }

        if(this.selectedObject.Action =='_move'){
          if( intersectionPoint.x < this.terrainLimits.left ){return}
          if( intersectionPoint.x > this.terrainLimits.right ){return}
          if( intersectionPoint.z < this.terrainLimits.up ){return}
          if( intersectionPoint.z > this.terrainLimits.bottom ){return}

          this.selectedObject.container.userData.Me.MoveIt(intersectionPoint.x,intersectionPoint.z);

          

        }
        
        if(this.selectedObject.Action =='_anchor'){
          if( intersectionPoint.x < this.terrainLimits.left ){return}
          if( intersectionPoint.x > this.terrainLimits.right ){return}
          if( intersectionPoint.z < this.terrainLimits.up ){return}
          if( intersectionPoint.z > this.terrainLimits.bottom ){return}

          this.selectedObject.container.userData.Me.updateAnchor(intersectionPoint.x,intersectionPoint.z);



        }
      }
    }
    private addLight(){
      this.scene.add(new THREE.AmbientLight(0xffffff,1.5))
      let directionalLight = new THREE.DirectionalLight(0xffffff,1.5)
      directionalLight.castShadow = true
      directionalLight.position.set(0, 4, 4);
      directionalLight.target.position.set(0, 0, 0);
      this.scene.add(directionalLight)
      //directionalLight.shadow.camera.bottom = -4
      //this.scene.add(new THREE.DirectionalLightHelper(directionalLight))
      //this.scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));
   
    }
    private addToolEvents(){
      this.mousePosition = new THREE.Vector2();
      //general movment
      $('#app').on('pointermove', (event:any) => {
        this.updateMouseXY(event);
      })
      $('#app').on('pointerdown', (event: any) => {
        this.updateMouseXY(event);
        this.onDown = true;
      })
      $('#app').on('pointerup', (event: any) => {
        this.updateMouseXY(event);
        this.onDown = false;
        this.camera.controls.enabled = true
        this.selectedObject= {container:null,Action:"0"};
      })
    }
    private updateMouseXY(event:any){
      this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    private addLabel(text:string,cloneData:any){
      this.highlightSelected();
      const label:BaseObj = new BaseObj(
        this.scene,0.2,
        this.addedObgetcs.length,
        '',
        '',
        1,cloneData);

        label.isEquipment = false;
        label.isPlayer = false;

        label.isLabel = true;
        label.labelId = Date.now();

      this.pickableObjects.push(label._rotate);
      this.pickableObjects.push(label._move);
      this.addedObgetcs.push(label);
      this.lastSelectedObject={container:label.container,Action:''}
      if(cloneData){ 
        label.addText(cloneData.fontUrl,text);
      }
      else{ label.addText(this.SelectedFont.jsonurl,text);}
     //Poppins_Regular  Chatlong_Regular
    }
    private addEquipment(id:number,clonedbData:any){
      console.log( "addEquipment",id,clonedbData);
      //console.log(sportEquipment._object[id]);
      this.highlightSelected();

      const mp:BaseObj = new BaseObj(
        this.scene,
        0.2,
        this.addedObgetcs.length,
        sportEquipment._path,
        sportEquipment._object[id].pathObj,
        sportEquipment._object[id].SC,clonedbData);

        mp.isEquipment = true;
        mp.EquipmentId = id;

      mp.container.position.z = Math.random()*2
      this.pickableObjects.push(mp._rotate);
      this.pickableObjects.push(mp._move);
      this.addedObgetcs.push(mp)
      this.lastSelectedObject={
        container:mp.container,
        Action:''
      }
    }
    private ApplyTerrainTexture(index:number){
      this.terrain.setPitcheTexture(index);
    }
    
    private addPlayer(index:number,clonedbData:any,color_parts:playerParts) {
      this.highlightSelected();
      const player:Player = new Player(this.scene,0.2,this.addedObgetcs.length,
        sportCharaters._path,
        sportCharaters._object[index].pathObj,
        sportCharaters._object[index].SC,
        color_parts,
        clonedbData
        );
        player.playerid = index;
      player.container.position.x = Math.random()*2;
      this.pickableObjects.push(player.clickableZone);
      this.pickableObjects.push(player._rotate);
      this.pickableObjects.push(player._move);
      this.addedObgetcs.push(player);

      
      this.lastSelectedObject={
        container:player.container,
        Action:''
      }
    }
   private addShape(index:number){
    //console.log("addShape",index);
let ZDepth:number = 0.2;
if(index <2){ZDepth = 0.22;}//arrow always in top of a circular zone

   let shape1 =  new ShapeC(this.scene,index,ZDepth,
      this.addedObgetcs.length,
      '','',1,0xffff00,null);
    //this.pickableObjects.push(shape1.clickableZone);
   // this.pickableObjects.push(shape1._rotate);
    this.pickableObjects.push(shape1._move);
    this.pickableObjects.push(shape1._anchor);

    this.addedObgetcs.push(shape1);

    this.lastSelectedObject={container:shape1.container,Action:''}
   }
    highlightSelected(){
      if(this.selectedObject.container){
       // console.log(this.selectedObject.container.name)
        this.selectedObject.container.userData.Me.showTools();
      }
      this.addedObgetcs.forEach((ob:any)=>{
        if(ob == null){return;}
        if(ob.container.name != this.selectedObject.container?.name){
            ob.hideTools();
        }
      })
    }

    editUserData(_selected:string){

      //remove current scene objects
      this.clearScene();
     // console.log('edit User Data : ', _selected);
      //readj son file
      fetch('./'+_selected)
    .then((response) => response.json())
    .then((json) => {
    //  console.log(json);
      const SaveObj = json;
      console.log("-->",SaveObj);
      let t:number = 0;


      SaveObj.forEach((obj:any)=>{
      setTimeout(() => {
          let id:number = obj.Id//;
          let actual_rotation:number =  obj.rotation;
          let actual_CurrentScale:number =  obj.actual_CurrentScale;
          let actual_scaleCounter:number =  obj.actual_scaleCounter;
          let actual_color =  obj.color;

              //appy background image
              if(obj.bgUrl){
                this.setSceneBackground(obj.bgUrl);
              }
              else if( obj.type=="terrain"){
                this.terrain.setPitcheBorderColor(obj.borderColor);
                this.terrain.setTracageColor(obj.lineColor );
                this.terrain.setpitchColor(obj.pitchColor );
                this.ApplyTerrainTexture(obj.TextureIndex);
              }
              else if(obj.type=="camera"){
                this.camera.ToXaxe = obj.ToXaxe;
                this.camera.ToYaxe = obj.ToYaxe;
                this.camera.ToZaxe= obj.ToZaxe;
                this.camera.setCameraZoom(obj.Pos);
              }
            //clone equipment
            else if( obj.type=="equipment"){
              console.log("clone saved equipment");
            let clonedbData:any={
              actual_CurrentScale:actual_CurrentScale,
              actual_scaleCounter:actual_scaleCounter,
              rotation: actual_rotation,
              color:actual_color
            }
             this.addEquipment(id,clonedbData);
             //set position
             this.lastSelectedObject.container?.position.copy(obj.position );
            }


             //clone player
             else if(obj.type=="player"){
             // console.log("clone saved player");
              let clonedbData:any={
                actual_CurrentScale:actual_CurrentScale,
                actual_scaleCounter:actual_scaleCounter,
                rotation: actual_rotation
              }
              this.addPlayer(id,clonedbData,obj.playerPartsColors);
              //set position
              this.lastSelectedObject.container?.position.copy(obj.position );
            }

            //clone label
            else if(obj.type=="label"){
              console.log("clone saved label");
              let clonedbData:any={
                actual_CurrentScale:actual_CurrentScale,
                actual_scaleCounter:actual_scaleCounter,
                rotation: actual_rotation,
                fontUrl: obj.fontUrl,
                color:actual_color
              }
              let _text = obj.text;
              this.addLabel(_text,clonedbData);
              //set position
              this.lastSelectedObject.container?.position.copy(obj.position );
            }
          
      },  t);

          t+=100;
      })
  
      

    });

      
      
          
    }
    filpIt(){
      if (this.lastSelectedObject.container &&  this.lastSelectedObject.container.userData.Me._active){
        this.lastSelectedObject.container.userData.Me.FilpObj();
      }
    }
    scaleIt(){
      if (this.lastSelectedObject.container &&  this.lastSelectedObject.container.userData.Me._active){
        this.lastSelectedObject.container.userData.Me.scaleObj(0.1);
      }
    }
    cloneIt(){
      
      if (this.lastSelectedObject.container &&  this.lastSelectedObject.container.userData.Me._active){
        let id:number = 0//;
        let actual_rotation:number = 0;
        let actual_CurrentScale:number = 1;
        let actual_scaleCounter:number = 1;
        let actual_color =null;
        if(this.lastSelectedObject.container){
          actual_rotation = this.lastSelectedObject.container.rotation.y;
          actual_CurrentScale= this.lastSelectedObject.container.userData.Me.CurrentScale;
          actual_scaleCounter= this.lastSelectedObject.container.userData.Me.scaleCounter;
          //clone equipment
          if(this.lastSelectedObject.container.userData.Me.isEquipment){
          id = this.lastSelectedObject.container.userData.Me.EquipmentId;
          actual_color = this.lastSelectedObject.container.userData.Me.usedColor;
          let clonedbData:any={
            actual_CurrentScale:actual_CurrentScale,
            actual_scaleCounter:actual_scaleCounter,
            rotation: actual_rotation,
            color:actual_color
          }
           this.addEquipment(id,clonedbData);
          }
           //clone player
           if(this.lastSelectedObject.container.userData.Me.isPlayer){
            id = this.lastSelectedObject.container.userData.Me.playerid;
            actual_color = this.lastSelectedObject.container.userData.Me.defaultColors;
            //console.log('---->player simple clone @');
            //console.log('actual_color ',actual_color);
            let clonedbData:any={
              actual_CurrentScale:actual_CurrentScale,
              actual_scaleCounter:actual_scaleCounter,
              rotation: actual_rotation,
            }
            this.addPlayer(id,clonedbData,actual_color);
          }
          //clone label
          if(this.lastSelectedObject.container.userData.Me.isLabel){
            let _fontUrl = this.lastSelectedObject.container.userData.Me.fontUrl;
            actual_color = this.lastSelectedObject.container.userData.Me.usedColor;
            let clonedbData:any={
              actual_CurrentScale:actual_CurrentScale,
              actual_scaleCounter:actual_scaleCounter,
              rotation: actual_rotation,
              fontUrl:_fontUrl,
              color:actual_color
            }
            let _text = this.lastSelectedObject.container.userData.Me.text;
            this.addLabel(_text,clonedbData);
          }
        }
    }

    }
    removeIt(){
      if (this.lastSelectedObject.container &&  this.lastSelectedObject.container.userData.Me._active){
        //console.log('remove it');
        //remove from scene
        this.lastSelectedObject.container.userData.Me.destroy();
        //console.log('remove at index',this.lastSelectedObject.container.userData.Me._index)
        this.addedObgetcs[this.lastSelectedObject.container.userData.Me._index] = null;
       //console.log('ok -->addedObgetcs []',this.addedObgetcs)
        //refresh
       this.lastSelectedObject.container = null;
       this.selectedObject.container = null;
       $('#objTool').hide();
       this.highlightSelected();
      }
    }
    saveUserData(){
        //save players and equipments
        const AllObjs=[];
        for(let i :number = 0 ; i < this.addedObgetcs.length; i++){
          if(this.addedObgetcs[i] != null){
          let _id = 0;
          let _type:string='';
          let _text='';
          let _fontUrl='';
          let playerPartsColors:playerParts = {
          Shirt:'0xffffff',
          Shoulder:'0xffffff',
          Short:'0xffffff',
          Socks:'0xffffff',
          SocksTop:'0xffffff',
          SKin:'0xffffff',
          };

          if(this.addedObgetcs[i].isPlayer){
            _id = this.addedObgetcs[i].playerid;
            _type = "player";
            playerPartsColors = this.addedObgetcs[i].defaultColors;
            console.log('save player',playerPartsColors);
          }
          if(this.addedObgetcs[i].isEquipment){
            _id = this.addedObgetcs[i].EquipmentId;
            _type = "equipment";
            console.log('save equipment');
          }
          if(this.addedObgetcs[i].isLabel){
            _id = this.addedObgetcs[i].isLabel;
            _type = "label";
            _text = this.addedObgetcs[i].text;
            _fontUrl =  this.addedObgetcs[i].fontUrl;
            _text = this.addedObgetcs[i].text;
            console.log('save label');
          }
          let SaveObj:any={
            type:_type,
            Id:_id,
            playerPartsColors:playerPartsColors,
            actual_CurrentScale:this.addedObgetcs[i].CurrentScale,
            actual_scaleCounter:this.addedObgetcs[i].scaleCounter,
            rotation:this.addedObgetcs[i].container.rotation.y,
            color:this.addedObgetcs[i].usedColor,
            position:{
              x:this.addedObgetcs[i].container.position.x,
              y:this.addedObgetcs[i].container.position.y,
              z:this.addedObgetcs[i].container.position.z},
              text:_text,
              fontUrl:_fontUrl
          }
          
          AllObjs.push(SaveObj);
         // console.log(SaveObj);
         

        }
        }
        

        //save terrain
        let SaveTerrain:any={
          type:"terrain",
          borderColor:this.terrain._borderColor,
          lineColor:this.terrain._lineColor,
          pitchColor:this.terrain._pitchColor,
          TextureIndex :this.terrain.CurrentTextureIndex
        }
        console.log(JSON.stringify(SaveTerrain));
        //save background image
        console.log('backGroundImageUrl ',this.backGroundImageUrl);

         //save camera view and zoom
        // this.camera.ToYaxe
        //this.camera.ToXaxe;
        //this.camera.ToZaxe
        let SaveCamera:any={
          type:"camera",
          ToXaxe:this.camera.ToXaxe,
          ToYaxe:this.camera.ToYaxe,
          ToZaxe:this.camera.ToZaxe,
          Pos :{
            x:this.camera._camera.position.x,
            y:this.camera._camera.position.y,
            z:this.camera._camera.position.z}
        }
        console.log('camera',SaveCamera);

        AllObjs.push({bgUrl:this.backGroundImageUrl});
        AllObjs.push(SaveTerrain);
        AllObjs.push(SaveCamera);
      

        console.log("@ SS",AllObjs);
       // console.log(JSON.stringify(AllObjs));


        let save_name:any = $('#save_work input').val()+".json";
        save(JSON.stringify(AllObjs),save_name);
    }
    clearScene(){
      console.log('l1',this.addedObgetcs)
      this.lastSelectedObject.container = null;
      this.selectedObject.container = null;
      $('#objTool').hide();

      this.addedObgetcs.forEach((obj:any)=>{
        if(obj == null){return;}
         //remove from scene
         obj.container.userData.Me.destroy();
      })
      this.addedObgetcs = [];
        //refresh
    }
    getCanvasContent(){
      return this.renderer.domElement.toDataURL();
    } 
}

$(function () {
   new App();

});
