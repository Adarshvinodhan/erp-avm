import React from "react";

interface SpinnerProps {
  size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 36 }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="rounded-full border-4 border-gray-400 border-t-transparent animate-spin"
        style={{
          width: size,
          height: size,
          boxShadow: "0 0 12px rgba(107, 114, 128, 0.3)", 
        }}
      />
    </div>
  );
};

export default Spinner;
