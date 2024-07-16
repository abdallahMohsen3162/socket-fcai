const Trie = require('./datastructure.js');
const { insertMessage } = require('./database');

const io = require("socket.io")(8900, {
  cors: {
    origin: "*",
  }
});

function procces_string(message){
  let msg = ``
  let cnt = 0;
  for(let i = 0; i < message.length; i++){
    if(cnt == 20){
      cnt = 0;
      msg += `\n`;
    }
    msg += message[i];
    cnt++;
  }
  return msg;
}


let arr = [];
let trie = new Trie();
let mp = new Map() // from socket id to user id

io.on("connection", (socket) => {
  socket.on("send", (data) => {
    console.log(data);
    trie.insert(data.key, data.value); 
    console.log(process.env.SECRET);
    for (let i = 0; i < arr.length; i++) {
      socket.to(arr[i]).emit("notification", data);
    }
  });

  socket.on("disconnect", () => {
    arr.splice(arr.indexOf(socket.id), 1);
    console.log(`Socket ${socket.id} disconnected`);
    if(mp.get(socket.id)){
        trie.delete(mp.get(socket.id), socket.id);
    }
    mp.delete(socket.id);
  });


  socket.on('new-user-add', (data) => {
    trie.insert(data, socket.id);
    mp.set(socket.id, data);
    console.log("trie", trie.search(data));
  });

  socket.on("send-message-to", async (data) => {
    console.log(data);
    let name = data.name;
    let reciverId = data.reciverId;
    let senderId = data.senderId;
    let message = data.message;
    let time = new Date();
    message = procces_string(message);
    socket.to(socket.id).emit("notification", {name, reciverId, senderId, message});

    trie.search(reciverId).forEach((socketId) => { 
      console.log("will send to:",socketId);
      socket.to(socketId).emit("notification", {name, reciverId, senderId, message});
    })

    await insertMessage(senderId, reciverId, message, time);
    })


    socket.on("typing", (data) => {
      let reciverId = data.reciverId
      let senderId = data.senderId
      trie.search(reciverId).forEach((socketId) => {
        socket.to(socketId).emit("accept_typing", {senderId});
      })
    })
  
});
