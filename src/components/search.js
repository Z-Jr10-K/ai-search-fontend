import React, {useState} from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PresetQuery } from './preset-query';
const { TextArea } = Input;

const Search = () => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const generateHistoryId = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() !== '') {
      const historyId = generateHistoryId();
      const label = value.trim().substring(0, 5);
      const newHistory = { key: historyId, label: label, messages:[{"role":"user", "content": value.trim()}] };
      // 读取localStorage中的chatHistory
      const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
      chatHistory.push(newHistory);
      localStorage.setItem(`chatHistory`, JSON.stringify(chatHistory));
      
      navigate(`/search/${historyId}`);
      setValue('');

    }
  };

  return (

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 'auto', maxWidth: 800 }}>
      <h1 style={{ fontSize: 50, color: '#2563EB', fontWeight: 700, margin: '20px 10px', textAlign: 'center' }}>AI Search</h1>
      <div style={{position: "relative", width: 600}}>
        <form >
          <TextArea rows={4} placeholder="请输入任何内容..." style={{maxWidth: 600, height:180, maxHeight:200, minHeight: 50}} value={value}
            onChange={(e) => setValue(e.target.value)}/>
          <Button type="primary" shape="circle" icon={<SearchOutlined/>} style={{
              display: 'block',
              position: 'absolute',
              right: '10px',
              bottom: '10px',
              zIndex: 1,
            }} onClick={handleSubmit}> </Button>
        </form>
      </div >
      <PresetQuery query={"谁获得了巴黎奥运会男子100米自由泳冠军"} />
      <PresetQuery query={"哪只球队获得了2024年欧洲杯冠军"} />
      
    </div>

  );
};
export default Search;