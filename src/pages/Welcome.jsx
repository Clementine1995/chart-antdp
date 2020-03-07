import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Radio , DatePicker , Button , message , Result} from 'antd';


import { Chart, Geom, Axis, Tooltip } from "bizcharts";

import styles from './Welcome.less';
import { queryRegion, getEvaluationValues } from './region/service';

const { RangePicker } = DatePicker;

const { Column } = Table;

const cols = {
  nums: {
    min: 0
  }
};

const handleQuery = async params => {
  try {
    const result = await queryRegion(params);
    return result;
  } catch (error) {
    message.error('获取数据失败');
    return []
  }
};

const queryTableData = async params => {
  try {
    const result = await getEvaluationValues(params);
    return result;
  } catch (error) {
    message.error('获取数据失败');
    return []
  }
}

function formatChart (data) {
  if (data && data.length) {
    const temp = data.reduce((cur, pre) => {
      if (!cur[pre.placeType]) {
        cur[pre.placeType] = []
      }
      cur[pre.placeType].push({
        time: pre.dt,
        nums: Number(pre.nums)
      })
      return cur
     
    }, {})
    return temp
  } 
  return []
}

export default () => {
  const [chartAllData, setChartAllData] = useState({})
  const [chartData, setChartData] = useState({})
  const [chartRange, setchartRange] = useState([])
  const [tableRange, settableRange] = useState([])

  const [tableData, setTableData] = useState([])
  const [pageInfo, setpageInfo] = useState({ total: 0, current: 1 })
  const [loading, setLoading] = useState(false)

  const paginationProps = {
    current: pageInfo.current,
    defaultPageSize: 20,
    onChange : page => tablePageChange(page),
    total: pageInfo.total,
    showTotal: () => `共 ${pageInfo.total} 条`
  }

  function tablePageChange (page) {
    tableQuery(page)
  }

  function onRadioChange(e) {
    const selected = e.target.value
    if(chartAllData[selected] && chartAllData[selected].length) {
      setChartData(chartAllData[selected])
    }
  }

  useEffect(() => {
    handleQuery({
      startDt: '2020-02-12',
      endDt: '2020-02-24'
    }).then(res => {
      
      const { data } = res
      const formated = formatChart(data)

      setChartAllData(formated)
      setChartData(Object.values(formated)[0] || [])
    }).catch(error => {
      message.error(error)
    })
    
    tableQuery()
  }, [])

  function chartQuery () {
    const [startDt, endDt] = chartRange
    if (startDt && endDt) {
      handleQuery({
        startDt,
        endDt
      }).then(res => {
        const { data } = res
        const formated = formatChart(data)

        setChartAllData(formated)
        setChartData(Object.values(formated)[0] || [])
      })
    } else {
      message.info('请选择开始与结束日期');
    }
  }

  function handleTableQuery () {
    tableQuery(1)
  }
  function tableQuery (page = 1) {
    const [startDt, endDt] = tableRange
    setLoading(true)
    queryTableData({
      startDt,
      endDt,
      size: 20,
      current: page
    }).then(res => {
      console.log(res)
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

  function chartDateChg (dates, date) {
    setchartRange(date)    
  }

  function tableDateChg (dates, date) {
    settableRange(date)    
  }

  return (
    <PageHeaderWrapper>
      <div className={styles.pre}>
        
        <div className={styles.regionChartHeader} >
          <div>
            <RangePicker onChange={chartDateChg}/>
            <Button type="primary" onClick={chartQuery}>查询</Button>
          </div>
          
          <Radio.Group onChange={onRadioChange} defaultValue="1">
            <Radio.Button value="1">北京</Radio.Button>
            <Radio.Button value="2">上海</Radio.Button>
            <Radio.Button value="3">浙江</Radio.Button>
            <Radio.Button value="4">广东</Radio.Button>
          </Radio.Group>
        </div>
        <div className={styles.regionChartMain}>
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
      </div>
      <div className={`${styles.pre} ${styles.regionTable}`}>
        <div className={styles.regionTableHeader}>
          <RangePicker onChange={tableDateChg}/>
          <Button type="primary" onClick={handleTableQuery}>查询</Button>
        </div>
        <Table dataSource={tableData} className={styles.regionTableMain} loading={loading} bordered pagination={paginationProps}>
          <Column title="domain" dataIndex="domain" key="domain" sorter={(a, b) => a.domain > b.domain}/>
          <Column title="北京" dataIndex="bjEvaluationValue" key="bjEvaluationValue" sorter={(a, b) => a.bjEvaluationValue - b.bjEvaluationValue}/>
          <Column title="上海" dataIndex="shEvaluationValue" key="shEvaluationValue" sorter={(a, b) => a.shEvaluationValue - b.shEvaluationValue}/>
          <Column title="浙江" dataIndex="zjEvaluationValue" key="zjEvaluationValue" sorter={(a, b) => a.zjEvaluationValue - b.zjEvaluationValue}/>
          <Column title="广东" dataIndex="gdEvaluationValue" key="gdEvaluationValue" sorter={(a, b) => a.gdEvaluationValue - b.gdEvaluationValue}/>
          {/* <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <span>
                <a style={{ marginRight: 16 }}>Invite {record.lastName}</a>
                <a>详情</a>
              </span>
            )}/> */}
        </Table>
      </div>
    </PageHeaderWrapper>
  )
};
