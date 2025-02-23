"use client"

import React, { useEffect, useState } from "react";
import { LoadingState } from '@/types/common';

const ConsoltoChat: React.FC = () => {
  const [scriptState, setScriptState] = useState<LoadingState<boolean>>({
    isLoading: false,
    error: null,
    data: null
  });
  useEffect(() => {
    const scriptId = "et-iframe";
    // Prevent script from being added multiple times
    if (!document.getElementById(scriptId)) {
      setScriptState({ isLoading: true, error: null, data: null });
      const script = document.createElement("script");
      script.setAttribute("src", "https://client.consolto.com/iframeApp/iframeApp.js");
      script.id = scriptId;
      script.async = true;
      script.setAttribute("data-widgetId", "6153673fc026597060d3764a");
      script.setAttribute("data-version", "0.5");
      script.setAttribute("data-test", "false");

      script.onload = () => {
        setScriptState({ isLoading: false, error: null, data: true });
      };

      script.onerror = () => {
        setScriptState({ 
          isLoading: false, 
          error: new Error("Failed to load chat widget"), 
          data: null 
        });
      };

      document.body.appendChild(script);
    }
  }, []);

  if (scriptState.error) {
    return <div className="text-red-500">Chat widget failed to load</div>;
  }

  return null; // The script handles everything, so no UI is needed here
};

export default ConsoltoChat;
