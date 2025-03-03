'use client'

import ImageReset from '@/components/image_reset';
import styles from './styles.module.css';
import InputForm from '@/components/input_form';
import { useEffect, useState } from 'react';
import ButtonSend from '@/components/button_send';
import Loading from '@/components/Loading';
import BasicModal from '@/components/modal_message';
import { useRouter } from 'next/navigation';
import { varela_round } from '@/app/fonts/fonts';

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [message, setMessage] = useState({text:'', type:''})
  
  const route = useRouter()
  const [submit, setSubmit] = useState(false)

  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(()=>{
    if (validateEmail(email)) {
      setError('')
    }
  }, [submit, email])

  const SendEmail = async () => {
    setLoading(true);
    setSubmit(true);
    setError("");
  
  
    if (!validateEmail(email)) {
      setError("Digite um e-mail válido");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch("/api/request-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setMessage({
          text: errorData.message || "Erro ao enviar e-mail. Tente novamente.",
          type: 'error'
        });
        return;
      }
  
      const data = await response.json();
  
      if (data.error) {
        setMessage({
          text:'Usuário não encontrado. Digite um e-mail cadastrado',
          type:'error'
        })
        return;
      }

      sessionStorage.setItem('email', email);
      sessionStorage.setItem('resetToken', data.token);
      route.push(`./confirm-reset-password`)
    } catch (err) {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
      setLoading(false)
    }
  };
  

  const handleCloseModal = () => {
    if(message.type === 'success'){
      setMessage({type:'', text:""})
      setLoading(true)
    } else {
      setMessage({type:'', text:""})
    }
  }

  return (
    loading ?
    <Loading/> :
    <div className={styles.container}>
      {
        message.text !== '' &&
        <BasicModal
          message={message}
          open={true}
          handleClose={handleCloseModal}
        />
      }
      <div className={styles.container_image}>
        <h1 className={`${styles.title_mobile} ${varela_round.className}`}>Esqueceu a senha?</h1>
        <ImageReset />
      </div>
      
      <div className={styles.content}>
        <h1 className={`${styles.title_web} ${varela_round.className}`}>Esqueceu sua senha?</h1>
        <p className={`${varela_round.className} ${styles.paragraphy}`}>Digite seu e-mail no campo abaixo e lhe enviaremos um código de ativação.</p>
        <InputForm
          text={email}
          label=''
          id='email'
          setText={(text) => setEmail(text)}
          placeholder='xxxx123@gmail.com'
          error={false}
          type={'text'}      
        />

        {error && <p className={`text-red-500 mt-2 text-sm ${varela_round.className}`}>{error}</p>}


        <ButtonSend
          onPress={SendEmail}
          disabled={error !== ''}
          label='Enviar E-mail'
        />  
      </div>
    </div>
  );
}
