import React from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useRouter } from "next/navigation";
const HeaderTopBar = () => {
  const router = useRouter();
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#D3007E",
      }}
    >
      {" "}
      <div className="flex justify-content-center align-items-center flex-row gap-2 cursor-pointer" onClick={()=>router.push(`https://chat.whatsapp.com/GqbzxDeNK588fnEEgYlbO2`)}>
        <WhatsAppIcon style={{ color: "white" }} className="icons" />
        <div className="flex flex-col mt-3 text-left">
          <p className="text-sm font-semibold text-white text-nowrap span-text">
            Click Here{" "}
            <span className="blinking-text">To Join Our Community</span>
          </p>
        </div>
        <style jsx>{`
          .blinking-text {
            animation: blink-animation 1s steps(5, start) infinite;
            color: yellow; /* Optional: Change the color for the blinking effect */
          }
          @keyframes blink-animation {
            to {
              visibility: hidden;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
export default HeaderTopBar;