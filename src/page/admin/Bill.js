import React ,{useEffect,useState} from 'react';
import { Select,Table } from 'antd';
import {getPrice} from '../../util/getPrice';
import { Drawer, Button, Form, Input ,InputNumber,message, notification} from 'antd';
import {PlusCircleOutlined} from '@ant-design/icons'
import * as FetchAPI from '../../util/fetchAPI';
import moment from 'moment'
const { Option } = Select;

function Bill(props){
    const [formadd] = Form.useForm();
    const [formaddBillDetail] = Form.useForm();
    const [visibleAddBill, setvisibleAddBill] = useState(false);
    const [visibleAddBillDetail, setvisibleAddBilDetail] = useState(false);
    const [dataSourceBill, setdataSourceBill] = useState([]);
    const [loadingTable, setloadingTable] = useState(false)
    const [loadingTable2, setloadingTable2] = useState(false)
    const [SelectCode, setSelectCode] = useState([]);
    const [showmodalContent, setshowmodalContent] = useState(false);
    const [dataproduct, setdataproduct] = useState([]);
    const [arritemBill, setarritemBill] = useState([]);
    const [totalBill, settotalBill] = useState(0);
    
    const onFinishAddBill = async()=>{
        let obj = {MCN:props.MCN,...formadd.getFieldValue(), arritemBill}
        console.log(obj)
        const res = await FetchAPI.postDataAPI("/bill/addBill",obj);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Thêm hóa đơn thành công !!!");
                formadd.setFieldsValue({MAKH:null,MANV:null,MAKHO:null, TRIGIA:null});
                formaddBillDetail.setFieldsValue({MASP:null, SL:0 })
                settotalBill(0);
                setvisibleAddBilDetail(false);
                setvisibleAddBill(false);
                
            }else{
                message.error("Có lỗi rồi");
                 setvisibleAddBill(false);
            }
        }
    }
    useEffect(()=>{
        setloadingTable(true);
        formadd.setFieldsValue({MAKH:null,MANV:null,MAKHO:null, TRIGIA:null});
        getBill();
        getCode();
        getProduct();

    },[props.MCN])

    const getBill = async()=>{
        const res = await FetchAPI.postDataAPI("/bill/getBill",{"MCN":props.MCN});
        // console.log(res)
        setdataSourceBill(res.msg.recordsets[0]);
        setloadingTable(false);
    }


    const getCode = async()=>{
        const res = await FetchAPI.postDataAPI("/bill/getCode",{"MCN":props.MCN});
        // console.log(res.msg.recordsets)
        setSelectCode(res.msg.recordsets)
        setshowmodalContent(true);
        
    }
    const getProduct = async()=>{
        const res = await FetchAPI.postDataAPI("/bill/getProduct",{"MCN":props.MCN});
        console.log(res.msg.recordsets[0]);
        setdataproduct(res.msg.recordsets[0])
        
    }
    const DeleteItem = (ID)=>{
        setloadingTable2(true);
        const data  = arritemBill;
        const index = data.findIndex(x=>x.MASP === ID);
        if(index!==-1){
            data.splice(index,1);
            console.log(data);
            setarritemBill(data);
            let s=0;
            data.map((e,index)=>{s+=(e.SL*e.GIA);if(index===data.length-1){settotalBill(s)}});
        }else{
            setloadingTable2(false);
        }
       
       
    }
      
      const columnsBill = [
        {
          title: 'Mã hóa đơn',
          dataIndex: 'SOHD',
          key: 'SOHD',
          render: (text,record) =>(
              <div>
                  <span>{text}</span>
              </div>
          )
        },
        {
          title: 'Ngày tạo',
          dataIndex: 'NGHD',
          key: 'NGHD',
          render: (text,record)=>(
              <span>{moment(text).format('Do MMMM YYYY, H:mm:ss')}</span>
          )
        },
        {
          title: 'Tên khách hàng',
          dataIndex: 'HOTEN_KH',
          key: 'HOTEN_KH',
        },
        {
            title: 'Họ tên nhân viên',
            dataIndex: 'HOTEN_NV',
            key: 'HOTEN_NV',
        },
        {
            title: 'Mã kho hàng',
            dataIndex: 'MAKHO',
            key: 'MAKHO',
        },
        {
            title: 'Giá trị',
            dataIndex: 'TRIGIA',
            key: 'TRIGIA',
            render: (text,record)=>(
                <span>{`${getPrice(text)} đ`}</span>
            )
        },
    ];
    const SelectCodeAddbill = (SelectCode)=>{
        return(
        <Select placeholder='Chọn nhân viên'>
            {SelectCode[0].map((item)=>(
                <Option key={item.MNV} value={item.MNV}>{item.HOTEN} ( {item.MNV} )</Option>
            ))}            
        </Select>
        )
    }
    const SelectCodeCustommer = (SelectCode)=>{
        return(
            <Select placeholder='Chọn khách hàng'>
                {SelectCode[1].map((item)=>(
                    <Option key={item.MKH} value={item.MKH}>{item.HOTENKG} ( {item.MKH} )</Option>
                ))}            
            </Select>
            )
    }

    const SelectCodeKho = (SelectCode)=>{
        return(
            <Select placeholder='Chọn kho hàng'>
                {SelectCode[2].map((item)=>(
                    <Option key={item.MAKHO} value={item.MAKHO}>{item.DIACHI} ( {item.MAKHO} )</Option>
                ))}            
            </Select>
            )
    }
    const SelectProduct = (SelectCode)=>{
        return(
            <Select placeholder='Chọn sản phẩm'>
                {SelectCode.map((item)=>(
                    <Option key={item.MASP} value={item.MASP}>{item.TENSP} ({item.NUOCSX})</Option>
                ))}            
            </Select>
            )
    }
    const addItemBill = ()=>{
        setloadingTable2(true);
        let valu = formaddBillDetail.getFieldValue();
        let arr = arritemBill;
        let data = dataproduct;        
        if(arr.length == 0){
            const b = data.find((a)=>a.MASP === valu.MASP); 
            const SL = valu.SL; 
            b.SL = SL;
            arr.push(b);
        }else{
            const checkitem = arr.some((item)=>item.MASP === valu.MASP);
            if(checkitem){
                const add = arr.findIndex((x)=> x.MASP === valu.MASP);
                arr[add].SL += valu.SL;
            }else{
                const b = data.find((a)=>a.MASP === valu.MASP); 
                const SL = valu.SL; 
                b.SL = SL;
                arr.push(b);;
            }
        }
        
        setarritemBill(arr);
        let s=0;
        arr.map((e,index)=>{s+=(e.SL*e.GIA);if(index===arr.length-1){settotalBill(s)}});
        setloadingTable2(false);
       
        formaddBillDetail.setFieldsValue({MASP:null, SL:1 })
    }

    const columnsBillDetaij = [
        {
          title: 'Sản phẩm',
          dataIndex: 'TENSP',
          key: 'TENSP',
          render: (text,record) =>(
              <div>
                  <span>{text}</span>
              </div>
          )
        },
        {
          title: 'Đơn giá',
          dataIndex: 'GIA',
          key: 'GIA',
          render: (text,record)=>(
              <span>{text}</span>
          )
        },
        {
          title: 'Số lượng',
          dataIndex: 'SL',
          key: 'SL',
        },
        {
            title: 'Thành tiền',
            dataIndex: 'GIA',
            key: 'GIA',
            render: (text,record)=>(
                <span>{`${getPrice(record.SL*record.GIA)} đ`}</span>
            )
        },
        // {
        //     title: 'Xóa sản phẩm',
        //     // dataIndex: 'action',
        //     key: 'action',
        //     render: (text,record)=>(
        //         <Button  type="primary" 
        //         onClick={()=>{
        //             console.log(record.MASP)
        //             DeleteItem(record.MASP);
                
        //         }}>
        //             Xóa
        //     </Button>
        //     )
        // },

    ];

    return(
        <div className="wrapperBill">
            <div className="top">
                {props.MCN === 'full'?
                <Button ghost type="primary" danger
                 onClick={()=>notification["warning"]({
                    message: 'Thông báo',
                    description:
                    'Vui lòng chọn chi nhánh khi thêm hóa đơn.',
                    })
                }>
                    <PlusCircleOutlined />
                        Thêm hóa đơn
                </Button>:
                <Button type="primary" danger onClick={()=>setvisibleAddBilDetail(true)}>
                    <PlusCircleOutlined />
                    Thêm hóa đơn
                </Button>
                }

            </div>
            <Table 
                dataSource={dataSourceBill} 
                columns={columnsBill}
                className="tableBill"
                loading={loadingTable}
            />
            {showmodalContent &&
            <Drawer 
                title="Thu ngân"
                placement="right" 
                onClose={()=>setvisibleAddBill(false)} 
                visible={visibleAddBill}
                width={500}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinishAddBill}
                    autoComplete="off"
                    form={formadd}
                >
                    <Form.Item
                        label="Nhân viên"
                        name="MANV"
                        rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                    >
                            {SelectCodeAddbill(SelectCode)}
                    </Form.Item>

                    <Form.Item
                        label="Mã khách hàng"
                        name="MAKH"
                        rules={[{ required: true, message: 'Vui lòng chọn mã khách hàng' }]}
                    >
                        {SelectCodeCustommer(SelectCode)}
                    </Form.Item>
                    <Form.Item
                        label="Mã kho hàng"
                        name="MAKHO"
                        rules={[{ required: true, message: 'Vui chọn chi nhánh' }]}
                    >
                      {SelectCodeKho(SelectCode)}
                    </Form.Item>
                    {/* <Form.Item
                        label="Mã hóa đơn"
                        name="SOHD"
                        rules={[{ required: true, message: 'Vui lòng nhập mã hóa đơn!' }]}
                    >
                        <Input
                            placeholder="Nhập mã hóa đơn"
                        />
                    </Form.Item> */}

                    <Form.Item
                        label="Đơn giá"
                        name="TRIGIA"
                        rules={[{ required: true, message: 'Vui lòng nhập đơn giá!' }]}
                    >
                        <InputNumber
                            placeholder="Đơn giá"
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
            }
            {/* ADD BILL DETAIL */}
            <Drawer 
                title="Thêm hóa đơn"
                placement="left" 
                onClose={()=>setvisibleAddBilDetail(false)} 
                visible={visibleAddBillDetail}
                width={1000}
            >
                <div className="addBillDetail">
                    <div className="tableBillDetail">
                        <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        onFinish={addItemBill}
                        autoComplete="off"
                        form={formaddBillDetail}
                        style={{ width: '90%' }}
                        >
                    
                            <Form.Item
                                label="Chọn sản phẩm"
                                name="MASP"
                                rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
                            >
                                {SelectProduct(dataproduct)}
                            </Form.Item>
                            <Form.Item
                                label="Số lượng"
                                name="SL"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                            >
                                <InputNumber
                                    placeholder="Số lượng"
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
                                    Thêm vào hóa đơn
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className='addtableBill'>
                    {!loadingTable2 &&
                    <Table 
                        dataSource={arritemBill} 
                        columns={columnsBillDetaij}
                        className="tableBillDetaill"
                        loading={loadingTable2}
                    />
                    }
                    <div style={{ marginTop:20,marginLeft:10 }}>
                        <Button danger  type="primary" 
                        onClick={()=>{
                            if(arritemBill.length === 0){
                                notification["warning"]({
                                    message: 'Thông báo',
                                    description:
                                    'Vui lòng chọn sản phẩm trước khi thanh toán.',
                                    })
                            }else{
                                formadd.setFieldsValue({MAKH:null,MANV:null,MAKHO:null, TRIGIA:totalBill});
                                setvisibleAddBill(true)
                            }
                            }}>
                            Thanh toán
                        </Button>
                        <h3 style={{ display:'inline', marginLeft: 20 }}>Tổng :</h3>
                        <span style={{ marginLeft:10,color:'red' }}>{getPrice(totalBill) + " đ"}</span>

                    </div>
                    </div>
                  

                </div>
            </Drawer>
        </div>
    )
}

export default Bill;