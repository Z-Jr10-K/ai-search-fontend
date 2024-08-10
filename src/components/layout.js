import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FieldTimeOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import { Button, ConfigProvider, Layout, Menu, theme } from 'antd';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
const { Header, Sider, Content } = Layout;
const Weblayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [history, setHistory] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const siderWidth = windowWidth < 940 ? 0 : 256;

    // 从localStorage中获取历史记录
    useEffect(() => {
      const history_storage = JSON.parse(localStorage.getItem('chatHistory')) || [];
      // 将history_storage仅保留key和label
      const history = history_storage.map((item) => {
        return { key: item.key, label: item.label };
      }
      );
      setHistory(history);
    }
    , []);

    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      const path = location.pathname;
      const historyId = path.split('/').pop();
  
      if (historyId && historyId !== 'search') {
        const existingHistoryItem = history.find((item) => item.key === historyId);
  
        if (!existingHistoryItem) {
          const existingHistory= JSON.parse(localStorage.getItem(`chatHistory`)) || [];
          const existingHistoryitem = existingHistory.find((item) => item.key === historyId);
          if (existingHistoryitem) {
            const label = existingHistoryitem.label;
            setHistory([...history, { key: historyId, label }]);
          }
        }
      }
    }, [location.pathname, history]);

    const onClick = (e) => {
      if (e.key === "1") {
        navigate("/");
      }
    };

    const [selectedKeys, setSelectedKeys] = useState('1');
    const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    const getSelectedKeyFromPath = () => {
      const path = location.pathname;
      const historyItem = history.find(item => path.includes(item.key));
      return historyItem ? historyItem.key : '1';
    };

    setSelectedKeys(getSelectedKeyFromPath());

    if (location.pathname.includes('/search/')) {
      setOpenKeys(['3']);
    } else {
      setOpenKeys([]);
    }
    
  }, [location.pathname, history]);

    return (
        <Layout style={{height:"100vh", display: "flex"}}>
            <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={0} style={{backgroundColor:"#F2F2F2", flexShrink:0}} width={siderWidth} >
            <div className="demo-logo-vertical" >AI Search</div>
            <ConfigProvider
              theme={{
                components:{
                  Menu:{

                    itemSelectedColor: "#000000",
                    subMenuItemBg: "#F2F2F2"
                  }
                }
              }}
              >
                <Menu
                  theme="light"
                  mode="inline"
                  selectedKeys={[selectedKeys]}
                  openKeys={openKeys}
                  onOpenChange={(keys) => setOpenKeys(keys)}
                  defaultSelectedKeys={['1']}
                  style = {{backgroundColor:"#F2F2F2",border: "none", width:"210px" ,margin:"0 auto"}}
                  onClick={onClick}
                >
                  <Menu.Item key="1" icon={<SearchOutlined />}>搜索</Menu.Item>
                  <Menu.SubMenu key="2" icon={<FieldTimeOutlined />} title="历史记录"  >
                    {history.map((item) => (
                      <Menu.Item key={item.key}>
                         <Link to={`/search/${item.key}`} id={`history_${item.key}`} >{item.label}</Link>
                      </Menu.Item>
                    ))}
                  </Menu.SubMenu>
                </Menu>
            </ConfigProvider>
            </Sider>
        <Layout style={{flexGrow:1, flexShrink:1}}>
        <Header
            style={{
            padding: 0,
            height:32,
            background: colorBgContainer,
          }}
        >
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    margin: '0 16px',
                    width: 32,
                    height: 32,
                }}
            />
        </Header>
        <Content
          style={{
            margin: 0,
            padding: 10,
            border: 0,
            width: "100%",
            minHeight: 280,
            background: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default Weblayout;