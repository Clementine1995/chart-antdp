import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { message , Table, Result, Descriptions } from 'antd';


import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";
import styles from './index.less';

import { getDetailLineChart, getDetailForm } from './service';

const { Column } = Table;


const queryChartData = async params => {
  try {
    const result = await getDetailLineChart(params);
    return result;
  } catch (error) {
    message.error('获取数据失败');
    return []
  }
};

const queryTableData = async params => {
  try {
    const result = await getDetailForm(params);
    return result;
  } catch (error) {
    message.error('获取数据失败');
    return []
  }
}

const reflectMap = {
  '1': '北京',
  '2': '上海',
  '3': '浙江',
  '4': '广东'
}

const cols = {
  evaluation: {
    min: 0,
    max: 1
  }
};

function formatChart (data) {
  if (data && data.length) {
    return data.filter(item => item.evaluation)
  } 
  return []
}

const Region1 = props => {
  const [chartData, setChartData] = useState([])
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)

  const [pageInfo, setpageInfo] = useState({ total: 0, current: 1 })

  const paginationProps = {
    current: pageInfo.current,
    defaultPageSize: 20,
    onChange : page => tablePageChange(page),
    total: pageInfo.total,
    showTotal: () => `共 ${pageInfo.total} 条`
  }

  const { query: routeInfo } = props.location


  function tablePageChange (page) {
    tableQuery(page)
  }

  useEffect(() => {
    queryChartData({
      startDt: routeInfo.startDt,
      endDt: routeInfo.endDt,
      domain: routeInfo.domain,
      placeType: routeInfo.type
    }).then(res => {
      const { data } = res
      const formated = formatChart(data)

      setChartData(formated)
    }).catch(error => {
      message.error(error)
    })
    
    tableQuery()
  }, [])

  function tableQuery (page = 1) {

    setLoading(true)
    queryTableData({
      startDt: routeInfo.startDt,
      endDt: routeInfo.endDt,
      domain: routeInfo.domain,
      placeType: routeInfo.type,
      size: 20,
      current: page
    }).then(res => {
      const { data } = res
      if (data.records && data.records.length) {
        setTableData(data.records.map((item, index) => {
          item.key = index
          return item
        }))
        setpageInfo({
          total: data.total,
          current: data.current
        })
      } else {
        setTableData([])
        setpageInfo({
          total: 0,
          current: 1
        })
      }
      
    }).finally(() => {
      setLoading(false)
    })
  }


  return (<PageHeaderWrapper title={`${routeInfo.domain}-${reflectMap[routeInfo.type]}(${routeInfo.startDt}/${routeInfo.endDt})`}>
    <div className={styles.pre}>
      {
        chartData.length ? <Chart height={400} data={chartData} scale={cols} forceFit>
          <Axis name="dt" />
          <Axis name="evaluation" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="line" position="dt*evaluation" size={2} />
          <Geom
            type="point"
            position="dt*evaluation"
            size={4}
            shape="circle"
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          />
        </Chart> : <Result
          status="info"
          title="暂无数据"
        />
      }
    </div>
    <div className={`${styles.pre} ${styles.detailTable}`}>
      <Table
        dataSource={tableData}
        className={styles.regionTableMain}
        loading={loading}
        expandable={{
          expandedRowRender: record => expandRender(record)
        }}
        bordered
        pagination={paginationProps}>
        <Column title="时间" dataIndex="dt" key="dt" />
        <Column title="dns" dataIndex="dnsNum" key="dnsNum" />
        <Column title="ip" dataIndex="ipNum" key="ipNum" />
        <Column title="port" dataIndex="portNum" key="portNum" />
        <Column title="tcp_above" dataIndex="tcpAbove" key="tcpAbove" />
      </Table>
    </div>
  </PageHeaderWrapper>)
} ;

function expandRender(record) {
  return (<Descriptions title="详细信息">
    <Descriptions.Item span={3} label="DnsIp">{ record.dnsIp || '--' }</Descriptions.Item>
    <Descriptions.Item span={3} label="Ips">{ record.ips || '--' }</Descriptions.Item>
    <Descriptions.Item span={3} label="PortIps">{ record.portIps || '--' }</Descriptions.Item>
    <Descriptions.Item span={3} label="TcpIps">{ record.tcpIps || '--' }</Descriptions.Item>
  </Descriptions>)
}


export default Region1;
