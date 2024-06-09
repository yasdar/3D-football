/* interfaces */
interface tools_Options {
  maxScale: number;
  minScale: number;
}

interface equipments_data {
  _path: string; //absolute path folder
  _object: Array<{ name: string; pathObj: string; SC: number }>;
}

interface characters_data extends equipments_data {}

interface pitches_T {
  name: string;
  texture: string;
  opacity: number;
}

interface background_image {
  name: string;
  url: string;
}

interface text_fonts {
  name: string;
  pathObj: string;
}
/**
 *Options of tools
 */
export const Tools_Options: tools_Options = {
  maxScale: 2.5,
  minScale: 1,
};
/**
 *data about equipments
 * @param eqipments_path : absolute path (folder ) in server
 * @param equipments_sport : data of equipmnets
 */
export const sportEquipment: equipments_data = {
  _path: "./assets/obj/equipmentsFootBall/obj",
  _object: [
    { name: "flag", pathObj: "/equipment_0001_flag.glb", SC: 0.6 },
    {
      name: "football",
      pathObj: "/equipment_0002_football.glb",
      SC: 0.2 * 0.6,
    },
    { name: "hurdle", pathObj: "/equipment_0005_hurdle.glb", SC: 0.2 },
    { name: "ladder", pathObj: "/equipment_0004_ladder.glb", SC: 0.02 },
    { name: "disc", pathObj: "/equipment_0006_disc.glb", SC: 0.05 },
    { name: "pole", pathObj: "/equipment_0007_pole.glb", SC: 0.7 },
    { name: "mannequin", pathObj: "/equipment_0008_mannequin.glb", SC: 0.5 },
    { name: "minigoal", pathObj: "/equipment_0010_minigoal.glb", SC: 0.33 },
    { name: "goal", pathObj: "/equipment_0009_goal.glb", SC: 0.555 },
    { name: "passingarc", pathObj: "/equipment_0011_passingarc.glb", SC: 0.33 },
    {
      name: "balanceball",
      pathObj: "/equipment_0012_balanceball.glb",
      SC: 0.1,
    },
    {
      name: "largehurdle",
      pathObj: "/equipment_0013_largehurdle.glb",
      SC: 0.33,
    },
    {
      name: "reboundboard1",
      pathObj: "/equipment_0014_reboundboard1.glb",
      SC: 0.33,
    },
    {
      name: "reboundboard2",
      pathObj: "/equipment_0015_reboundboard2.glb",
      SC: 0.33,
    },
    {
      name: "agilitycones",
      pathObj: "/equipment_0016_agilitycones.glb",
      SC: 0.33,
    },
    { name: "cartyre", pathObj: "/equipment_0024_cartyre.glb", SC: 0.15 },
    {
      name: "flatdiscmarker",
      pathObj: "/equipment_0031_flatdiscmarker.glb",
      SC: 0.015,
    },
    {
      name: "headtennisnet",
      pathObj: "/equipment_0034_headtennisnet.glb",
      SC: 0.5,
    },
    { name: "speedrings", pathObj: "/equipment_0017_speedrings.glb", SC: 0.04 },
  ],
};
//backgrounds
export const bgs_data: background_image[] = [
  { name: "bg1", url: "./assets/images/bg1.jpg" },
  { name: "bg2", url: "./assets/images/bg2.jpg" },
  { name: "bg3", url: "./assets/images/bg3.jpg" },
  { name: "bg4", url: "./assets/images/bg4.jpg" },
];
//Terrain
export const pitchesTextures: pitches_T[] = [
  {
    name: "grassIco",
    texture: "./assets/obj/pitches/img/grass.png",
    opacity: 0.4,
  },
  {
    name: "checkerIco",
    texture: "./assets/obj/pitches/img/checker.png",
    opacity: 1,
  },
  {
    name: "stripesIco",
    texture: "./assets/obj/pitches/img/stripes.png",
    opacity: 1,
  },
  {
    name: "circlesIco",
    texture: "./assets/obj/pitches/img/circles.png",
    opacity: 1,
  },
];
export const pitchmarks = {
  path: "./assets/obj/pitches/obj",
  obj: "/pitchmarks_0001_standard.glb",
};

