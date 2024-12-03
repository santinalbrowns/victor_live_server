let socket = new WebSocket("ws://192.168.8.100:3000");

socket.addEventListener("open", () => {
    console.log("Connected");
})

socket.addEventListener("message", (event) => {
    const message = event.data;

    console.log(message);
})

socket.addEventListener("close", () => {
    console.log('Connection closed');
})

socket.addEventListener("error", (error) => {
    console.log(error);
})