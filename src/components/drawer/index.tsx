"use client";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import logo from '../../assets/logo.png'
import styles from "./styles.module.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuSquareArrowRight, LuSquareArrowLeft } from "react-icons/lu";
import Image from "next/image";
import gradient from '../../assets/gradiente.png'
import { varela_round } from "@/app/fonts/fonts";
import ConversationItem from "../conversation_item";
import { groupConversations } from "@/functions/groupConversations";
import { Key } from "react";
import { LargeNumberLike } from "node:crypto";
interface DrawerProps {
  open: boolean;
  userData: {name:string, id:string, email:string, phone:string, username:string} | null;
  url: string;
  onOpenChange: (open: boolean) => void;
  conversationId: number |undefined;
  conversations: [{
		id: number,
		title: string,
		userId: number,
		createdAt: string,
		messages: []
	},] | undefined;
  setConversationId: (value: number) => void
}

export default function Drawer({conversations, conversationId, setConversationId, open, onOpenChange, userData, url }: DrawerProps) {
  const groupedConversations = conversations ? groupConversations(conversations) : { today: [], yesterday: [], lastWeek: [], older: [] };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button className="rounded-xl bg-transparent border-transparent p-2 hover:bg-[#311F69]">
          <LuSquareArrowRight className="w-7 h-7 text-[#6048AC]" />
        </button>
      </SheetTrigger>

      <SheetContent className={styles.container} side="left">
        <div className="flex gap-3 items-center">
          <div className={styles.container_image_left}>
            <Image src={gradient} alt="gradient" className="w-[60px] z-10 h-[60px] absolute" />
            {url !== "" ? (
              <Image src={url} alt="image" className="rounded-full z-20" width={55} height={55} />
            ) : (
              <Image src='https://www.pngmart.com/files/23/Profile-PNG-Photo.png' alt="image" className="rounded-full z-20" width={50} height={50} />
            )}
          </div>

          <SheetTitle>Olá, {userData?.username}!</SheetTitle>
        </div>

        <div>
          <button className="flex flex-row gap-1 items-center justify-center p-2 bg-[rgba(255,255,255,0.1)] rounded-xl mb-5">
            <IoMdAddCircleOutline className="text-white text-2xl"/>
            <p className={`${varela_round.className}`}>Novo chat</p>
          </button>

          <input
            className={`w-full border-[#6048AC] border-2 bg-transparent  text-white placeholder:text-white p-2 rounded-xl focus:outline-none focus:ring-0 ${varela_round.className}`}
            placeholder="Busque uma conversa"
          />
        </div>

        <div className="flex flex-col overflow-auto w-full h-full">
          {Object.entries(groupedConversations).map(([section, items]) => (
            items.length > 0 && (
              <div key={section} className="mb-4">
                <h2 className={`text-white font-bold ${varela_round.className}`}>{section === "today" ? "Hoje" : section === "yesterday" ? "Ontem" : section === "lastWeek" ? "Semana Passada" : "Anteriores"}</h2>
                {items.map((item: { id: number; title: string; }) => (
                  <ConversationItem
                    key={item.id}
                    conversationId={conversationId}
                    setConversationId={setConversationId}
                    title={item.title}
                    id={item.id}
                  />
                ))}
              </div>
            )
          ))}
        </div>

        <div className="flex flex-row items-center h-[90px] bg-[#24125A]">
          <h1 className={`text-[#F78223] text-4xl ${varela_round.className}`}>stud</h1>
          <Image src={logo} alt="logo" className="w-[15%]"/>
          <h1 className={`text-[#F78223] text-4xl ${varela_round.className}`}>s</h1>
        </div>
      </SheetContent>
    </Sheet>
  );
}
