import { useState } from "react";
import { PiPencilLineDuotone } from "react-icons/pi";

export default function EditIcon({ onClick }: { onClick?: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <PiPencilLineDuotone size={20} color={isHovered ? "#FFFFFF" : "gray"} />
    </button>
  );
}
