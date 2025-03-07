import { useState } from "react";
import { Menu, Home, User, Settings } from "lucide-react";
import styles from './styles.module.css';
import Image from "next/image";
import { groupConversations } from "@/functions/groupConversations";
import gradient from '../../assets/gradiente.png';

import logo from '../../assets/logo.png';
import { varela_round } from "@/app/fonts/fonts";
import { IoMdAddCircleOutline } from "react-icons/io";
import ConversationItem from "../conversation_item";

import { LuSquareArrowRight, LuSquareArrowLeft } from "react-icons/lu";

interface SideBarProps {
  userData: {name:string, id:string, email:string, phone:string, username:string} | null;
  url: string;
  conversationId: number | undefined;
  createConversationFunction: () => void; 
  conversations: {
    id: number;
    title: string;
    userId: number;
    createdAt: string;
    messages: [];
  }[] | undefined;
  setConversationId: (value: number) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen, userData, url, conversationId, createConversationFunction, conversations, setConversationId }: SideBarProps) {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa
  const groupedConversations = conversations ? groupConversations(conversations) : { today: [], yesterday: [], lastWeek: [], older: [] };

  const filteredConversations = Object.entries(groupedConversations).reduce((acc, [section, items]) => {
    if (section in acc) {
      const filteredItems = items.filter((item: { title: string; }) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filteredItems.length > 0) {
        acc[section as keyof typeof groupedConversations] = filteredItems;
      }
    }
    return acc;
  }, {
    today: [],
    yesterday: [],
    lastWeek: [],
    older: []
  } as Record<keyof typeof groupedConversations, any[]>);
  
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <div style={{ width: '100%', paddingLeft: isOpen ? '1rem' : '0', display: 'flex', justifyContent: isOpen ? 'flex-start' : 'center' }}>
        <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <LuSquareArrowLeft className='text-[24px]' /> : <LuSquareArrowRight className='text-[24px]' />}
        </button>
      </div>

      <div style={{ justifyContent: isOpen ? 'flex-start' : 'space-between' }} className="flex gap-3 w-full items-center ps-4 pe-4">
        <div className={styles.container_image_left}>
          <Image src={gradient} alt="gradient" className="w-[50px] z-10 h-[50px] absolute" />
          {url !== "" ? (
            <Image src={url} alt="image" className="rounded-full z-20" width={45} height={45} />
          ) : (
            <Image src='https://www.pngmart.com/files/23/Profile-PNG-Photo.png' alt="image" className="rounded-full z-20" width={50} height={50} />
          )}
        </div>

        {isOpen && <h1 className={varela_round.className}>Olá, {userData?.username}!</h1>}
      </div>

      <div className="w-full flex flex-col" style={{ alignItems: isOpen ? 'flex-start' : 'center', padding: isOpen ? '0px 16px' : '0px' }}>
        <button onClick={createConversationFunction} className="flex flex-row gap-1 items-center justify-center p-2 bg-[rgba(255,255,255,0.1)] rounded-xl mb-5">
          <IoMdAddCircleOutline className="text-white text-2xl" />
          {isOpen && <p className={`${varela_round.className}`}>Novo chat</p>}
        </button>

        {isOpen && (
          <input
            className={`w-full border-[#6048AC] border-2 bg-transparent text-white placeholder:text-white p-2 rounded-xl focus:outline-none focus:ring-0 ${varela_round.className}`}
            placeholder="Busque uma conversa"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      </div>

      {isOpen ? (
        <div className={styles.container_conversations}>
          {Object.entries(filteredConversations).map(([section, items]) => (
            items.length > 0 && (
              <div key={section} className="mb-6">
                <h2 className={`text-white text-[0.8rem] ${varela_round.className}`}>
                  {section === "today" ? "Hoje" : section === "yesterday" ? "Ontem" : section === "lastWeek" ? "Semana Passada" : "Anteriores"}
                </h2>
                {items.map((item) => (
                  <ConversationItem
                    key={item.id}
                    conversationId={conversationId}
                    setConversationId={(value) => setConversationId(value)}
                    title={item.title}
                    id={item.id}
                  />
                ))}
              </div>
            )
          ))}
        </div>
      ) : <div className="w-full h-full" />}
      
      <div className={isOpen ? styles.footer : 'pb-4'}>
        <div className={styles.container_logo}>
          {isOpen && <p className={`${varela_round.className} ${styles.text_logo}`}>stud</p>}
          <Image className="w-11" src={logo} alt="logo" />
          {isOpen && <p className={`${varela_round.className} ${styles.text_logo}`}>s</p>}
        </div>
      </div>
    </div>
  );
}
