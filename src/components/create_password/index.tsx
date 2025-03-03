import { useState, useEffect } from 'react';
import { varela_round } from '@/app/fonts/fonts';
import styles from './styles.module.css';
import { FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";

type Props = {
  label: string;
  setText: (value: string) => void;
  placeholder: string;
  error: boolean;
  text: string | undefined;
  onErrorChange: (errors: {
    length: boolean;
    specialChar: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
  }) => void;
};

export default function CreatePassword({ label, error, placeholder, setText, text, onErrorChange }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [focus, setFocus] = useState(false);

  const [errors, setErrors] = useState({
    length: true,
    specialChar: true,
    uppercase: true,
    lowercase: true,
    number: true
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (!text) return;

    const newErrors = {
      length: text.length < 8,
      specialChar: !/[!@#$%^&*(),.?":{}|<>]/.test(text),
      uppercase: !/[A-Z]/.test(text),
      lowercase: !/[a-z]/.test(text),
      number: !/[0-9]/.test(text)
    };

    setErrors(newErrors);
    onErrorChange(newErrors);
  }, [text, onErrorChange]);

  return (
    <div className={`flex flex-col gap-2 ${styles.input_register}`}>
      <label className={`${varela_round.className} text-base lg:text-x1`}>
        {label !== '' ? label : 'Preencha o campo abaixo'}
      </label>

      <div className="relative">
        <input
          className={`${styles.input} ${varela_round.className} border-2 ${error ? 'border-[#FF0000]' : 'border-[var(--theme-input)]'} lg:p-[10px] p-[7px] pr-10 w-full`}
          onChange={(event) => setText(event.target.value)}
          value={text}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={placeholder}
          type={showPassword ? 'text' : 'password'}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {showPassword ? <FaEyeSlash style={{ opacity: 0.4 }} /> : <FaEye style={{ opacity: 0.4 }} />}
        </button>
      </div>

      {focus && (
        <div className="flex flex-col gap-1  text-[0.9rem] pt-5">
          <ValidationItem valid={!errors.length} text="Pelo menos 8 caracteres" />
          <ValidationItem valid={!errors.specialChar} text="Pelo menos 1 caractere especial" />
          <ValidationItem valid={!errors.uppercase} text="Pelo menos 1 caractere maiúsculo" />
          <ValidationItem valid={!errors.lowercase} text="Pelo menos 1 caractere minúsculo" />
          <ValidationItem valid={!errors.number} text="Pelo menos 1 número" />
        </div>
      )}
    </div>
  );
}

const ValidationItem = ({ valid, text }: { valid: boolean; text: string }) => (
  <div className="flex items-center gap-2 ">
    {valid ? <FaCheck className="text-[#00FF00]" /> : <IoClose className="text-[#FF0000]" />}
    <p className={`${varela_round.className}`}>{text}</p>
  </div>
);