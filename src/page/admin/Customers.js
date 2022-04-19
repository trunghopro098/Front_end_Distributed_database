import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import * as FetchAPI from '../../util/fetchAPI';
import moment from 'moment'
import { Drawer, Button, Form, Input ,InputNumber,message, notification} from 'antd';

function Customers(props){
    const [form] = Form.useForm();
    const [formupdate] = Form.useForm();
    const [DataUser, setDataUser] = useState([]);
    const [loadingTable, setloadingTable] = useState(false);
    const [visibleShow, setvisibleShow] = useState(false);
    const [visibleUpdateUser, setvisibleUpdateUser] = useState(false);
    
    useEffect(() => {
        setloadingTable(true);
        GetUser();

    },[props.MCN])
    

    const GetUser = async()=>{
        const res = await FetchAPI.postDataAPI("/user/getUser",{"MCN":props.MCN});
        // console.log(res.msg.recordsets[0]);
        setDataUser(res.msg.recordsets[0]);
        setloadingTable(false);
    }
    const onFinishAddUser = async()=>{
        const valu = form.getFieldsValue();
        const obj = {MCN: props.MCN, ...valu}
        console.log(obj);
        const res = await FetchAPI.postDataAPI("/user/addUser",obj);
        console.log(res)
        if(res.msg==="Success"){
            message.success("Thêm khách hàng thành công !!!");
            form.setFieldsValue({HOTEN:null, SODT:null, DIACHI:null, NGAYSINH:null,DOANHSO:1});
            setvisibleShow(false);
        }else{
            message.error("Có lỗi rồi");
                setvisibleShow(false);
        }       
    }
        const getDateUpdateUser = async(MKH)=>{
            const obj = {MAKH:MKH, MCN: props.MCN}
            const res = await FetchAPI.postDataAPI('/user/getUserById', obj);
            const user = res.msg.recordset[0];
            formupdate.setFieldsValue({ MAKH:user.MAKH, HOTEN:user.HOTEN, SODT:user.SODT, DIACHI:user.DIACHI, NGAYSINH:user.NGAYSINH, DOANHSO:user.DOANHSO})
            // console.log(res.msg.recordset[0].HOTEN);
            setvisibleUpdateUser(true)
    }
    const onFinishUpdateUser = async()=>{
        const valu = formupdate.getFieldsValue();
        const obj = {MCN: props.MCN, ...valu}
        console.log(obj);
        const res = await FetchAPI.postDataAPI("/user/updateUserById",obj);
        console.log(res)
        if(res.msg==="Success"){
            message.success("Cập nhật thành công !!!");
            form.setFieldsValue({HOTEN:null, SODT:null, DIACHI:null, NGAYSINH:null,DOANHSO:1});
            setvisibleUpdateUser(false);
        }else{
            message.error("Có lỗi rồi");
            setvisibleUpdateUser(false);
        }       
    }
    const columnsUser = [
        {
          title: 'Mã khách hàng',
          dataIndex: 'MAKH',
          key: 'MAKH',
          render: (text,record) =>(
              <div>
                  <span>{text}</span>
              </div>
          )
        },
        {
          title: 'Tên khách hàng',
          dataIndex: 'HOTEN',
          key: 'HOTEN',
        },
        
        {
            title: 'Số điện thoại',
            dataIndex: 'SODT',
            key: 'SODT',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'DIACHI',
            key: 'DIACHI',
        },
        {
            title: 'Ngày Sinh',
            dataIndex: 'NGAYSINH',
            key: 'NGAYSINH',
            render: (text,record)=>(
                <span>{moment(text).format('Do MMMM YYYY')}</span>
            )
          },
          {
            title: 'Chỉnh sửa',
            dataIndex: 'ChinhSua',
            key: 'ChinhSua',
            render: (text,record)=>(
                <div className='updateUser'>
                    {props.MCN ==="full" ? 
                        <Button ghost type="primary" 
                            onClick={()=>notification["warning"]({
                            message: 'Thông báo',
                            description:
                            'Vui lòng chọn chi nhánh trước khi thêm khách hàng.',
                        })} >
                                Sửa
                        </Button>:
                        <Button  type="primary" 
                            onClick={()=>{
                            console.log(record.MAKH)
                            getDateUpdateUser(record.MAKH);
                            
                            }}>
                                Sửa
                        </Button>
                }

                </div>
            )
          },
          

    ];
    


    return(
        <div className="wrapperUser">          
            <div className="top">
                {props.MCN==='full' ?
                <Button ghost type="primary" 
                    onClick={()=>notification["warning"]({
                        message: 'Thông báo',
                        description:
                        'Vui lòng chọn chi nhánh trước khi thêm khách hàng.',
                    })} >
                        Thêm khách hàng
                </Button>
                :
                <Button type="primary" onClick={()=>setvisibleShow(true)} >
                            Thêm khách hàng
                </Button>
                }

                </div>
                <Table 
                    dataSource={DataUser} 
                    columns={columnsUser}
                    className="tableUser"
                    loading={loadingTable}
                />
                <Drawer
                    title="Thêm khách hàng"
                    placement="right"
                    // closable={false}
                    onClose={()=>setvisibleShow(false)}
                    visible={visibleShow}
                    width={500}
                   
                    >
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            onFinish={onFinishAddUser}
                            autoComplete="off"
                            form={form}
                            initialValues={{DOANHSO:1}}
                        
                        >
                            <Form.Item
                                label="Họ Tên"
                                name="HOTEN"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input
                                    placeholder="Nhập họ tên"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Số điện thoại"
                                name="SODT"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input
                                    placeholder="Nhập số điện thoại"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Địa chỉ"
                                name="DIACHI"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input
                                    placeholder="Nhập địa chỉ"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Ngày sinh"
                                name="NGAYSINH"
                                rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                            >
                                <Input
                                    placeholder="Nhập ngày sinh mm/dd/yyyy"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Doanh số"
                                name="DOANHSO"
                                
                            >
                                <InputNumber
                                    placeholder="Doanh số ước lượng"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    min={0}
                                    style={{ width:"100%" }}
                                />
                            </Form.Item>
                            <Form.Item 
                                wrapperCol={{ offset: 8, span: 16 }}
                                style={{display:'flex' }}
                            >
                                <Button danger type="primary" htmlType="submit">
                                    Thêm
                                </Button>
                            </Form.Item>
                    </Form>
                </Drawer>
                {/* update */}
                <Drawer
                    title="Thêm khách hàng"
                    placement="right"
                    // closable={false}
                    onClose={()=>setvisibleUpdateUser(false)}
                    visible={visibleUpdateUser}
                    width={500}
                   
                    >
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            onFinish={onFinishUpdateUser}
                            autoComplete="off"
                            form={formupdate}
                            initialValues={{DOANHSO:1}}
                        >
                            <Form.Item
                                label="Mã khách hàng"
                                name="MAKH"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input
                                    placeholder="Nhập họ tên"
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item
                                label="Họ Tên"
                                name="HOTEN"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input
                                    placeholder="Nhập họ tên"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Số điện thoại"
                                name="SODT"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input
                                    placeholder="Nhập số điện thoại"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Địa chỉ"
                                name="DIACHI"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input
                                    placeholder="Nhập địa chỉ"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Ngày sinh"
                                name="NGAYSINH"
                                rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                            >
                                <Input
                                    placeholder="Nhập ngày sinh mm/dd/yyyy"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Doanh số"
                                name="DOANHSO"
                                
                            >
                                <InputNumber
                                    placeholder="Doanh số ước lượng"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    min={0}
                                    style={{ width:"100%" }}
                                />
                            </Form.Item>
                            <Form.Item 
                                wrapperCol={{ offset: 8, span: 16 }}
                                style={{display:'flex' }}
                            >
                                <Button danger type="primary" htmlType="submit">
                                    Cập nhật
                                </Button>
                            </Form.Item>
                    </Form>
                </Drawer>
        </div>
    )
}

export default Customers;