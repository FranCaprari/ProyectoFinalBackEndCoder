const socket = io.connect();


const email = document.getElementById("email");
const mensaje = document.getElementById("mensaje");


const formPublicarMensaje = document.getElementById("formPublicarMensaje");
formPublicarMensaje.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!mensaje.value){
        mensaje.focus();
        return (errorMsj.textContent = "Complete este campo")
    } else {
        mensaje.focus();
        errorMsj.textContent = "";
    }
    const message = {
        message: mensaje.value,
        id_user: email.textContent,
    };
    mensaje.value="";
    mensaje.focus();
    socket.emit("newMensaje", message)
})


    const renderMessages = (mensajes) => {
    const html = mensajes
        .map((msj) => {
        return `
            <div class="historial">
                <b style="color:blue;">${msj.id_user}</b>
                [<span style="color:brown;">${msj.timestamp}</span>] :
                <i style="color:green;">${msj.message}</i>
            </div>`;
        })
        .join(" ");
        document.getElementById("mensajes").innerHTML = html;
};

    socket.on("mensajes", (data) => {
    renderMessages(data)
});

