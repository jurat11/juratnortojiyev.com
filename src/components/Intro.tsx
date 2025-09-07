import { useState, useEffect } from 'react';

const Intro = ({ onComplete }: { onComplete: () => void }) => {
  const [showButton, setShowButton] = useState(false);
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);

  // Cycle through emojis every 0.5 seconds (faster)
  useEffect(() => {
    const emojiInterval = setInterval(() => {
      setCurrentEmojiIndex((prev) => (prev + 1) % 5);
    }, 500);

    return () => clearInterval(emojiInterval);
  }, []);

  // Show button when user scrolls to the button area
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Show button when user scrolls down to about 60% of the viewport height
      if (scrollY > windowHeight * 0.6) {
        setShowButton(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Also show button after a minimum time to ensure animations complete
    const minTimeTimer = setTimeout(() => {
      setShowButton(true);
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(minTimeTimer);
    };
  }, []);
  

  return (
    <div className="intro-container">
      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none;
        }

        :root {
          --color: #0f172a;
          --c1: #0FFCBE;
          --c2: #106EBE;
          --c3: #667eea;
          --gradient: linear-gradient(
            60deg,
            var(--c2),
            var(--c1),
            var(--c3),
            var(--c1),
            var(--c2)
          );
          --scale-start: 0.5;
          --scale-end: 1.001;
          --hover-offset: 5%;

          --ease-elastic: linear(
            0, 0.186 2.1%, 0.778 7.2%, 1.027 9.7%, 1.133, 1.212, 1.264, 1.292 15.4%,
            1.296, 1.294, 1.285, 1.269 18.9%, 1.219 20.9%, 1.062 25.8%, 0.995 28.3%,
            0.944 31.1%, 0.93, 0.921, 0.92 35.7%, 0.926, 0.94 39.7%, 1.001 47%, 1.014,
            1.021 52.4%, 1.02 56.4%, 1 65.5%, 0.994 70.7%, 1.001 88.4%, 1
          );
          --ease-bounce-out: cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @media (prefers-reduced-motion) {
          :root {
            --scale-start: var(--scale-end);
            --ease-elastic: ease-out;
            --ease-bounce-out: ease-out;
            --hover-offset: 0;
          }
        }

        .intro-container {
          padding-inline: 1rem;
          font-family: system-ui;
          font-weight: 800;
          font-size: calc(1rem + 10vmin);
          text-align: center;
          overflow-x: hidden;
          overflow-y: hidden;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background-color: var(--color);
          color: white;
          position: relative;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: #0FFCBE;
          font-size: 0.35em;
          opacity: 0.9;
          animation: bounce 2s infinite;
          text-shadow: 0 0 10px rgba(15, 252, 190, 0.5);
          font-weight: 600;
          letter-spacing: 0.1em;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0) scale(1);
          }
          40% {
            transform: translateX(-50%) translateY(-12px) scale(1.05);
          }
          60% {
            transform: translateX(-50%) translateY(-6px) scale(1.02);
          }
        }

        .intro {
          display: flex;
          justify-content: center;
          gap: 0.2em;
          font-size: 0.5em;
          margin-block-start: calc(50vh - 1ex);
        }

        .intro span {
          display: inline-block;
        }

        .intro span:first-child {
          transform-origin: right bottom;
          animation: wave 250ms 1s ease 3;
          filter: drop-shadow(0 0 15px rgba(15, 252, 190, 0.6));
        }

        .intro span:last-child {
          animation: hover 500ms linear infinite;
          background: linear-gradient(135deg, #0FFCBE 0%, #0FFCBE 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-shadow: 0 0 20px rgba(15, 252, 190, 0.4);
        }



        .box {
          margin-block: 80vh;
        }

        .text {
          margin-inline: auto;
          padding-block: 0.3em;
          max-inline-size: 20ch;
          text-wrap: balance;
          font-size: 0.95em;
          background: linear-gradient(135deg, #0FFCBE 0%, #0FFCBE 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: hover 500ms linear infinite, welcomeGlow 3s ease-in-out infinite;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          filter: drop-shadow(0 0 15px rgba(15, 252, 190, 0.6));
        }

        .text:hover {
          transform: scale(1.05);
          filter: drop-shadow(0 0 25px rgba(15, 252, 190, 0.8)) drop-shadow(0 0 35px rgba(15, 252, 190, 0.4));
          background: linear-gradient(135deg, #0FFCBE 0%, #0FFCBE 100%);
          background-clip: text;
          -webkit-background-clip: text;
        }

        @keyframes textShine {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }

        @keyframes textGlow {
          0% {
            text-shadow: 0 0 30px rgba(15, 252, 190, 0.3), 0 0 40px rgba(15, 252, 190, 0.2);
          }
          100% {
            text-shadow: 0 0 50px rgba(15, 252, 190, 0.5), 0 0 70px rgba(15, 252, 190, 0.3), 0 0 90px rgba(15, 252, 190, 0.2);
          }
        }

        @keyframes textFloat {
          0%, 100% {
            transform: translateY(0px) translateZ(0px);
          }
          25% {
            transform: translateY(-2px) translateZ(2px);
          }
          50% {
            transform: translateY(-4px) translateZ(4px);
          }
          75% {
            transform: translateY(-2px) translateZ(2px);
          }
        }

        @keyframes welcomeGlow {
          0%, 100% {
            filter: drop-shadow(0 0 15px rgba(15, 252, 190, 0.6)) drop-shadow(0 0 25px rgba(15, 252, 190, 0.3));
            background: linear-gradient(135deg, #0FFCBE 0%, #0FFCBE 100%);
            background-clip: text;
            -webkit-background-clip: text;
          }
          50% {
            filter: drop-shadow(0 0 25px rgba(15, 252, 190, 0.8)) drop-shadow(0 0 35px rgba(15, 252, 190, 0.5)) drop-shadow(0 0 45px rgba(15, 252, 190, 0.3));
            background: linear-gradient(135deg, #0FFCBE 0%, #0FFCBE 100%);
            background-clip: text;
            -webkit-background-clip: text;
          }
        }

        @supports (animation-timeline: view()) {
          .box {
            animation: trigger steps(1) both, fade linear both;
            animation-timeline: view();
            animation-range: entry 80% contain 40%;
          }

          .text {
            animation: pop-back 300ms var(--ease-bounce-out) forwards;
          }

          @container style(--animate: true) {
            .text {
              animation: pop 600ms var(--ease-elastic) forwards,
                text-gradient 1s cubic-bezier(0, 0.55, 0.45, 1) forwards;
            }
          }
        }

        .smile {
          width: 1em;
          margin-inline: auto;
          margin-block-end: calc(50vh - 1ex);
        }

        .emoji-container {
          position: relative;
          width: 1em;
          height: 1em;
        }

        .emoji {
          position: absolute;
          top: 0;
          left: 0;
          width: 1em;
          font-size: 2em;
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          filter: drop-shadow(0 4px 8px rgba(15, 252, 190, 0.3)) drop-shadow(0 2px 4px rgba(16, 110, 190, 0.2));
          transform: scale(1) rotate(0deg);
          text-shadow: 0 0 20px rgba(15, 252, 190, 0.5);
        }

        .emoji.active {
          opacity: 1;
          animation: emojiGlow 2s ease-in-out infinite alternate;
        }

        @keyframes emojiGlow {
          0% {
            filter: drop-shadow(0 4px 8px rgba(15, 252, 190, 0.3)) drop-shadow(0 2px 4px rgba(16, 110, 190, 0.2)) brightness(1);
            transform: scale(1) rotate(0deg);
          }
          50% {
            filter: drop-shadow(0 6px 12px rgba(15, 252, 190, 0.4)) drop-shadow(0 3px 6px rgba(16, 110, 190, 0.3)) brightness(1.1);
            transform: scale(1.05) rotate(2deg);
          }
          100% {
            filter: drop-shadow(0 8px 16px rgba(15, 252, 190, 0.5)) drop-shadow(0 4px 8px rgba(16, 110, 190, 0.4)) brightness(1.2);
            transform: scale(1.1) rotate(-1deg);
          }
        }

        .enter-button {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #0FFCBE 0%, #0FFCBE 100%);
          color: #0f172a;
          border: none;
          padding: 1.2rem 2.5rem;
          font-size: 1.3rem;
          font-weight: 800;
          border-radius: 60px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          opacity: 0;
          animation: fadeIn 0.6s ease forwards;
          animation-delay: 0s;
          box-shadow: 0 8px 25px rgba(15, 252, 190, 0.3), 0 4px 15px rgba(15, 252, 190, 0.2);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(15, 252, 190, 0.3);
        }

        .enter-button:hover {
          transform: translateX(-50%) scale(1.08) translateY(-2px);
          box-shadow: 0 15px 40px rgba(15, 252, 190, 0.4), 0 8px 25px rgba(15, 252, 190, 0.3);
          background: linear-gradient(135deg, #0FFCBE 0%, #0FFCBE 100%);
          border-color: rgba(15, 252, 190, 0.6);
        }

        .enter-button:active {
          transform: translateX(-50%) scale(1.02) translateY(0px);
          transition: all 0.1s ease;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes trigger {
          to {
            --animate: true;
          }
        }

        @keyframes pop {
          from {
            scale: var(--scale-start);
          }
          to {
            scale: var(--scale-end);
          }
        }

        @keyframes text-gradient {
          100% {
            background-position: 150% center;
          }
        }

        @keyframes pop-back {
          from {
            scale: var(--scale-end);
          }
          to {
            color: var(--color);
            scale: var(--scale-start);
          }
        }

        @keyframes wink {
          0% {
            translate: 0 0;
          }
          20% {
            translate: -100% 0;
          }
          40% {
            translate: -200% 0;
          }
          60% {
            translate: -300% 0;
          }
          80% {
            translate: -400% 0;
          }
          100% {
            translate: 0 0;
          }
        }

        @keyframes wave {
          50% {
            rotate: 10deg;
          }
        }

        @keyframes hover {
          from,
          to {
            translate: 0 calc(var(--hover-offset) * -1);
          }
          50% {
            translate: 0 var(--hover-offset);
          }
        }
      `}</style>

      <div className="intro">
        <span>👋</span>
        <span>Hello</span>
      </div>

      <div className="box">
        <div className="text" style={{animationDelay: '0s'}}>WELCOME</div>
        <div className="text" style={{marginTop: '0.5em', animationDelay: '0.5s'}}>THIS IS JUR'AT'S WEBSITE.</div>
      </div>

      

      {!showButton && (
        <div className="scroll-indicator">
          ↓ Scroll down to continue ↓
        </div>
      )}

      {showButton && (
        <button className="enter-button" onClick={onComplete}>
          ENTER WEBSITE →
        </button>
      )}
    </div>
  );
};

export default Intro;
