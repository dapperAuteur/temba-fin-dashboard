"use client"

import React, { useEffect } from "react";

const ConsoltoChat: React.FC = () => {
  useEffect(() => {
    const scriptId = "et-iframe";
    // Prevent script from being added multiple times
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.setAttribute("src", "https://client.consolto.com/iframeApp/iframeApp.js");
      script.id = scriptId;
      script.async = true;
      script.setAttribute("data-widgetId", "6153673fc026597060d3764a");
      script.setAttribute("data-version", "0.5");
      script.setAttribute("data-test", "false");
      document.body.appendChild(script);
    }
  }, []);

  return null; // The script handles everything, so no UI is needed here
};

export default ConsoltoChat;
