import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "gold" | "danger";
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const styles = {
    primary:
      "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black shadow-[0_0_35px_rgba(0,224,184,0.35)]",
    secondary:
      "border border-white/15 bg-white/5 text-white backdrop-blur-xl hover:bg-white/10",
    gold:
      "bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 text-black shadow-[0_0_35px_rgba(212,175,55,0.35)]",
    danger:
      "bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-[0_0_35px_rgba(248,113,113,0.25)]",
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-2xl px-8 py-4 font-bold transition duration-300 hover:-translate-y-1 hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:ring-offset-2 focus:ring-offset-[#05070A] ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}