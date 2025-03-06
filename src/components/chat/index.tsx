'use client'

import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

import { Gemini } from '../../app/api/gemini'
import { varela_round } from '@/app/fonts/fonts';

import MicNoneIcon from '@mui/icons-material/MicNone';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

import Image from 'next/image';
import FormattedText from '../chat_components/mensageComponents';

import VoiceSearch from '../chat_components/VoiceSearch';
import ImageProfessor from '../image_professor';
import Loading from '../Loading';

type ChatProps = {
  userData: {
    id: string,
    name: string,
    email: string,
    phone: string,
    username: string,
  } | null;
  isNewConversation: boolean; 
  conversationId?: number;
  setIsNewConversation: (value: boolean) => void;
  setNewConversatioId: (value: number | undefined) => void;
  setConversationId?: (value: number) => void
}

export default function Chat({userData, conversationId, setConversationId, setNewConversatioId, isNewConversation, setIsNewConversation}:ChatProps) {
  const [messages, setMessages] = useState<{ role: string; content: string; save: boolean }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [waiting, setWaiting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false)
  const [currentBotMessage, setCurrentBotMessage] = useState('');
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [loadingMessages, setLoadingMessages] = useState(false)

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [userInput]);

  useEffect(() => {
    if (isNewConversation) return;
  
    const getMessages = async () => {
      setMessages([]);
      
      if (conversationId === 0) return;
  
      setLoadingMessages(true);  
  
      try {
        const response = await fetch(`/api/get-conversation/${conversationId}`, { method: 'GET' });
        const data = await response.json();
  
        if (data.length > 0) {
          setMessages(data.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
            save: true
          })));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingMessages(false);
      }
    };
  
    getMessages();
  }, [conversationId]); 
  
  function adjustTextareaHeight() {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      const maxHeight = parseInt(window.getComputedStyle(textarea).lineHeight) * 5;
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    }
  }

  const handleVoiceConfirm = (text: string) => {
    setIsListening(false);
    setUserInput(text);
    Enviar(text); 
  };
  
  async function Enviar(input?: string) {
    const message = input ?? userInput;
    
    if (!message.trim() || loading) return;
  
    setLoading(true);
    setUserInput('');
  
    const userMessage = { role: 'user', content: message, save: true };
    setMessages((prev) => [...prev, userMessage]);
  
    setWaiting(true);
  
    let currentConversationId = conversationId;
    let conversationTitle = "Nova Conversa";
  
    if (currentConversationId === 0) {
      setIsNewConversation(true)


      try {
        const titleResponse = await Gemini({
          prompt: `Resuma esta frase em um título curto e formal:\n\n"${message}"\n\nResponda apenas com o título, sem explicações.`,
        });
  
        if (titleResponse) {
          conversationTitle = titleResponse.trim();
        }
  
        const createResponse = await fetch(`/api/create-conversation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userData?.id,
            title: conversationTitle,
          }),
        });
  
        const newConversation = await createResponse.json();

        if (newConversation?.id) {
          currentConversationId = newConversation.id;
          setConversationId?.(newConversation.id);
          setNewConversatioId(newConversation.id)
        }
      } catch (error) {
        console.error("Erro ao criar conversa:", error);
      }
    }
  
    if (currentConversationId !== 0 && currentConversationId) {
      await addMessage(currentConversationId, "user", message);
    }
  
    const previousMessages = messages.map((msg) => msg.content).join('\n');
    const context = `${previousMessages}\nuser: ${message}`;
    const result = await Gemini({ prompt: context });
  
    const botMessage = { role: 'bot', content: result, save: false };
    setMessages((prev) => [...prev, botMessage]);
  
    if (currentConversationId !==0 && currentConversationId) {
      await addMessage(currentConversationId, "bot", result);
    }
  
    setCurrentBotMessage(result);
    setLoading(false);
    setWaiting(false);
  }
  
  
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && userInput !== '' && !loading) {
      event.preventDefault();
      Enviar();
    }
  }

  const addMessage = async (conversationId: number, role:string, content:string) => {
    try {
      await fetch(`/api/add-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversationId,
          role: role,
          content: content,
        }),
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }

  if(loadingMessages) {
    return (
      <div className={`${styles.container_chat} h-full w-full`}>
        <Loading message='Carregando conversa'/>
      </div>
    )
  }

  return (
      <div className={`${styles.container_chat} h-full w-full`}>
        <ImageProfessor/>

        <VoiceSearch 
           onSearch={(query: string) => console.log('Busca:', query)}
          open={isListening} 
          onConfirm={handleVoiceConfirm}
          handleClose={()=>setIsListening(false)}          
        />

				<div className={styles.container_body}>
          <div ref={chatWindowRef} className={`${styles.chatWindow} ${varela_round.className}`}>
            {messages.length > 0 && messages.map((msg, index) => (
              <div key={index} className={`${styles.chatBubble} ${styles[msg.role]}`}>
                {msg.role === 'bot' ? (
                  (index === messages.length - 1 && !msg.save) ? (
                    <FormattedText text={currentBotMessage} />
                  ) : (
                    <FormattedText text={msg.content} />
                  )
                ) : ( msg.content )}

              </div>
            ))
          }

            {waiting && (
              <div className={`${styles.chatBubble} ${styles.bot}`}>
                <div className={styles.typingIndicator}>
                  <div className={styles.circle}></div>
                  <div className={styles.circle}></div>
                  <div className={styles.circle}></div>
                </div>
              </div>
            )}
          </div>

          
          <div className={styles.inputContainer}>
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className={`${styles.inputField} ${varela_round.className}`}
              disabled={loading}
              rows={1}
              style={{
                resize: 'none',
                overflow: 'hidden',
                lineHeight: '1.5em',
              }}
            />

            <div className={styles.container_buttons}>
              <button onClick={()=>setIsListening(true)} className={styles.micButton}>
                <MicNoneIcon style={{color: 'white'}}/>
              </button>

              <button onClick={()=>Enviar()} className={styles.sendButton} disabled={loading}>
                <SendOutlinedIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
