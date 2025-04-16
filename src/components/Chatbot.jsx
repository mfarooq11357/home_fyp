import React, { useEffect, useState, useRef } from 'react';

const BOT_ID      = '2c26f411-ece5-435e-bb48-10c2bfb03ba4';
const INJECT_URL  = 'https://cdn.botpress.cloud/webchat/v2.3/inject.js';
const TTS_ENDPOINT = 'https://dk5rf8-3000.csb.app/synthesize';

export default function Chatbot() {
  const [chatOpened, setChatOpened] = useState(false);
  const bubbleRef = useRef(null);
  const processedMessages = useRef(new Set());
  const currentAudio = useRef(null);

  // Load Botpress script & init
  useEffect(() => {
    if (window.__botpressInitialized) return;
    window.__botpressInitialized = true;

    const script = document.createElement('script');
    script.src = INJECT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.botpress) {
        console.error('Botpress failed to load');
        return;
      }

      // clear any old session
      localStorage.removeItem(`bp-webchat-${BOT_ID}`);

      window.botpress.init({
        botId: BOT_ID,
        clientId: BOT_ID,
        configuration: {
          botName: 'SES AI Chatbot',
          botAvatar: 'https://i.ibb.co/Z4Br5t0/image-removebg-preview-1.png',
          initialPayload: 'welcome',
          color: '#2D50A1',
          variant: 'solid',
          themeMode: 'light',
          fontFamily: 'inter',
          radius: 1
        },
        onInit: () => {
          const convId = window.botpress.getConversationId();
          localStorage.setItem('bpConversationId', convId);
          localStorage.setItem('bpSessionStart', Date.now().toString());
        }
      });

      // Show bubble after 3s if not opened
      setTimeout(() => {
        if (!chatOpened && bubbleRef.current) {
          bubbleRef.current.style.display = 'block';
        }
      }, 3000);

      // When chat opens
      window.botpress.on('webchat:open', () => {
        setChatOpened(true);
        if (bubbleRef.current) bubbleRef.current.style.display = 'none';
      });

      // When chat ready, auto-open & set up TTS
      window.botpress.on('webchat:ready', () => {
        if (bubbleRef.current) bubbleRef.current.style.display = 'none';
        window.botpress.open();

        if (!window.__botpressTTSMessageListenerRegistered) {
          window.__botpressTTSMessageListenerRegistered = true;

          window.botpress.on('message', (message) => {
            // only bot responses
            if (processedMessages.current.has(message.id)) return;
            processedMessages.current.add(message.id);
            if (message.metadata) return;

            const text = message.block?.block?.text;
            if (!text) return;

            // stop old audio
            if (currentAudio.current) {
              currentAudio.current.pause();
              currentAudio.current.currentTime = 0;
            }

            // fetch TTS
            fetch(TTS_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text })
            })
              .then(res => {
                if (!res.ok) throw new Error('TTS endpoint failed');
                return res.blob();
              })
              .then(blob => {
                const url = URL.createObjectURL(blob);
                currentAudio.current = new Audio(url);
                currentAudio.current.play().catch(console.error);
              })
              .catch(console.error);
          });
        }
      });
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [chatOpened]);

  // Bubble click handler
  const handleBubbleClick = () => {
    setChatOpened(true);
    if (bubbleRef.current) bubbleRef.current.style.display = 'none';
    window.botpress?.open();
  };


}
