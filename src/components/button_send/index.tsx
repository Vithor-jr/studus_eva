import { varela_round } from "@/app/fonts/fonts";

type Props = {
  label: string;
  onPress: () => void;
  type?: "submit" | "reset" | "button" | undefined;
  disabled: boolean;
};

export default function ButtonSend({ label, onPress, disabled, type }: Props) {
  return (
    <div className="w-full flex items-center justify-center mt-10">
      <button
        disabled={disabled}
        onClick={onPress}
        type={type ? type : 'submit'}
        className={`
          bg-[#6048AC] py-2 px-20 rounded-3xl transition-all duration-300
          text-white font-semibold ${varela_round.className}
          ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-[#4A3597] active:scale-95"}
        `}
      >
        {label}
      </button>
    </div>
  );
}
