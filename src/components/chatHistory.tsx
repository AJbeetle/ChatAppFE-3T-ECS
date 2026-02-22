import { IoPersonCircleOutline } from "react-icons/io5";

interface CHAT {
  user?: string;
  reply?: string;
}

interface Props {
  chat: CHAT[];
  roomId: string;
  setHistoryMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatHistory({ chat, roomId, setHistoryMode }: Props) {
  return (
    <div className="flex items-center w-[50%] h-full flex-col gap-2 p-5">
      <h1 className="text-4xl font-bold">Chat History</h1>

      <div className="flex flex-col w-[80%] gap-3 bg-blue-200 rounded-lg p-4">
        <div className="font-semibold">ROOM ID : {roomId}</div>

        {chat.map((e, i) => (
          <div key={i} className="flex flex-col gap-2">

            {e.user && (
              <div className="flex justify-end items-start gap-2">
                <div className="px-4 py-2 rounded-2xl bg-blue-500 text-white max-w-[80%]">
                  {e.user}
                </div>
                <IoPersonCircleOutline className="text-2xl" />
              </div>
            )}

            {e.reply && (
              <div className="flex items-start gap-2">
                <IoPersonCircleOutline className="text-2xl" />
                <div className="px-4 py-2 rounded-2xl bg-gray-700 text-white max-w-[80%]">
                  {e.reply}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

      <button
        className="bg-blue-500 px-4 py-2 text-white rounded-lg font-semibold active:scale-90"
        onClick={() => setHistoryMode(false)}
      >
        Back
      </button>
    </div>
  );
}