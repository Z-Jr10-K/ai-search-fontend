"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Input, Button } from 'antd';
import { WechatWorkOutlined } from '@ant-design/icons';
import Message from './message';
import Sources from './sources';
import { parseStreaming } from '../utils/parse-streaming';
import { parseFollowUp } from '../utils/parse-streaming';
import './result.css';

const Result = () => {
    const { historyId } = useParams();
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [sources, setSources] = useState([]);
    const [output, setOutput] = useState('');
    const [flag, setFlag] = useState(true);
  
    // 加载历史记录的消息
    useEffect(() => {
      const loadMessages = () => {
        const storedHistories = JSON.parse(localStorage.getItem('chatHistory')) || [];
        const history = storedHistories.find((h) => h.key === historyId);
        const storedMessages = history.messages;
        const storedSources = history.sources;
        if (storedMessages) {
          setMessages([...storedMessages]);
        }
        if (storedSources) {
          setSources([...storedSources]);
        }
      };
  
      loadMessages();
    }, [historyId]);
  
    useEffect(() => {

      const fetchData = async () => {
          try {
              // 从localstore中获取历史记录
              const storedHistories = JSON.parse(localStorage.getItem('chatHistory')) || [];
              const history = storedHistories.find((h) => h.key === historyId);
              const storedMessages = history.messages;
              if (storedMessages && storedMessages.length > 0) {
                  const lastMessage = storedMessages[storedMessages.length - 1];
                  if (lastMessage.role === 'user') {
                      const searchSuffix = lastMessage.content;

                      if (searchSuffix) {
                          const controller = new AbortController();
                          await parseStreaming(
                              controller,
                              searchSuffix,
                              historyId,
                              setSources,
                              setOutput,
                              setMessages,
                              (error) => {
                                  console.error('Error during streaming:', error);
                              }
                          );
                          return () => {
                              controller.abort();
                          };
                      }
                      
                  }
                  else{
                    setFlag(false);
                  }
              }
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchData();
  }, [historyId]);

  
    // 处理用户输入新消息
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };
  
    const sendMessage = async () => {
      if (inputValue.trim() !== '') {
        const newMessage = { role: 'user', content: inputValue.trim() };
        // 从localstore中获取历史记录
        const oldMessages = JSON.parse(localStorage.getItem('chatHistory')).find((h) => h.key === historyId).messages;
        // 更新消息
        const updatedMessages = [...oldMessages, newMessage];
        setMessages(updatedMessages);
        setOutput('');
        setFlag(true);
        const controller = new AbortController();
        await parseFollowUp(
          controller,
          updatedMessages,
          sources,
          historyId,
          setOutput,
          (error) => {
              console.error('Error during streaming:', error);
          }
          );
        setInputValue('');
      }
    };
  
    return (
      <div className='result'>
        <div className='result-answers'>
          <div className='result-messages' style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <Message key={index} role={msg.role} content={msg.content} sources={sources}/>
            ))}
            { 
              flag &&
              <Message role='assistant' content={output} sources={sources}/> 
            }
          
          </div>
          <div className='result-input'>
            <Input
              placeholder='请继续追问...'
              value={inputValue}
              onChange={handleInputChange}
              onPressEnter={sendMessage} // 按下 Enter 键发送消息
              style={{ height: 40 }}
            />
            <Button
              type='primary'
              onClick={sendMessage} // 点击按钮发送消息
              style={{
                position: 'absolute',
                right: '5px',
                height: 40,
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                transition: 'none',
              }}
            >
              <WechatWorkOutlined style={{ color: 'rgb(21, 93, 255)' }} />
            </Button>
          </div>
        </div>
        <div className='result-sources'>
          <Sources sources={sources} />
        </div>
      </div>
    );
  };
  
  export default Result;