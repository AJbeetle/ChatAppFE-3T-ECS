import {useState, useRef, useEffect} from "react"
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";

interface chatBox {
    setRoom :  React.Dispatch<React.SetStateAction<boolean>>,
    roomId : string,
    user : string,
    userId: string,
    userAvatar : string
}

const BACKEND_URL:string = import.meta.env.VITE_BACKEND_BASE_URL;    

export default function ChatBoxComponent(props:chatBox){
     // So I want whenever my chat application mounts I want to establish the websockets initialising TCP connection.
    interface CHAT {
        user?:string,
        reply?:string
    }

    const [socket, setSocket] = useState<WebSocket>();
    // const [chat, setChat] = useState([
    //   {user:"dummy Chat",reply:"dummy Reply"}
    // ]);
    const [chat, setChat] = useState<CHAT[]>([]);
    const sendRef = useRef<HTMLDivElement>(null);
    const inpRef = useRef<HTMLInputElement>(null);
    const replyRef = useRef<HTMLDivElement>(null);

    function callWebSocket():void{
        // setChat(t => t.push(inpRef.current.value))
  
        if(!inpRef.current?.value){
          return;
        }
        const toSend = {
            type : "chat",
            payload  : {
                message : inpRef.current?.value,
                roomId : props.roomId
            }
        }
        socket?.send(JSON.stringify(toSend));
        console.log("CHAT PAYLOAD SENT")
        
        let m = [...chat,
          {user: inpRef.current?.value} ];
        setChat(m);
  
        inpRef.current.value=""
        
      }

    function leaveChatRoom(){
        props.setRoom(false);
    }
    useEffect(function(){
      const ws = new WebSocket(BACKEND_URL);
      setSocket(ws);
    //   ws.onerror = () => {
  
    //   }
  
    //   ws.close = () => {
  
    //   }
  
      ws.onopen = () => {
        const value = {
            type : "join",
            payload : {
                roomId : props.roomId,
                user : props.user,
                userId : props.userId,
                userAvatarr : props.userAvatar
            }
        }

        ws.send(JSON.stringify(value));
        console.log("JOIN payload sent")
      }
  
      ws.onmessage = (ev) => {
        if(ev.data === "WebSocket connection established"){
          alert(ev.data);
        }
        else{
          setChat(prevChat => [...prevChat, {reply:ev.data}]);
          console.log(chat)
        }
      }
      // console.log(chat);
  
    },[])


    return (
    <div className="flex  items-center w-full h-full flex-col gap-2 p-5">
      <div className="flex flex-col justify-center items-center mb-2">
        <h1 className="text-6xl h-full font-bold text-black">ChatRoom</h1>
        <p className="font-semibold text-xs">Enabling Real Time Communication</p>
      </div>


      <div className="flex flex-col justify-end items-end shadow-sm h-full w-[80%] gap-4 bg-blue-200 rounded-lg">
        <div className="bg-gray-600 flex w-full justify-between px-2 py-1 text-white items-center">
            ROOM ID : {props.roomId}
            <div className={`bg-green-500 text-green-500 rounded-full w-4 h-4 overflow-hidden` }>Online Status</div>
        </div>
        <div className=" flex gap-2 flex-col w-full h-full min-h-[90%] p-4">
          {
            chat.map((e,index)=>{
              // console.log(e, chat[index])
              return <div key={index} className="flex flex-col gap-2">
               
               {e.user && <div ref={sendRef} className="flex justify-end items-start text-gray-700 gap-2" > 
                <div className="w-fit max-w-[80%] px-4 py-2 rounded-2xl bg-blue-500 text-white">
                {e.user}
                </div>
                <IoPersonCircleOutline className="text-2xl" />
                </div>
               }
                
                  

                {e.reply &&  <div ref={replyRef} className="flex items-start gap-2">
                  <IoPersonCircleOutline className="text-2xl" />
                  <div className="w-fit max-w-[80%] px-4 py-2 rounded-2xl bg-gray-700 text-white">
                  {
                    e.reply
                  }
                  </div>
                </div>}
                
              </div>
            })
          }
        </div>
        <div className="flex w-full gap-2 justify-center p-1">
          <input ref={inpRef} type="text" placeholder="type message.." className="w-full bg-black py-2 px-4 h-fit rounded-md outline-none text-white ">
          </input>
          <button className="bg-blue-500 py-1 px-4 rounded-lg active:scale-90 text-white" onClick={callWebSocket}><IoSend /></button>
        </div>
      </div>
      <button className="bg-blue-500 px-4 py-2 text-white rounded-lg font-semibold active:scale-90" onClick={leaveChatRoom}>Leave Chat Room</button>
    </div>
    )
}
