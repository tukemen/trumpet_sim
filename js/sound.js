const sound = new (window.AudioContext || window.webkitAudioContext)();

// スクリプトはhtml要素が読み込まれた後に書かないとgetElementはnullになる
let volumeCtrl = document.getElementById("vol")
volumeCtrl.addEventListener("change",changeVolume);

let mainGainNode = sound.createGain();
mainGainNode.connect(sound.destination);
mainGainNode.gain.value = volumeCtrl.value;

let sound_obj = [];
let pressed_key = null;
let piston1 =1,piston2 =1,piston3 = 1;
let temp_freq = null;
let freq_changer = 1;
let current_tone = 2;

const freq_list = {
                    "z":233.08, 
                    "x":349.228, 
                    "c":466.164, 
                    "v":587.33,
                    "a":698.456,
                    "s":932.328,
                    "d":1396.91,
                    "f":1864.66,
                }

const piston_list = {
                    "j":[false,2 ** (2/12)],
                    "k":[false,2 ** (1/12)],
                    "l":[false,2 ** (3/12)],
                }

const tone_list = ["sine","square","sawtooth","triangle"]
let right_btn = document.getElementById("right");
let left_btn = document.getElementById("left");

right_btn.addEventListener("click",changeTone_R)
left_btn.addEventListener("click",changeTone_L)


function changeTone_R(event){
    (current_tone<3)?current_tone++:current_tone=0;
    let tone = document.getElementById("tone");
    tone.textContent = tone_list[current_tone];
}

function changeTone_L(event){
    (current_tone>0)?current_tone--:current_tone=3;
    let tone = document.getElementById("tone");
    tone.textContent = tone_list[current_tone];
}


function makeOscNode(freq){
    let osc = sound.createOscillator();
    osc.connect(mainGainNode);
    osc.type = tone_list[current_tone];
    osc.frequency.value = freq;
    return osc;
}

function changeVolume(event){
    mainGainNode.gain.value = volumeCtrl.value
}

window.addEventListener("keydown",(e)=>{
   if(!e.repeat &&e.key in piston_list && !piston_list[e.key][0]){
        piston_list[e.key][0] = true;
        piston1 = (piston_list["j"][0]?piston_list["j"][1]:1)
        piston2 = (piston_list["k"][0]?piston_list["k"][1]:1)
        piston3 = (piston_list["l"][0]?piston_list["l"][1]:1)   
   }

   if((e.key in freq_list ||e.key in piston_list)&& !e.repeat){
        
        if(e.key in freq_list){
            pressed_key = e.key;
            sound_obj.push( makeOscNode(freq_list[e.key]));
            
            if(sound_obj.length != 1){
                
                sound_obj[0].stop();
                let garbage = sound_obj.shift();
                delete garbage;
            }
            
            temp_freq = sound_obj[0].frequency.value
        }
        if(e.key in piston_list){
            freq_changer =  piston1*piston2*piston3;
        }
        if(sound_obj[0]){
            sound_obj[0].frequency.value = temp_freq/freq_changer;
            
            e.key in freq_list? sound_obj[0].start():1;
        }
        
    }


})
window.addEventListener("keyup",(e)=>{
    if(e.key in piston_list  ){
        if(piston_list[e.key][0]){
            piston_list[e.key][0] = false;
            piston1 = (piston_list["j"][0]?piston_list["j"][1]:1)
            piston2 = (piston_list["k"][0]?piston_list["k"][1]:1)
            piston3 = (piston_list["l"][0]?piston_list["l"][1]:1)
            freq_changer =  piston1*piston2*piston3;
        }
    
        if ( sound_obj[0] ){
            sound_obj[0].frequency.value *= piston_list[e.key][1]
        }
    }
    if(e.key in freq_list && e.key == pressed_key){
        
        sound_obj[0].stop();
        let garbage = sound_obj.shift();
        delete garbage;
    }
    
})


  
  