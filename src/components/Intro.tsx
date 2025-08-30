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
          color: var(--c1);
          font-size: 0.3em;
          opacity: 0.7;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
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
        }

        .intro span:last-child {
          animation: hover 500ms linear infinite;
        }

        .box {
          margin-block: 80vh;
        }

        .text {
          margin-inline: auto;
          padding-block: 0.2em;
          max-inline-size: 20ch;
          text-wrap: balance;
          background-image: var(--gradient);
          background-size: 400%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          font-size: 0.9em;
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
          font-size: 1.5em;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .emoji.active {
          opacity: 1;
        }

        .enter-button {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: var(--gradient);
          color: white;
          border: none;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          font-weight: bold;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
          animation-delay: 0s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .enter-button:hover {
          transform: translateX(-50%) scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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
        <div className="text">WELCOME</div>
        <div className="text" style={{marginTop: '0.5em'}}>THIS IS JUR'AT'S WEBSITE.</div>
      </div>

      <div className="smile">
        <div className="emoji-container">
          <span className="emoji active">{['🫨', '🤫', '🫡', '👋', '👀'][currentEmojiIndex]}</span>
        </div>
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
