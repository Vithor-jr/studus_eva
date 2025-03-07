'use client';

import styles from './styles.module.css';
import ImageLogin from '@/components/imageLogin';
import { varela_round } from '../fonts/fonts';
import { useEffect, useState } from 'react';
import InputForm from '@/components/input_form';
import ButtonSend from '@/components/button_send';
import Loading from '@/components/Loading';
import BasicModal from '@/components/modal_message';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<{ type: string; text: string }>({ type: '', text: '' });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const router = useRouter();
  const [errorEmail, setErrorEmail] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/verify-token', {
          method: 'GET',
          credentials: 'include', 
        });

        if (response.ok) {
          const data = await response.json();
          router.replace('/home');
        } else {
          console.log('Usuário não autenticado');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      }
    };

    checkAuth();
  }, [router]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleLogin = async () => {
    setErrorEmail('');
    setErrorPassword('');

    let isValid = true;

    if (!validateEmail(email)) {
      setErrorEmail('E-mail inválido');
      isValid = false;
    }

    if (!validatePassword(password)) {
      setErrorPassword('A senha deve ter no mínimo 8 caracteres');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
        credentials: 'include', 
      });

      const data = await response.json();
      
      if (response.ok) {
        router.push('/home'); // Redireciona para a página inicial após o login
      } else {
        setServerError({ type: 'error', text: data.message || 'E-mail ou senha inválida.' });
        setOpenModal(true);
      }
    } catch (err) {
      setServerError({ type: 'error', text: 'Erro de conexão. Verifique sua internet e tente novamente.' });
      setOpenModal(true);
      setLoading(false);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className={`${styles.container}`}>
      <div className={styles.body}>
        <ImageLogin />

        <div className={styles.container_form}>
          <h1 className={`${varela_round.className} text-2xl`}>Login</h1>
          <p className={`${varela_round.className} text-xs opacity-40`}>Entre na sua conta cadastrada.</p>
          
          <InputForm
            label="E-mail:"
            text={email}
            id='email'
            type="email"
            placeholder='xxxx123@gmail.com'
            error={!!errorEmail}
            setText={setEmail}
          />
          {errorEmail && <p className={`text-red-500 text-sm ${varela_round.className}`}>{errorEmail}</p>}

          <div className="flex items-end flex-col">
            <InputForm
              id='password'
              type="password"
              label="Senha:"
              placeholder='●●●●●●●●'
              error={!!errorPassword}
              text={password}
              setText={setPassword}
            />
            {errorPassword && <p className={`${varela_round.className} text-red-500 text-sm w-[100%]`}>{errorPassword}</p>}

            <button onClick={() => router.push('/reset-password/request-reset-password')}>
              <p className={`${varela_round.className} border-[#FF7300] border-b-2 mt-3`}>Esqueceu a senha?</p>
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <ButtonSend disabled={loading} label={'Entrar'} onPress={handleLogin} />

            <p className={`${varela_round.className}`}>
              Não possui uma conta?
              <button className="border-b-2 border-[#FF7300] ms-2" onClick={() => router.push('/register')}>entre aqui</button>
            </p>
          </div>
          
        </div>
      </div>

      <BasicModal open={openModal} handleClose={() => setOpenModal(false)} message={serverError} />
    </div>
  );
}