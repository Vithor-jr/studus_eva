'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@mui/material';
import styles from './styles.module.css';
import { varela_round } from '@/app/fonts/fonts';
import MicNoneIcon from '@mui/icons-material/MicNone';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import ButtonSend from '@/components/button_send';

type Params = { 
  onSearch: (transcript: string) => void;
  onConfirm: (text: string) => void;
  open: boolean;
  handleClose: () => void;
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  interface SpeechRecognition {
    start: () => void;
    stop: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    lang: string;
    interimResults: boolean;
    continuous: boolean;
  }

  interface SpeechRecognitionEvent {
    resultIndex: any;
    results: {
      length: any;
      [index: number]: {
        [index: number]: {
          transcript: string;
        };
      };
    };
  }

  interface SpeechRecognitionErrorEvent {
    error: string;
  }
}

const VoiceSearch = ({ onSearch, onConfirm, open, handleClose }: Params) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  const [waveOffset, setWaveOffset] = useState(0);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    setText('');
  }, [open]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.lang = 'pt-BR';
        recognitionInstance.interimResults = true;
        recognitionInstance.continuous = true;

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + ' ';
          }
          setText(transcript.trim());
          onSearch(transcript.trim());
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          setError(event.error);
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        setError('Seu navegador não suporta reconhecimento de voz.');
      }
    }
  }, [onSearch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => prev + 0.2);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const startListening = async () => {
    if (recognition) {
      setIsListening(true);
      setText('');
      setError(null);
      recognition.start();

      if (navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
          analyser.fftSize = 256;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            setVolume(average);
            requestAnimationFrame(updateVolume);
          };
          updateVolume();
        } catch (error) {
          console.error('Erro ao acessar o microfone:', error);
          setError('Erro ao acessar o microfone. Verifique as permissões.');
        }
      } else {
        setError('Seu dispositivo não suporta captura de áudio.');
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <Modal
      className={`${styles.modal} ${varela_round.className}`}
      open={open}
      onClose={()=>{stopListening(), handleClose()}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styles.container_body}>
        <div className='flex flex-col items-center'>
          <p>Convert voice into text</p>
        </div>
        
        <div className="flex justify-center items-center w-full h-32">
          {[...Array(20)].map((_, i) => {
            const waveHeight = Math.max(volume * (0.5 + Math.sin(i * 0.6 + waveOffset) * 1.5), 10);
            return (
             isListening ?
             <motion.div
                key={i}
                initial={{ height: '10px'}}
                animate={{ height: `${waveHeight}px` }}
                transition={{ duration: 0.1 }}
                className="w-4 bg-[#F78223] mx-1 rounded-md"
              /> :
              <motion.div
                key={i}
                initial={{ height: '10px' }}
                transition={{ duration: 0.1 }}
                className="w-4 bg-[#F78223]  mx-1 rounded-md"
              />
            );
          })}
        </div>

        <div className={styles.container_anim_mic}>
          <button
            onClick={isListening ? stopListening : startListening}
            className={isListening ? styles.button_animation : styles.button}
          >
            {
              isListening ? 
                <MicOffOutlinedIcon fontSize="large"/>
              :
                <MicNoneIcon fontSize="large" />}
          </button>
        </div>

        <div className='flex items-center flex-col'>
          {error ? <p style={{ opacity: 0.6 }}>{error}</p> : <p>{text}</p>}
          {text && (
            <ButtonSend 
              label={'Confirmar'} 
              onPress={() => onConfirm(text)} 
              disabled={false}            
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VoiceSearch;

