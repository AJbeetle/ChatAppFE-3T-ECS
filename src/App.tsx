import { useState, useRef} from "react"
// import ChatBoxComponent from "./components/chatBox"; 
import { BsChat } from "react-icons/bs";
import ChatBoxComponent from "./components/chatBox";
import ChatHistory from "./components/chatHistory";
import {nanoid} from "nanoid"

interface CHAT {
  user?: string;
  reply?: string;
}

const BACKEND_URL:string = import.meta.env.VITE_BACKEND_BASE_URL; 

function App() {

  const [room, setRoom] = useState(false);
  const [roomId, setRoomId] = useState("");
  const inpRef = useRef<HTMLInputElement>(null);
  const histInp = useRef<HTMLInputElement>(null);
  const [historyMode, setHistoryMode] = useState(false);
  const [HistoryData, setHistoryData] = useState<CHAT[]>([]);
  const user = "aauishi";
  const userId = "XYZ123";
  const userAvatar = "haha";

  function joinRoom(){
    let id = inpRef.current?.value as string;   
    setRoom(true);
    setRoomId(id);
    setHistoryData([]);
    setHistoryMode(false);
  }

  function createRoom(){
    const id = nanoid(5);
    setRoom(true);
    setRoomId(id);
    setHistoryData([]);
    setHistoryMode(false);

  }

  async function findHistory(){
    const id = histInp.current?.value?.trim();

    if(!id) return;

    try{
    const res = await fetch(`${BACKEND_URL}/rooms/${id}/messages`);

    if(!res.ok){
      alert("Failed to fetch history");
      return;
    }

    const data = await res.json();

    // room doesn't exist (empty array)
    if(!data || data.length === 0){
      alert("Room doesn't exist");
      return;
    }

    // 1. sort by timestamp
    data.sort(
      (a:any,b:any)=>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
    );

    // 2. build connectionId → position map
    const map = new Map<string,"left"|"right">();
    let toggle:"left"|"right" = "left";

    data.forEach((m:any)=>{
      if(!map.has(m.connection_id)){
        map.set(m.connection_id,toggle);
        toggle = toggle==="left"?"right":"left";
      }
    });

    // 3. transform to ChatBox format
    const transformed = data.map((m:any)=>{
      const pos = map.get(m.connection_id);
      return pos==="right"
        ? { user:m.message }
        : { reply:m.message };
    });

    // 4. update state
    // setRoomId(id);
    setHistoryData(transformed);
    setHistoryMode(true);

    }catch(e){
      console.error(e);
      alert("Error loading history");
    }
  } 

  return (
    <div className="flex justify-start bg-slate-200 items-center flex-col gap-8 min-h-screen h-full p-5">

      {
        !room && <>
        <div className="flex flex-col">
          <div className="font-bold text-6xl">ChatRoom</div>
          <div className="font-semibold text-xs">Welcome to Real Time Communication with GROUPS!!</div>
        </div>
        <div className="bg-blue-200 w-[50%] h-fit flex gap-2 flex-col p-10 rounded-lg shadow-lg">
          <div className="flex flex-col">
            <div className="flex items-center font-extrabold text-2xl leading-[0.5] gap-2">
              <BsChat />
              <p> Real Time Chat</p>
            </div>
            <p className="text-xs font-medium">temporary room that expires after both users exit</p>
          </div>
          <button className=" bg-black rounded-lg  text-white active:scale-95 py-1 " onClick={createRoom}>Create New Room</button>
          <div className="flex w-full justify-center gap-2">
            <input ref={inpRef} type="text" className="outline-none w-full px-2 py-1 rounded-lg bg-blue-100" placeholder="Enter Room Code"></input>
            <button className="bg-black text-white px-2 py-1 rounded-lg w-[20%] active:scale-95" onClick={joinRoom}>Join Room</button>
          </div>
  
        </div>
        </>
      }

      {room && <ChatBoxComponent setRoom={setRoom} roomId={roomId} user={user} userId={userId} userAvatar={userAvatar} ></ChatBoxComponent>}

      {
        !historyMode && !room &&

        <div className="bg-blue-200 w-[50%] h-fit flex gap-2 flex-col p-10 rounded-lg shadow-lg">
          <h2 className="font-semibold">Revisit Chat History in a Room</h2>
          <div className="flex w-full justify-center gap-2">
              <input ref={histInp} type="text" className="outline-none w-full px-2 py-1 rounded-lg bg-blue-100" placeholder="Enter Room Code"></input>
              <button className="bg-black text-white px-2 py-1 rounded-lg w-[20%] active:scale-95" onClick={findHistory}>See History</button>
            </div>
        </div>
      }

      {!room && historyMode && <ChatHistory roomId={histInp?.current?.value as string} setHistoryMode={setHistoryMode} chat={HistoryData}/>}
      
    </div>

  )
}

export default App

