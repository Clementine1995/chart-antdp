import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Radio , DatePicker , Button , message , Result, List, Card, Select } from 'antd';

import { Chart, Geom, Axis, Tooltip } from "bizcharts";

import { getDay } from '../utils/utils'
import styles from './Welcome.less';
import { queryRegion, getDomains } from './region/service';

const { RangePicker } = DatePicker;

const { Option } = Select;

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
  const [chartRange, setchartRange] = useState(() => [getDay(-3), getDay(0)])
  const [listRange, setlistRange] = useState(() => [getDay(-3), getDay(0)])
  const [isLoad, setIsLoad] = useState(false)
  const [placeType, setPlaceType] = useState('1')

  const [listData, setListData] = useState([])
 

  function onRadioChange(e) {
    const selected = e.target.value
    if(chartAllData[selected] && chartAllData[selected].length) {
      setChartData(chartAllData[selected])
    }
  }

  useEffect(() => {
    const [startDt, endDt] = chartRange
    handleQuery({
      startDt,
      endDt
    }).then(res => {
      
      const { data } = res
      const formated = formatChart(data)

      setChartAllData(formated)
      setChartData(Object.values(formated)[0] || [])
    }).catch(error => {
      message.error(error)
    })
    listQuery()
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

  function listQuery () {
    const [startDt, endDt] = listRange
    getListData(startDt, endDt)
  }

  function getListData (startDt = getDay(-3), endDt = getDay(0)) {
    setIsLoad(true)
    getDomains({
      placeType,
      startDt,
      endDt
    }).then(res => {
      const { data } = res
      if (data && data.length) {
        setListData(data)
      } else {
        setListData([])
      }
    }).catch(error => {
      message.error(error)
    }).finally(() => {
      setIsLoad(false)
    })
  }

  function handleSelect(value) {
    setPlaceType(value)
  }
  function chartDateChg (dates, date) {
    setchartRange(date)    
  }

  function listDateChg (dates, date) {
    setlistRange(date)    
  }

  return (
    <PageHeaderWrapper>
      <div className={styles.pre}>
        <div className={styles.blockTitle}>
          可访问的可疑站点数量变化情况
        </div>
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
      <div className={styles.pre}>
        <div className={styles.blockTitle}>
          可访问的可疑站点名单
        </div>
        <div className={styles.regionListHeader} >
          <RangePicker onChange={listDateChg}/>
          <Select defaultValue="1" style={{ width: 120 }} onChange={handleSelect}>
            <Option value="1">北京</Option>
            <Option value="2">上海</Option>
            <Option value="3" >浙江</Option>
            <Option value="4">广东</Option>
          </Select>
          <Button type="primary" onClick={listQuery}>查询</Button>
        </div>
        <div className={styles.regionDomain} >
          <List
            size="small"
            grid={{ gutter: 8, xs: 2, sm: 4, md: 4, lg: 6, xl: 6, xxl: 8 }}
            loading={isLoad}
            bordered
            dataSource={listData}
            renderItem={item => (
              <List.Item>
                <Card>{item}</Card>
              </List.Item>
            )}
          />,
        </div>
      </div>
    </PageHeaderWrapper>
  )
};

