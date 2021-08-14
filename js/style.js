let p1 = document.getElementById("p1");
let p2 = document.getElementById("p2");
let p3 = document.getElementById("p3");
let active_piston = ["j","k","l"]
let temp_boxShadow = null


window.addEventListener("keydown",(e)=>{
    
    if(active_piston.includes(e.key)){
        let piston = document.getElementById(e.key)
       piston.style.top = "0.6em";
       temp_boxShadow = piston.style
       piston.style.boxShadow = "0 0.3em rgba(0, 0, 0, 0.4)"
    }

});
window.addEventListener("keyup",(e)=>{
    if(active_piston.includes(e.key)){
       let piston = document.getElementById(e.key)
    piston.style = piston.style
    }

});
