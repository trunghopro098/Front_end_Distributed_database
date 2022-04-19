import React, { useEffect,useState } from 'react';
// import {Table } from 'antd';
import { Line } from '@ant-design/plots';
import * as FetchAPI from '../../util/fetchAPI';
import moment from 'moment';
import {getPrice} from '../../util/getPrice';
function WareHouse(props){
    const [data, setdata] = useState([]);
    const [showChart, setshowChart] = useState(false)

    useEffect(() => {
        getStaticall()
    },[props.MCN])
    const getStaticall = async()=>{
        const a = {MCN:props.MCN}
        const arr = [];
        const res = await FetchAPI.postDataAPI('/bill/getStatical',a);
        // console.log(res.msg.recordset)
        const data =  res.msg.recordset;  
        data.map((item)=>{
            const NGAYTAO = ` ${item.MONTH}-${item.YEAR}`;
            const TONG = item.TONG;
            arr.push({"NGAYTAO":NGAYTAO, "TONG":TONG})
        })
        setdata(arr)
        console.log(arr)
        // setdata(res.msg.recordset)
        setshowChart(true)
    }

    const config = {
        data,
        padding: 'auto',
        xField: 'NGAYTAO',
        yField: 'TONG',
        xAxis: {
          // type: 'timeCat',
          tickCount: 5,
          label:{
            formatter:(text)=>(
                    // moment(text).format('Do MMMM YYYY')
                    "tháng"+text
            )
          },
          
        },
        yAxis: {
            label:{
                formatter:(text)=>(
                    getPrice(text)+" đ"
                )
            }
        },
        tooltip:{
            fields: ['NGAYTAO', 'TONG'],
            // showTitle:false,
            title:"Doanh thu",
            formatter: (datum) => (
                { name:"Tổng doanh thu", value: getPrice(datum.TONG) + 'đ' }
            ),
        }
      };
    return(
        <div style={{ padding:10 }}>
            <h3>Thống kê doanh thu</h3>
            {showChart && <Line {...config}/>}

        </div>
    )
}

export default WareHouse;