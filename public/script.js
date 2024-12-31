const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const colorPicker = document.getElementById('colorPicker')
const eraserToggle = document.getElementById('eraserToggle')
const clearButton = document.getElementById('p')

canvas.width = window.innerWidth*0.8;
canvas.height = window.innerHeight*0.6;


let drawing = false
const socket = io();
let currentColor = colorPicker.value;
let isEraserActive = false;

function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; // Scaling factor for width
    const scaleY = canvas.height / rect.height; // Scaling factor for height
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
    };
}

colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    console.log("update color",currentColor)

})

eraserToggle.addEventListener('click', () => {
    isEraserActive = !isEraserActive; // Toggle eraser state
    if (isEraserActive) {
        eraserToggle.textContent = 'Drawing Mode';
        clearButton.textContent ='Click for Drawing' // Update button text
    } else {
        eraserToggle.textContent = 'Eraser';
        clearButton.textContent ='Select Eraser :' // Update button text
    }
})



canvas.addEventListener('mousedown',(e)=>{
    
    drawing=true;
    ctx.beginPath();
    const { x, y } = getMousePosition(e);
    
    socket.emit("ondown",{x,y})
})
canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return true;
    const { x, y } = getMousePosition(e);

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    // ctx.strokeStyle = isEraserActive ? '#FFFFFF' : currentColor;
    if(isEraserActive){
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth=15
        ctx.lineCap = 'square'
    }else{
        ctx.strokeStyle = currentColor
    }
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x,y)

    socket.emit('drawing',{x,y, color:ctx.strokeStyle, width:ctx.lineWidth})
    

})

canvas.addEventListener('mouseup',()=>{
    drawing=false;
    ctx.closePath();
    
})

socket.on('down',(data)=>{
    const {x,y}=data;
    ctx.moveTo(x,y)
})

socket.on('drawing',(data)=>{
    const {x,y,color,width}=data;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    ctx.lineTo(x,y)
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x,y)
})