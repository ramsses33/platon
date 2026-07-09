import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/[0.075] ${className}`}
    >
      {children}
    </div>
  );
}