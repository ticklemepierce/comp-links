import { MouseEventHandler, ReactNode } from "react";

const Button = ({ onClick, children }: { onClick: MouseEventHandler, children: ReactNode}) => {  
  return (
    <button className="bg-blue-600 p-4 text-white	rounded-lg font-bold cursor-pointer" onClick={onClick}>{children}</button>
  )
}

export default Button;