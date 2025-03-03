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
import InputForm from '@/components/input_form';
import CreatePassword from '@/components/create_password';

export default function EnterCod(){
	const [message, setMessage] = useState({text:'', type:''})
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	
	const [code, setCode] = useState<string | null>('')
	const [email, setEmail] = useState< string | null>('')
	const [token, setToken] = useState< string | null>('')

	const [submited, setSubmited] = useState(false)
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const [errors, setErrors] = useState({
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

	useEffect(() => {
    if (submited) validate()
  }, [password, confirmPassword, passwordErrors])


  useEffect(() => {
    const storedToken = sessionStorage.getItem('resetToken');
		const storedEmail = sessionStorage.getItem('email');
		const storedCode = sessionStorage.getItem('code');

    if (!storedToken) {
      router.push('/login');
    } else {
      setToken(storedToken);
			setEmail(storedEmail)
			setCode(storedCode)
    }
  }, []);

	const validate = () => {
    let newErrors: any = {}

    newErrors.password = Object.values(passwordErrors).some(error => error) ? 'A senha não atende aos requisitos' : null
    newErrors.confirmPassword = password !== confirmPassword ? 'As senhas não coincidem' : null

		setErrors(newErrors)

    return Object.values(newErrors).some(error => error !== null)
  }

	const updatePassword = async (password: string, confirmPassword: string) => {
		setLoading(true);
		setSubmited(true);
	
		const hasErrors = validate(); // Função de validação de campos
		if (hasErrors) {
			setLoading(false);
			return; 
		}
	
		try {
			const response = await fetch('/api/update-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ email, newPassword: password, code }),
			});
	
			const data = await response.json();
	
			if (response.ok) {
				setLoading(false);
				setMessage({ text: 'Senha redefinida com sucesso!', type: 'success' });
			} else {
				if (data.error) {
					if (data.error.includes('Token')) {
						setMessage({ text: 'Token expirado ou inválido. Por favor, faça login novamente.', type: 'error' });
					} else if (data.error.includes('Código')) {
						setMessage({ text: 'Código de redefinição inválido. Verifique e tente novamente.', type: 'error' });
					} else {
						setMessage({ text: `Erro desconhecido: ${data.error}`, type: 'error' });
					}
				} else {
					setMessage({ text: 'Erro desconhecido. Tente novamente.', type: 'error' });
				}
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			setMessage({ text: `Erro de conexão: ${error}`, type: 'error' });
		}
	};
	

	const handleCloseModal = () => {
		if(message.type === 'success'){
			sessionStorage.removeItem('code')
			sessionStorage.removeItem('resetToken')
			sessionStorage.removeItem('email')

			router.push('/login')
		} else {
			setMessage({text:'', type:""})
		}
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
			<p className={`${varela_round.className} ${styles.paragraphy}`}>Digite a nova senha nos campos abaixo.</p>

			<CreatePassword
				error={!!errors.password} 
				label="Nova Senha:" 
				setText={setPassword} 
				text={password} 
				placeholder="●●●●●●●●" 
				onErrorChange={setPasswordErrors}
			/>
			{errors.password && <p className={`${varela_round.className} ${styles.error}`}>{errors.password}</p>}
		

			<InputForm 
				label={'Repita a nova senha:'} 
				setText={(value) => setConfirmPassword(value)} 
				type={'text'} 
				placeholder={'xxxx123@gmail.com'}
				error={false}
				id='confirmPassword'
				text={confirmPassword}			
			/>
			{errors.confirmPassword && <p className={`${varela_round.className} ${styles.errorConfirm}`}>{errors.confirmPassword}</p>}


			<ButtonSend
				label={'Redefinir Senha'}
				disabled={Object.values(errors).some(error => error !== null)}
				onPress={() => updatePassword(password, confirmPassword)}
			/>
		</div>
	</div>
	)
}