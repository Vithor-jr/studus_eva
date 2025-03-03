"use client";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import styles from "./styles.module.css";
import { LuSquareArrowRight, LuSquareArrowLeft } from "react-icons/lu";
import Image from "next/image";
import gradient from '../../assets/gradiente.png'
interface DrawerProps {
  open: boolean;
  userData: {name:string, id:string, email:string, phone:string, username:string} | null;
  url: string;
  onOpenChange: (open: boolean) => void;
}

export default function Drawer({ open, onOpenChange, userData, url }: DrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button className="rounded-xl bg-transparent border-transparent p-2 hover:bg-[#311F69]">
          <LuSquareArrowRight className="w-7 h-7 text-[#6048AC]" />
        </button>
      </SheetTrigger>

      <SheetContent className={styles.container} side="left">
        <div className="flex gap-3 items-center">
          <div className={styles.container_image_left}>
            <Image src={gradient} alt="gradient" className="w-[60px] z-10 h-[60px] absolute" />
            {url !== "" ? (
              <Image src={url} alt="image" className="rounded-full z-20" width={55} height={55} />
            ) : (
              <Image src='https://www.pngmart.com/files/23/Profile-PNG-Photo.png' alt="image" className="rounded-full z-20" width={50} height={50} />
            )}
          </div>

          <SheetTitle>Olá, {userData?.username}!</SheetTitle>
        </div>

        <p className="text-sm mt-4">Conteúdo do drawer aqui.</p>
      </SheetContent>
    </Sheet>
  );
}
