'use client'

import InputForm from '@/components/input_form'
import { varela_round } from '../fonts/fonts'
import styles from './styles.module.css'
import { useState, useEffect } from 'react'
import ButtonSend from '@/components/button_send'
import CreatePassword from '@/components/create_password'
import Loading from '@/components/Loading'
import BasicModal from '@/components/modal_message'
import { useRouter } from 'next/navigation'

export default function Register() {
  const route = useRouter()
  const [token, setToken] = useState('')
  const [message, setMessage] = useState({type:'', text:''})
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [submitted, setSubmitted] = useState<boolean>(false)

  const [errors, setErrors] = useState({
    name: null,
    username: null,
    email: null,
    phone: null,
    password: null,
    confirmPassword: null
  })

  const [passwordErrors, setPasswordErrors] = useState({
    length: true,
    specialChar: true,
    uppercase: true,
    lowercase: true,
    number: true
  })

  const formatPhone = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '')

    if (onlyNumbers.length > 2) {
      return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 7)}-${onlyNumbers.slice(7, 11)}`
    }
    return onlyNumbers
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/verify-token', {
          method: 'GET',
          credentials: 'include', 
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Usuário autenticado:', data.user);
          route.replace('/home');
        } else {
          console.log('Usuário não autenticado');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      }
    };

    checkAuth();
  }, [route]);

  const handlePhoneChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '')
    setPhone(onlyNumbers)
  }

  const validate = () => {
    let newErrors: any = {}

    newErrors.name = name.trim().length < 3 ? 'O nome deve ter pelo menos 3 caracteres' : null
    newErrors.username = username.trim().length < 3 ? 'O nome de usuário deve ter pelo menos 3 caracteres' : null

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    newErrors.email = !emailRegex.test(email) ? 'Digite um e-mail válido' : null

    newErrors.phone = phone.length < 11 ? 'Digite um telefone válido com DDD' : null

    newErrors.password = Object.values(passwordErrors).some(error => error) ? 'A senha não atende aos requisitos' : null
    newErrors.confirmPassword = password !== confirmPassword ? 'As senhas não coincidem' : null

    setErrors(newErrors)

    return Object.values(newErrors).some(error => error !== null)
  }

  useEffect(() => {
    if (submitted) validate()
  }, [name, username, email, phone, password, confirmPassword, passwordErrors])

 const handleRegister = async () => {
  setLoading(true);
  setSubmitted(true);

  const hasErrors = validate();
  if (hasErrors) return setLoading(false);

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, username, phone }),
    });

    

    const data = await response.json();

    if (data.error && typeof data.error === 'string') {
      let errorMessage = ''
      
      if(data.error.includes('E-email') || data.error.includes('Telefone')){
        errorMessage = "Os seguintes dados já foram cadastrados: ";

        if (data.error.includes('E-mail')) {
          errorMessage += "E-mail, ";
        }
  
        if (data.error.includes('Telefone')) {
          errorMessage += "Telefone, ";
       }
        errorMessage = errorMessage.replace(/, $/, ".");
      }

      if(data.error.includes('email')){
        errorMessage = 'E-mail inválido. Digite outro e-mail.'
      }

      setOpenModal(true)
      return setMessage({ type: "error", text: errorMessage});
    }

    setMessage({ type: "success", text: "Cadastro realizado com sucesso!" });
    setOpenModal(true)
    
    const response1 = await fetch('/api/login',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email, password})    
    })

    const dataLogin = await response1.json()
    setToken(dataLogin.access_token)

  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
      setMessage({ type: "error", text: "Erro de conexão. Verifique sua internet e tente novamente." });
      setOpenModal(true)
    } else {
      setMessage({ type: "error", text: `Erro desconhecido ao fazer cadastro: ${err.message}` });
      setOpenModal(true)
    }
  } finally {
    setLoading(false);
  }
};

const handleCloseModal = () => {
  setOpenModal(false); 

  if (message.type === 'success') {
    setLoading(true);
    setTimeout(() => {
      route.push('/home');
    }, 2000);
  }
};

  
  return (
    loading ?
    <Loading/>
    : 
      <div className={styles.container}>
        {message.text !== '' && <BasicModal open={openModal} handleClose={handleCloseModal} message={message} />}

        <div className={styles.body_1}>
          <h1 className={`${varela_round.className} ${styles.text_title}`}>Crie sua conta</h1>
          <p className={`${varela_round.className} ${styles.text_subtitle}`}>cadastre-se</p>

          <InputForm error={!!errors.name} label="Nome:" setText={setName} placeholder='' text={name} register={true} type="text" id='name' />
          {errors.name && <p className={`${varela_round.className} ${styles.error}`}>{errors.name}</p>}

          <InputForm error={!!errors.username} label="Nome de usuário:" placeholder='' setText={setUsername} text={username} register={true} type="text" id='username' />
          {errors.username && <p className={`${varela_round.className} ${styles.error}`}>{errors.username}</p>}

          <InputForm error={!!errors.email} label="Email:" setText={setEmail} text={email} register={true} placeholder="xxxx123@gmail.com" type="email" id='email'/>
          {errors.email && <p className={`${varela_round.className} ${styles.error}`}>{errors.email}</p>}

          <InputForm
            error={!!errors.phone}
            label="Telefone:"
            setText={handlePhoneChange}
            text={formatPhone(phone)} 
            register={true}
            id='phone'
            placeholder="(XX) XXXXX-XXXX"
            type="tel"
          />
          {errors.phone && <p className={`${varela_round.className} ${styles.error}`}>{errors.phone}</p>}
        </div>

        <div className={styles.body_2}>
          <CreatePassword
            error={!!errors.password} 
            label="Senha:" 
            setText={setPassword} 
            text={password} 
            placeholder="●●●●●●●●" 
            onErrorChange={setPasswordErrors}
          />
          {errors.password && <p className={`${varela_round.className} ${styles.error}`}>{errors.password}</p>}

          <InputForm error={!!errors.confirmPassword} id='confirmPassword' label="Confirmar Senha:" setText={setConfirmPassword} text={confirmPassword} register={true} placeholder="●●●●●●●●" type="password" />
          {errors.confirmPassword && <p className={`${varela_round.className} ${styles.error}`}>{errors.confirmPassword}</p>}

          <ButtonSend disabled={Object.values(errors).some(error => error !== null)} label="Cadastrar" onPress={handleRegister} />
        </div>
      </div>
  )
}