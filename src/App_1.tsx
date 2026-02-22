import {useState, useRef} from "react"

function App() {
  //@ts-ignore
  const [chat, setChat] = useState(["dummy Chat","dummy Reply"]);
  const sendRef = useRef<HTMLDivElement>(null);
  const inpRef = useRef<HTMLInputElement>(null);
  const replyRef = useRef<HTMLDivElement>(null);
  

/*   function callWebSocket():void{
    if(!sendRef.current?.innerText){
      return;
    }
    // sendRef.current.innerHTML=Math.random().toString();
    sendRef.current.innerHTML=`
    ${inpRef.current?.value}
    `
    if(!replyRef.current?.innerHTML){
      return
    } 
    if(inpRef.current?.value==="ping"){
      replyRef.current.innerHTML= `pong` 
    }
    else{
      replyRef.current.innerHTML= `    ` 
    }
  } */
  
    function callWebSocket():void{
    if(!sendRef.current?.innerText){
      return;
    }
    // sendRef.current.innerHTML=Math.random().toString();
    sendRef.current.innerHTML=`
    ${inpRef.current?.value}
    `
    if(!replyRef.current?.innerHTML){
      return
    } 
    if(inpRef.current?.value==="ping"){
      replyRef.current.innerHTML= `pong` 
    }
    else{
      replyRef.current.innerHTML= `    ` 
    }
  }


  return (
    <div className="flex justify-center items-center w-full h-screen border border-solid border-black">
      <div className="flex flex-col justify-end items-end border border-black border-solid p-4 h-[80%] w-[80%] gap-4 bg-">
        <div className=" flex gap-2 flex-col w-full h-[90%] p-4">
          {
            //@ts-ignore
            chat.map((e,index)=>{
              if(index%2==0){
              return <>
                <div ref={sendRef} className="flex justify-end bg-blue-100 rounded-xl" >
                  <div className="w-fit px-2 py-1 rounded-2xl bg-blue-500 text-white">
                  {
                    chat[index]
                  }

                  </div>
                </div>
                <div ref={replyRef} className="bg-blue-100 rounded-xl">
                  <div className="w-fit px-2 py-1 rounded-2xl bg-blue-500 text-white">
                  {
                    chat[index+1]
                  }
                  </div>
                </div>
              </>
              }
              else{
                return ;
              }
            })
          }
        </div>
        <div className="flex w-full gap-2 justify-center">
          <input ref={inpRef} type="text" placeholder="type message.." className="w-full bg-gray-600 py-2 px-4 h-fit outline-none text-white ">
          </input>
          <button className="bg-blue-500 py-1 px-4 rounded-lg active:scale-90 text-white" onClick={callWebSocket}>SEND</button>
        </div>
      </div>
    </div>
  )
}

export default App
