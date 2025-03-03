'use client'

import { varela_round } from '@/app/fonts/fonts';
import ImageReset from '@/components/image_reset';
import styles from './styles.module.css'
import InputOTP from "@/components/input_OTP";
import { useState, useEffect } from 'react';
import BasicModal from '@/components/modal_message';
import { useRouter } from 'next/navigation';
import ButtonSend from '@/components/button_send';
import Loading from '@/components/Loading';

export default function EnterCod(){
	const [message, setMessage] = useState({text:'', type:''})
	const router = useRouter()
	const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
	const [loading, setLoading] = useState(false)
	const [code, setCode] = useState('')
	const [complete, setComplete] = useState(false)

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');
    const storedToken = sessionStorage.getItem('resetToken');

    if (!storedEmail || !storedToken) {
      router.push('/login');
    } else {
      setEmail(storedEmail);
      setToken(storedToken);
    }
  }, []);


	const verifyCode = async (code: string) => {
		setLoading(true)
		const response = await fetch('/api/verify-code', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ email, code }),
		});
	
		const data = await response.json();

		if (data.success) {
      sessionStorage.setItem('code', code);
			router.push('./update-password');
		} else {
			setLoading(false)
			setMessage({text:'Código inválido', type:'error'})
		}
	};
	

	const handleCloseModal = () => {
		setMessage({text:'', type:""})
	}

	return(
		loading ? <Loading/>
		: <div className={styles.container}>
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
			<p className={`${varela_round.className} ${styles.paragraphy}`}>Um e-mail foi enviado para {email}.<br/>Por favor, insira no campo abaixo o código de ativação que você recebeu por e-mail.</p>
			
			<InputOTP
				length={6}
				onComplete={(value)=>{setComplete(true), setCode(value)}}
			/>

			<ButtonSend
				label={'Verificar código'}
				disabled={!complete} 
				onPress={() => verifyCode(code)}
			/>
		</div>
	</div>
	)
}