//characters :
export const sportCharaters: characters_data = {
  _path: "./assets/obj/player2/footballers",
  _object: [
    { name: "celebration2", pathObj: "/Celebration 2.obj", SC: 0.7 }, //Celebration 2.obj
    { name: "celebration3", pathObj: "/Celebration 3.obj", SC: 0.7 }, //Celebration 3.obj
    { name: "shooting", pathObj: "/R3.fbx", SC: 0.7 }, //Shooting.obj
    { name: "Stand On Ball", pathObj: "/GK13.fbx", SC: 0.7 }, //Stand On Ball.obj
    { name: "tackle", pathObj: "/F1.fbx", SC: 0.7 }, //Tackle.obj
  ],
};
//possible material names to color ( in each character)
export const players_material_names: Array<string> = ["skin", "clothes"];

//fonts
export const font_data: text_fonts[] = [
  { name: "Chatlong", pathObj: "./css/Chatlong_Regular.json" },
  { name: "Poppins", pathObj: "./css/Poppins_Regular.json" },
];

//shapes
export const shapes_data: any = [
  { name: "line1", url: "./assets/images/line1.png",dashed:false,fillColor:true },
  { name: "line2", url: "./assets/images/line2.png",dashed:true,fillColor:true },
  { name: "zone1", url: "./assets/images/zone1.png",dashed:false,fillColor:false },
  { name: "zone2", url: "./assets/images/zone2.png",dashed:true,fillColor:false },
  { name: "fillzone", url: "./assets/images/fillzone.png",dashed:false,fillColor:true,fillOpacity:0.2 }
];

//set color pickers properties
import Coloris from "@melloware/coloris";

export const addEquipmentsColorPicker = (func:any)=>{
  Coloris.setInstance('.instance1', {
    closeButton: true,
    closeLabel: 'OK',
    clearButton: true,
    clearLabel: 'Clear',
    onChange: func
  });
}


const commonSwatches=[
  '#60db0d','#59D5E0','#E26EE5','#268b07','#e76f51',
  '#d62828','#F5DD61','#FAA300','#0096c7','#00b4d8','#48cae4'];

export const addPitchBorderColorPicker = (func:any)=>{
  Coloris.setInstance('.instance2', {
    swatchesOnly: true,
    swatches: commonSwatches,
    onChange:func
  });
}
export const addPitchLineColorPicker = (func:any)=>{
Coloris.setInstance('.instance3', {
  swatchesOnly: true,
  swatches:commonSwatches,
  onChange:func
});
}

export const addPitchColorPicker= (func:any)=>{
Coloris.setInstance('.instance4', {
  swatchesOnly: true,
  swatches:commonSwatches,
  onChange: func
});
}

const commonSwatchesPlayer =[
  '#0000ff','#ffff00','#00ff00','#268b07','#e76f51',
  '#d62828','#F5DD61','#FAA300','#0096c7','#FFFFFF','#000000'];

export const addplayerClothesColorPicker= (func:any,instance:string)=>{
  Coloris.setInstance(instance, {
    swatchesOnly: true,
    swatches:commonSwatchesPlayer,
    onChange: func
  });
  }

  export const addplayerSkinColorPicker= (func:any,instance:string)=>{
    Coloris.setInstance('.instance10', {
      swatchesOnly: true,
      swatches:[
        '#fbf3ed','#f3d8c4','#c58c85', 
        '#ecbcb4', '#d1a3a4', '#a1665e', 
        '#503335','#3d210b'],
      onChange: func
    });
    }

  export const coloris_Close_Event = (func:any)=>{
    document.addEventListener('close', (event:any) => {
      const E:HTMLElement = event.target;
      func(Number(E.className.replace('coloris instance','')));
    });
  }

  export interface playerParts{
      Shirt:string,
      Shoulder:string,
      Short:string,
      Socks:string,
      SocksTop:string,
      SKin:string
  }
  export const player_color_parts:playerParts ={
      Shirt:'0xff0000',
      Shoulder:'0xfff000',
      Short:'0x0fff00',
      Socks:'0xfff000',
      SocksTop:'0x00ff00',
      SKin:'0xffdbac'
  }


  export const SavedList:any ={
    List:[]
  }