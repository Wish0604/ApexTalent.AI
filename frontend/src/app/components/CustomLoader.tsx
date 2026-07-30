"use client";

interface CustomLoaderProps {
  text?: string;
  className?: string;
}

export default function CustomLoader({ text = "Generating", className = "" }: CustomLoaderProps) {
  const letters = text.split("");

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="loader-wrapper">
        {letters.map((char, index) => (
          <span
            key={index}
            className="loader-letter"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
        <div className="loader"></div>
      </div>
    </div>
  );
}
