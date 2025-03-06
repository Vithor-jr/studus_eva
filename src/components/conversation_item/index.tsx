import { varela_round } from "@/app/fonts/fonts";

type props = {
	title: string;
	id:number;
  conversationId: number | undefined;
  setConversationId: (value: number) => void
}

export default function ConversationItem({ title, id, setConversationId, conversationId}: props) {
  const showConversation = () => {
    setConversationId(id)
  }
  

  return (
    <button
        onClick={showConversation}
        className={`flex flex-row ${id === conversationId ? 'bg-selectedBg' : 'bg-transparent hover:bg-hoverBg'} w-full p-2 rounded-md`}
      >
       <p className={`truncate overflow-hidden whitespace-nowrap text-start w-full ${varela_round.className}`}>{title || "Título da conversa"}</p>
    </button>
  );
}
