import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { message , Table, Result, Descriptions, Button } from 'antd';


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
    type: 'linear',
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

  function download() {
    // 下载接口地址
    const url = `http://49.233.219.204:8801/myGradSystem/grad/downloadFrom?startDt=${routeInfo.startDt}&endDt=${routeInfo.endDt}&placeType=${routeInfo.type}&domain=${routeInfo.domain}`
    window.open(url)
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
      <div className={styles.searchBtn}>
        <Button type="primary" onClick={download}>下载</Button>
      </div>
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
        <Column title="响应站点有效IP的DNS递归服务器比例" dataIndex="dnsNum" key="dnsNum" />
        <Column title="响应有效IP可连通的有效IP比例" dataIndex="ipNum" key="ipNum" />
        <Column title="可连通且80、443开放的有效IP比例" dataIndex="portNum" key="portNum" />
        <Column title="可响应站点内容的有效IP比例" dataIndex="tcpAbove" key="tcpAbove" />
      </Table>
    </div>
  </PageHeaderWrapper>)
} ;

function expandRender(record) {
  return (<Descriptions title="详细信息">
    <Descriptions.Item span={3} label="响应站点有效IP的DNS递归服务器">{ record.dnsIp || '--' }</Descriptions.Item>
    <Descriptions.Item span={3} label="响应有效IP可连通的有效IP">{ record.ips || '--' }</Descriptions.Item>
    <Descriptions.Item span={3} label="可连通且80、443开放的有效IP">{ record.portIps || '--' }</Descriptions.Item>
    <Descriptions.Item span={3} label="可响应站点内容的有效IP">{ record.tcpIps || '--' }</Descriptions.Item>
  </Descriptions>)
}


export default Region1;
