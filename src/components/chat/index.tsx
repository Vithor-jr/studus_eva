'use client'

import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

import { Gemini } from '../../app/api/gemini'
import { varela_round } from '@/app/fonts/fonts';

import eva from '../../assets/assets_chat/eva.png'
import background from '../../assets/assets_chat/background_chat.png'
import MicNoneIcon from '@mui/icons-material/MicNone';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

import Image from 'next/image';
import FormattedText from '../chat_components/mensageComponents';

import VoiceSearch from '../chat_components/VoiceSearch';
import ImageProfessor from '../image_professor';


export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [waiting, setWaiting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false)
  const [currentBotMessage, setCurrentBotMessage] = useState('');
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
  
    const userMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
  
    setWaiting(true);
  
    const previousMessages = messages.map((msg) => msg.content).join('\n');
    const context = `${previousMessages}\nuser: ${message}`;
  
    const result = await Gemini({ prompt: context });
  
    const botMessage = { role: 'bot', content: result };
    setMessages((prev) => [...prev, botMessage]);
  
    setCurrentBotMessage(result);
    setLoading(false)
    setWaiting(false);
  }
  
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && userInput !== '' && !loading) {
      event.preventDefault();
      Enviar();
    }
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
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.chatBubble} ${styles[msg.role]}`}>
                {msg.role === 'bot' ? (
                  ( index === messages.length - 1 ) ? (
                    <FormattedText text={currentBotMessage} />
                  ) : (
                    <FormattedText text={msg.content} />
                  )
                ) : ( msg.content )}
              </div>
            ))}

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
