// src/components/ui/Ticker.jsx
import React, { useEffect, useRef, useState } from "react";
import tickerItemsJSON from "./ticker.json"; // import JSON
import "./Ticker.css";

const Ticker = () => {
  const tickerRef = useRef(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(tickerItemsJSON); // set ticker items from JSON

    if (tickerRef.current) {
      // Duplicate content for infinite scroll effect
      tickerRef.current.innerHTML += tickerRef.current.innerHTML;
    }
  }, []);

  return (
    <div className="ticker-wrapper">
      <div className="ticker" ref={tickerRef}>
        {items.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;

