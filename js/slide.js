const more = document.getElementById('more-icon');
const nav = document.getElementById('nav');
const page = document.getElementById('page');

let active = 0;


more.onclick = () =>{
    if (active == 0){
        active += 1;
        nav.style.marginLeft = '0px';
        nav.style.backgroundColor = 'rgb(85,85,85,0.5)';
    }
}

nav.onclick = () =>{
    if(active == 1){
        active -= 1;
        nav.style.marginLeft = '-780px';
        nav.style.backgroundColor = 'transparent';
    }
}


