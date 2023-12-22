const socketClient = io();

const chatbox = document.getElementById("chatbox");
const chat = document.getElementById("messageLogs");

let user;

Swal.fire({
    title: "Ingresa tu nickname",
    input: "text",
    text: "Ingresa un nombre de usuario para el chat",
    inputValidator: (value) => {
        if (!value) {
            return "El nombre de usuario es obligatorio"
        }
    },
    allowOutsideClick: false
}).then((result) => {
    user = result.value;
    socketClient.emit("authenticated", `usuario ${user} ha iniciado sesión`)
});

chatbox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        if (chatbox.value.trim().length > 0) {//corrobamos que el usuario no envie datos vacios
            socketClient.emit("message", { user: user, message: chatbox.value });
            chatbox.value = "";//borramos el campo
        }
    }
});

socketClient.on("messageHistory", (dataServer) => {
    let messageElmts = "";
    dataServer.forEach(item => {
        messageElmts = messageElmts + `${item.user}: ${item.message} <br/>`
    });
    chat.innerHTML = messageElmts;
});

socketClient.on("newUser", (data) => {
    if (user) {
        //si ya el usuario esta autenticado, entonces puede recibir notificaciones
        Swal.fire({
            text: data,
            toast: true,
            position: "top-right"
        });
    }
});