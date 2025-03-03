import { useState } from 'react';
import { varela_round } from '@/app/fonts/fonts';
import styles from './styles.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type Props = {
  label: string;
  setText: (value: string) => void;
  type: string;
  register?: boolean;
  placeholder: string;
  error:boolean;
  id:string;
  text: string | undefined;
};

export default function InputForm({ label, error, id, placeholder, setText, type, register=false, text }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  
	const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`flex flex-col gap-2 ${register ? styles.input_register : styles.input_container }`}>
      {
        label !== '' &&
        <label htmlFor={id} className={`${varela_round.className} text-base lg:text-x1`}>
          {label}
        </label>
      }

      {type === 'password' ? (
        <div className="relative">
          <input
            id={id}
            className={`${styles.input} ${varela_round.className}  border-2 ${error ? 'border-[#FF0000]' : 'border-[var(--theme-input)]'} lg:p-[10px] p-[7px] pr-10 w-full`} 
            onChange={(event) => setText(event.target.value)}
            value={text}
            placeholder={placeholder}
            type={showPassword ? 'text' : 'password'}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <FaEyeSlash style={{opacity: 0.4}} /> : <FaEye style={{opacity: 0.4}}/>} 
          </button>
        </div>
      ) : (
        <input
          id={id}
          className={`${styles.input} border-2 ${error ? 'border-[#FF0000]' : 'border-[var(--theme-input)]'} ${varela_round.className} lg:p-[10px] p-[7px] w-full`}
          onChange={(event) => setText(event.target.value)}
          value={text}
          maxLength={type === 'tel' ? 15 : 999}
          placeholder={placeholder}
          type={type}
        />
      )}
    </div>
  );
}