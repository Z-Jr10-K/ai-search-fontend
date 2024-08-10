import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "./preset-query.css";

const generateHistoryId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const PresetQuery = ({ query }) => {
    const navigate = useNavigate();
  
    const handleClick = () => {
      const historyId = generateHistoryId();
      const label = query.trim().substring(0, 5);
      const newHistory = {
        key: historyId,
        label: label,
        messages: [
          { role: "user", content: query.trim() }
        ]
      };
  
      // 读取 localStorage 中的 chatHistory
      const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
      chatHistory.push(newHistory);
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

      navigate(`/search/${historyId}`);
    };

    return (
        <Button
          className="preset-query-link"
          onClick={handleClick}
        >
          {query}
        </Button>
      );
    };


