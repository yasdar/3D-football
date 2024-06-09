import { SavedList, bgs_data, font_data, pitchesTextures, player_color_parts, shapes_data, sportCharaters, sportEquipment } from "./config";
import $ from "jquery";
import gsap from "gsap";

export const DataUI:any={
    actualPanelId:'',
    actualBt:''
}
export const addEList = ()=>{
    for(let line:number = 0 ; line<sportEquipment._object.length; line++){
        let _name:string = sportEquipment._object[line].name;
      $('#equipmentsC').append('<div id="E_'+line+'" class="" ><img alt="'+_name+'" class="clickable" src="assets/obj/equipmentsFootBall/img/'+_name+'.png"></div>');    
    } 

}

export const addPitcheList = ()=>{
    for(let line:number = 0 ; line<pitchesTextures.length; line++){
        let _name:string = pitchesTextures[line].name;
      $('#pitchesC').append('<div id="P_'+line+'" class="nonSelectedBt " ><img alt="'+_name+'" class="clickable" src="assets/obj/pitches/img/'+_name+'.png"></div>');    
     
    } 
}

export const addBgsList = ()=>{
    for(let b:number = 0 ; b<bgs_data.length; b++){
        let _name:string = bgs_data[b].name;
      $('#bgsC').append('<div id="bg_'+b+'" class="nonSelectedBt " ><img alt="'+_name+'" class="clickable" src="assets/images/'+_name+'m.png"></div>');    
    } 
}

export const addshapesList = ()=>{
    for(let b:number = 0 ; b<shapes_data.length; b++){
        let _name:string = shapes_data[b].name;
      $('#shapesC').append('<div id="shape_'+b+'" class="nonSelectedBt " ><img alt="'+_name+'" class="clickable" src="assets/images/'+_name+'.png"></div>');    
    } 
}

export const addPlayersList = ()=>{
    for(let p:number = 0 ; p< sportCharaters._object.length; p++){
        let _name:string = sportCharaters._object[p].name;
      $('#playersC').append('<div id="PL_'+p+'" class="nonSelectedBt  " ><img alt="'+_name+'" class="clickable" src="assets/obj/player2/img/'+_name+'.png"></div>');    
     
    } 
}

export const addTextsList = ()=>{
    //add possible fonts
    for(let f:number = 0 ; f <font_data.length; f++){
        let _name:string = font_data[f].name;
      $('#textsC').append('<div id="FT_'+f+'" class="nonSelectedBt textcase" ><p class="clickable" style="font-family:'+_name+';">'+_name+'</p></div>');    
    } 
    $('#btAddText').appendTo('#textsC');
}

export const handleFontsselection = (index:number)=>{
    for(let p:number = 0 ; p<font_data.length; p++){
        $('#FT_'+p).removeClass('selectedBt');
        $('#FT_'+p).addClass('nonSelectedBt');
        }
    $('#FT_'+index).removeClass('nonSelectedBt');
    $('#FT_'+index).addClass('selectedBt');
}

export const ActivateRightBt = ()=>{
const bt_panels:Array<any>=[
    {bt:'#EquipmentsBt',panel:'#equipments'},
    {bt:'#PitchesBt',panel:'#pitches'},
    {bt:'#PlayersBt',panel:'#players'},
    {bt:'#kitsBt',panel:'#kits'},
    {bt:'#bgsBt',panel:'#bgs'},
    {bt:'#TextBt',panel:'#texts'},
    {bt:'#ShapeBt',panel:'#_shapes'}
];
bt_panels.forEach((obj:any)=>{
//show equpments
$(obj.bt).on('pointerdown', (event: any) => {
    if(DataUI.actualPanelId.length>1){
        gsap.to(DataUI.actualPanelId, { left: '-12%', duration: 0.2 ,
        onComplete:()=>{
            DataUI.actualPanelId = '';
             $(DataUI.actualBt).removeClass('selectedBt');
             $(DataUI.actualBt).addClass('nonSelectedBt');
         }
    }); 
    }


    var left = $( obj.panel).css("left");
    if(left == "40px"){
        gsap.to( obj.panel, { left: '-12%', duration: 0.2 ,
        onComplete:()=>{
            $(DataUI.actualBt).removeClass('selectedBt');
            $(DataUI.actualBt).addClass('nonSelectedBt');
            DataUI.actualPanelId = '';
            }
    });
        $(obj.bt).removeClass('selectedBt');
        $(obj.bt).addClass('nonSelectedBt');
    }
    else{ 
        gsap.to( obj.panel, { left: '40px', duration: 0.2,
        onComplete:()=>{DataUI.actualPanelId =  obj.panel; DataUI.actualBt=obj.bt}
         });
        $(obj.bt).removeClass('nonSelectedBt')
        $(obj.bt).addClass('selectedBt')
    }
    });
})

}
export const handlePitcheselection = (index:number)=>{
    for(let p:number = 0 ; p<pitchesTextures.length; p++){
        $('#P_'+p).removeClass('selectedBt');
        $('#P_'+p).addClass('nonSelectedBt');
        }
    $('#P_'+index).removeClass('nonSelectedBt');
    $('#P_'+index).addClass('selectedBt');
}

