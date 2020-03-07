import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { message , Table, Result} from 'antd';

import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";
import styles from './index.less';

import { queryRegion } from './service';

const { Column } = Table;
const handleQuery = async () => {
  try {
    const data = await queryRegion({
      start: '',
      end: ''
    });
    return data;
  } catch (error) {
    message.error('获取数据失败');
    return []
  }
};

const cols = {
  nums: {
    min: 0
  }
};

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

  console.log(routeInfo)

  function tablePageChange (page) {
    tableQuery(page)
  }
  // useEffect(() => {
  //   handleQuery().then(data => {
  //     setChartData(data)
  //   })
    
  // }, [])

  function tableQuery (page = 1) {
    // setLoading(true)
    // queryTableData({
    //   size: 20,
    //   current: page
    // }).then(res => {
    //   console.log(res)
    //   const { data } = res
    //   if (data.records && data.records.length) {
    //     setTableData(data.records.map((item, index) => {
    //       item.key = index
    //       return item
    //     }))
    //     setpageInfo({
    //       total: data.total,
    //       current: data.current
    //     })
    //   } else {
    //     setTableData([])
    //     setpageInfo({
    //       total: 0,
    //       current: 1
    //     })
    //   }
      
    // }).finally(() => {
    //   setLoading(false)
    // })
  }


  return (<PageHeaderWrapper title="Title">
    <div className={styles.pre}>
      {
        chartData.length ? <Chart height={400} data={chartData} scale={cols} forceFit>
          <Axis name="time" />
          <Axis name="nums" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="line" position="time*nums" size={2} />
          <Geom
            type="point"
            position="time*nums"
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
    <div className={`${styles.pre} ${styles.regionTable}`}>
      <Table dataSource={tableData} className={styles.regionTableMain} loading={loading} bordered pagination={paginationProps}>
        <Column title="时间" dataIndex="domain" key="domain" sorter={(a, b) => a.domain > b.domain}/>
        <Column title="dns" dataIndex="bjEvaluationValue" key="bjEvaluationValue" sorter={(a, b) => a.bjEvaluationValue - b.bjEvaluationValue} />
        <Column title="ip" dataIndex="shEvaluationValue" key="shEvaluationValue" sorter={(a, b) => a.shEvaluationValue - b.shEvaluationValue} />
        <Column title="port" dataIndex="zjEvaluationValue" key="zjEvaluationValue" sorter={(a, b) => a.zjEvaluationValue - b.zjEvaluationValue} />
        <Column title="tcp_above" dataIndex="gdEvaluationValue" key="gdEvaluationValue" sorter={(a, b) => a.gdEvaluationValue - b.gdEvaluationValue} />
      </Table>
    </div>
  </PageHeaderWrapper>)
} ;


export default Region1;
