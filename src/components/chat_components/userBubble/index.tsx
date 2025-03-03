import React from "react";

const UserBubble = ({ text }: { text: string }) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="152"
        height="80"
        viewBox="0 0 152 80"
        
      >
        <path
          d="M0 15C0 6.71573 6.71573 0 15 0H131.087C138.625 0 144.996 5.61008 145.973 13.0846C150.964 51.2816 154.388 78.0592 149.944 78.9757C144.926 80.0105 141.165 73.416 136.042 73.416H15C6.71574 73.416 0 66.7003 0 58.416V15Z"
          fill="#6048AC"
        />
      </svg>
      <span
        style={{
          zIndex:2,
          right: "25px",
          top: "15px",
          color: "white",
          fontSize: "14px",
          lineHeight: "1.5",
          maxWidth: "120px",
          wordWrap: "break-word",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default UserBubble;
