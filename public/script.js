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

// Function to get touch position on the canvas for mobile
function getTouchPosition(event) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0] || event.changedTouches[0];

    return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height),
    };
}


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
    console.log("input event start")
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

// Touch Events for Mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevents page from scrolling while drawing
    drawing = true;
    ctx.beginPath();
    const { x, y } = getTouchPosition(e);
    socket.emit("ondown", { x, y });
});



canvas.addEventListener('mousedown',(e)=>{
    
    drawing=true;
    ctx.beginPath();
    const { x, y } = getMousePosition(e);
    
    socket.emit("ondown",{x,y})
})



canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevents unwanted scrolling
    if (!drawing) return;

    const { x, y } = getTouchPosition(e);

    ctx.lineWidth = isEraserActive ? 15 : 5;
    ctx.lineCap = isEraserActive ? 'square' : 'round';
    ctx.strokeStyle = isEraserActive ? '#FFFFFF' : currentColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    socket.emit('drawing', { x, y, color: ctx.strokeStyle, width: ctx.lineWidth });
});

canvas.addEventListener('touchend', () => {
    drawing = false;
    ctx.closePath();
});






canvas.addEventListener('mousemove', (e) => {
    console.log("Mouse move envent start")
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
    console.log("when drawing strt")
    

})

canvas.addEventListener('mouseup',()=>{
    console.log('mouse up event start')
    drawing=false;
    ctx.closePath();
    
})

socket.on('down',(data)=>{
    console.log("mousedown event start")
    const {x,y}=data;
    ctx.moveTo(x,y)
})

socket.on('drawing',(data)=>{
    console.log("drawing event start")
    const {x,y,color,width}=data;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    ctx.lineTo(x,y)
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x,y)
})