export const handlePlayersselection = (index:number)=>{
   
    for(let p:number = 0 ; p<sportCharaters._object.length; p++){
        $('#PL_'+p).removeClass('selectedBt');
        $('#PL_'+p).addClass('nonSelectedBt');
        }
    $('#PL_'+index).removeClass('nonSelectedBt');
    $('#PL_'+index).addClass('selectedBt');
}


export const handleBgsselection = (index:number)=>{
    for(let p:number = 0 ; p<bgs_data.length; p++){
        $('#bg_'+p).removeClass('selectedBt');
        $('#bg_'+p).addClass('nonSelectedBt');
        }
    $('#bg_'+index).removeClass('nonSelectedBt');
    $('#bg_'+index).addClass('selectedBt');
}

export const save = (_data:any,_fileName:string)=>{
        $.ajax({
            type: "POST",
            dataType: 'text',
            url: "save.php",//http://localhost:8080/3D/src/
            data: {
				data : _data,
				file : _fileName,
			}
        })
            .fail( (xhr, textStatus, errorThrown)=> {
                console.log("!",xhr.responseText);
                console.log("!",textStatus);
                console.log("php - Connection Error");
            })
            .done((data)=> {
                console.log("php success",data);
                //refresh the list
                setTimeout(() => { getSavedData();}, 1000);
            });
}

/*
const text = '[{"Id":24,"File_name":"savedB.json","Date":"2024-04-18 10:21:12.275162"},{"Id":23,"File_name":"savedA.json","Date":"2024-04-18 10:20:47.000000"}]';
const myArr = JSON.parse(text);
document.getElementById("demo").innerHTML = myArr[0].Id;
*/
export const getSavedData = ()=>{
    //do this only one time, after user log-in
    //post player table name to fetch.php and get data
    //example of data : '[{"Id":24,"File_name":"savedB.json","Date":"2024-04-18 10:21:12.275162"},{"Id":23,"File_name":"savedA.json","Date":"2024-04-18 10:20:47.000000"}]'
    $.ajax({
        type: "GET",
        dataType: 'text',
        url: "fetch.php"//http://localhost:8080/3D/src/
    })
        .fail( (xhr, textStatus, errorThrown)=> {
            console.log("!",xhr.responseText);
            console.log("!",textStatus);
            console.log("php - Connection Error");
        })
        .done((data)=> {
            console.log("@fetch php success",data);
            if(data == 'Empty'){return;}

            const List = JSON.parse("["+data+"]");
            SavedList.List = List;
            console.log("@SavedList.List",SavedList.List);
            //populate the dropbown

            $('#filesList').find('option').remove();
            SavedList.List.forEach((item:any)=>{
                $("#filesList").append('<option value="'+item.File_name+'">'+item.File_name.replace('.json','')+'</option>');
            })
           

        });
   
   
   
      
    
}


