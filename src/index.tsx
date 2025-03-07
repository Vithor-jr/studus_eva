'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import Drawer from "@/components/drawer";
import styles from "./styles.module.css";
import studus from "./../../assets/logo.png";
import { varela_round } from "../fonts/fonts";
import Image from "next/image";
import gradient from "../../assets/gradiente.png";
import { TbMenuDeep } from "react-icons/tb";
import eva from '../../assets/eva.png'
import Chat from "@/components/chat";
import Head from "next/head";
import Sidebar from "@/components/sideBar";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [newCOnversationId, setNewConversationId] = useState<number>()
  const [conversations, setConversations] = useState()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const [isNewConversation, setIsNewConversation] = useState<boolean>(false)
  const [conversationId, setConversationId] = useState<number>(0)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/get-data", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          setLoading(false)
          throw new Error("Erro ao buscar dados do usuário");
        }

        const data = await response.json();

        if (data) {
          setUserData(data);
        } else {
          setLoading(false)
          throw new Error("Dados do usuário não encontrados");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        if (userData) {
          const response = await fetch(`/api/get-photo/${userData?.id}`, {
            method: "GET",
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Erro ao buscar foto do usuário");
          }

          const data = await response.json();

          if (data) {
            setPhotoURL(data.photoUrl);
          }
        }
      } catch (error) {
        console.error("Erro ao busca foto do usuário: ", error);
      }
    };

    const getCOnversations = async () => {
      try {
        if(userData) {
          const response = await fetch(`/api/get-convesations/${userData?.id}`, {
            method:'GET',
            credentials: "include",
          })
  
          if (!response.ok) {
            throw new Error("Erro ao buscar conversas do usuário");
          }
  
          const data = await response.json()
  
         if(data) {
          setConversations(data)
         }
        }
      } catch(error) {
        console.error(error)
      } finally {
        setLoading(false);
      }
    }
  
    fetchUserImage();
    getCOnversations()
  }, [userData?.id, newCOnversationId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className={styles.container}>
        
        <div className={styles.container_left}>
          <div className={styles.container_image_left}>
              <Image src={gradient} alt="gradient" className="w-[60px] z-10 h-[60px] rounded-full absolute" />
              {photoURL !== "" ? (
                <Image src={photoURL} alt="image" className="rounded-full z-20" width={55} height={55} />
              ) : (
                <Image src='https://www.pngmart.com/files/23/Profile-PNG-Photo.png' alt="image" className="rounded-full z-20" width={50} height={50} />
              )}
          </div>

          <Drawer 
            createConversationFunction={()=>{setIsNewConversation(false), setConversationId(0)}}
            conversationId={conversationId} 
            setConversationId={(value:number)=>{setConversationId(value), setIsNewConversation(false)}} 
            conversations={conversations} 
            userData={userData}
            url={photoURL}
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
          />

          <Image src={studus} alt="U" className="w-[50px] absolute bottom-[30px]" />
        </div>

        <div className={styles.container_right}>
          <div className={styles.container_header}>
            <button onClick={() => setIsDrawerOpen(true)} className={styles.button_open_draw}>
              <TbMenuDeep className="text-[white] text-[2rem] scale-x-[-1]"/>
            </button>

            <Image src={eva} alt="eva" className="h-[60px] w-[60px]"/>
            <h1 className={`${varela_round.className} ${styles.title_eva}`}>Eva</h1>
          </div>

          <Chat 
            isNewConversation={isNewConversation}
            setIsNewConversation={(value:boolean) => setIsNewConversation(value)}
            setNewConversatioId={(value: number | undefined) => setNewConversationId(value)} 
            userData={userData} 
            setConversationId={(value) => setConversationId(value)}
            conversationId={conversationId}
          />
        </div>
      </div>
    </>
  );
}
