import React ,{useState, useReducer} from 'react';
import './assets/scss/App.scss';
import { Layout, Menu, Select } from 'antd';
import {
  PieChartOutlined,
  UserOutlined,
  InboxOutlined
} from '@ant-design/icons';
import {
  Routes,
  Route,
  Link
} from "react-router-dom";
import {Customers,Bill,WareHouse} from './page/admin';
const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;


function App() {
  const [collapsed , setcollapsed ] = useState(false);
  const [MCN, setMCN] = useState('full');


  const onCollapse  = (e)=>{
    setcollapsed(e)
  }
  const Nav = ()=>(
    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
      <Menu.Item key="1" icon={<PieChartOutlined />}>
        <Link to={"/bill"}>
          Quản lý hóa đơn
        </Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />}>
        <Link to={"/customers"}>
          Quản lý khách hàng
        </Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<InboxOutlined />}>
        <Link to={"/statical"}>
          Thống kê doanh thu
        </Link>
      </Menu.Item>
    </Menu>
  )

  const ContentWeb = ()=>(
    <div className="site-layout-background" style={{ padding: 24, minHeight: 590,marginTop:16 }}>
    <Routes>
      <Route path="/" element={<Bill MCN={MCN} />}/>
      <Route path="/bill" element={<Bill MCN={MCN} />} />
      <Route path="/customers" element={<Customers MCN={MCN}/>} />
      <Route path="/statical" element={<WareHouse MCN={MCN}/>} />
    </Routes>
    </div>

  )
  const handleChangeSelect = (e)=>{
      setMCN(e)
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo">
          <p>Logo</p>
        </div>
        {Nav()}
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} >
          <div style={{ marginLeft: 20, display:'flex',justifyContent:'flex-start', alignContent:'center', alignItems:'center' }} >
              <span style={{ fontSize:14 }}>QUẢN LÝ </span>
              <Select defaultValue="full" style={{ marginLeft: 5 }} onChange={handleChangeSelect}>
                    <Option value="full">Tất cả chi nhánh</Option>
                    <Option value="CN1">Chi nhánh 1</Option>
                    <Option value="CN2">Chi nhánh 2</Option>
                    <Option value="CN3">Chi nhánh 3</Option>
                </Select>
          </div>
          
        
        </Header>
        <Content style={{ margin: '0 16px' }}>
          {ContentWeb()}
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2022</Footer>
      </Layout>
    </Layout>
  )
}

export default App;