export const initButtons = ()=>{
    $('#bt_save').on('pointerdown', (event: any) => {
        console.log("click",event.target);
        hideallPopsUp();
        
        $('.blackLayer').show();
        $('#save_work').show();
    });
    $('#bt_edit').on('pointerdown', (event: any) => {
        console.log("click",event.target);
        hideallPopsUp();
        $('.blackLayer').show();
        $('#edit_work').show();
    });

    $('.blackLayer').on('pointerdown', (event: any) => {
        event.stopPropagation();
        hideallPopsUp();
    });


     //Must
     $('.bottomTools').on('pointerdown', (event: any) => {
        event.stopPropagation();
      });
       //Must
       $('.rightTools').on('pointerdown', (event: any) => {
        event.stopPropagation();
      });
}
export const hideallPopsUp = ()=>{
    $('#save_work').hide();
    $('#edit_work').hide();
    $('.blackLayer').hide();
}
/* save data */
export const saveUserData_UI = (func:Function)=>{
    $('#save_work button').on('pointerdown', (event: any) => {
       $('#save_work .infoUI').hide();
       let Override_data:boolean = false;
       //text alert
       if( !$('#save_work input').val() ) { $('#save_work input').addClass('AlertBorder'); return;}
       if(  $('#save_work input').val() ) { $('#save_work input').removeClass('AlertBorder');}
       //override exting file option
       if ($('#check_override').is(":checked")){Override_data = true;}
       //if no override check the name in the list
       if(!Override_data){
        let _list:Array<any> = SavedList.List;
        //console.log("@1",$('#save_work input').val())
       // console.log("@2",_list[0].File_name)

        if(_list && _list.find(item => item.File_name.replace('.json','') == $('#save_work input').val())){
         //name exist : show Alert
         $('#save_work .infoUI').show();
         $('#save_work .infoUI').text('File name already exist!');
         return;
         }
       }
       console.log("execute save with Override_data : ", Override_data)
       func();
       hideallPopsUp();
    });
}

/*edit data */
export const editUserData_UI = (func:Function)=>{
    $('#edit_work button').on('pointerdown', (event: any) => {
        let selected = $('#filesList').find(":selected").val();
        //console.log('edit the selection',selected)
        func(selected);
        hideallPopsUp();
    });
}

/*add label*/
export const addlabel_UI = (func:Function)=>{
    $('#btAddText').on('pointerdown', (event: any) => {
        let selected = $('#userText').val();
        func(selected,null);
    });
}

/*change background image */
export const changeBackgroundImage_UI = (func:Function)=>{
    for(let b:number = 0 ; b<bgs_data.length; b++){
        $('#bg_'+b).on('pointerdown',()=>{
          handleBgsselection(b);
          func(bgs_data[b].url);
        });
        }
}

/*change Pitche texture */
export const changePitcheTexture_UI = (func:Function)=>{
    for(let p:number = 0 ; p<pitchesTextures.length; p++){
        $('#P_'+p).on('pointerdown',()=>{
        handlePitcheselection(p);
        func(p);
        });
        }
}
/*change characters : players/referee ... */
export const changeCharacters_UI = (func:Function)=>{
    for(let p:number = 0 ; p<sportCharaters._object.length; p++){
        $('#PL_'+p).on('pointerdown',()=>{
          handlePlayersselection(p)
          func(p,null,player_color_parts);
        });
        }
}

/*change texts */
export const changeTexts_UI = (func:Function)=>{
    for(let f:number = 0 ; f<font_data.length; f++){
        $('#FT_'+f).on('pointerdown',()=>{
          handleFontsselection(f);
          func(f);
        });
        }
}

/*change equipments */
export const changeEquipments_UI = (func:Function)=>{
    for(let line:number = 0 ; line<sportEquipment._object.length; line++){
        $('#E_'+line).on('pointerdown',()=>{func(line,null);});
        }
}

/*add zone : arrow or circle */
export const addZone_UI = (func:Function)=>{
    for(let z:number = 0 ; z<shapes_data.length; z++){
        $('#shape_'+z).on('pointerdown',()=>{func(z,null);});
        }
}
/*Flip button */
export const Filp_UI = (func:Function)=>{
    $('#bt_flip').on('pointerdown',()=>{func();});
}
/*scale button */
export const Scale_UI = (func:Function)=>{
    $('#bt_scale').on('pointerdown',()=>{func();});
}
/*remove button */
export const Remove_UI = (func:Function)=>{
    $('#bt_trash').on('pointerdown',()=>{func();});
}
/*clone button */
export const Clone_UI = (func:Function)=>{
    $('#bt_clone').on('pointerdown',()=>{func();});
}

/** export scene as png */
export const exportAsImage_UI = (func:Function)=>{
    $('#bt_export').on('pointerdown', (event: any) => {
        var dataURL = func();
        var link = document.createElement("a");
        link.download = "screen.png";
        link.href = dataURL;
        link.target = "_blank";
        link.click();
      });
}




export const hexToRgb = (hex:any)=> {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  