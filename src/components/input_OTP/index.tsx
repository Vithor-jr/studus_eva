import { varela_round } from "@/app/fonts/fonts";
import { useState, useRef } from "react";

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
}

export default function InputOTP({ length = 6, onComplete }: OTPInputProps) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9a-zA-Z]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((char) => char !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      {otp.map((char, index) => (
        <input
          key={index}
					ref={(el) => {inputRefs.current[index] = el}}					
          type="text"
          value={char}
          maxLength={1}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={`${varela_round.className} w-12 h-12 border-[2px] border-[var(--theme-input)] rounded-lg text-center text-xl font-bold bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
      ))}
    </div>
  );
}
