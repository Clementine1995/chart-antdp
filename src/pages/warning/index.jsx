import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, DatePicker , Button , message , Select, InputNumber } from 'antd';

import { getDay } from '../../utils/utils'
import styles from './index.less';
import { getGradAalter } from '../region/service';

const { RangePicker } = DatePicker;

const { Option } = Select;

const { Column } = Table;


const queryTableData = async params => {
  try {
    const result = await getGradAalter(params);
    return result;
  } catch (error) {
    message.error('获取数据失败');
    return []
  }
}


export default () => {
  const [tableRange, settableRange] = useState(() => [getDay(-3), getDay(0)])

  const [tableParam, setTableParam] = useState({
    placeType: '1',
    alterNum: 0.8
  })

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

  useEffect(() => {
    tableQuery()
  }, [])



  function handleTableQuery () {
    tableQuery(1)
  }

  function tableQuery (page = 1) {
    const [startDt, endDt] = tableRange
    setLoading(true)
    queryTableData({
      startDt,
      endDt,
      placeType: tableParam.placeType,
      alterNum: tableParam.alterNum || 0,
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
  function handleSelect(value) {
    setTableParam(pre => ({...pre, placeType: value}))
  }

  function tableDateChg (dates, date) {
    settableRange(date)    
  }

  function tableInputChg (e) {
    setTableParam(pre => ({...pre, alterNum: e.target.value}))
  }

  function download () {
    const [startDt, endDt] = tableRange

    const { placeType, alterNum } = tableParam
    const url = `http://49.233.219.204:8801/myGradSystem/grad/download?startDt=${startDt}&endDt=${endDt}&placeType=${placeType}&alterNum=${alterNum}`
    window.open(url)
  }
  return (
    <PageHeaderWrapper>
      <div className={`${styles.pre} ${styles.regionTable}`}>
        <div className={styles.regionTableHeader}>
          <div className={styles.searchParam}>
            <RangePicker onChange={tableDateChg}/>
            <Select defaultValue="1" style={{ width: 120 }} onChange={handleSelect}>
              <Option value="1">北京</Option>
              <Option value="2">上海</Option>
              <Option value="3" >浙江</Option>
              <Option value="4">广东</Option>
            </Select>
            <div className={styles.searchInput}>
              评估值：<InputNumber placeholder="" type="number" defaultValue={tableParam.alterNum} min={0} max={1} step={0.1} onBlur={tableInputChg} />（介于0~1之间）
            </div>
          </div>
          
          <div className={styles.searchBtn}>
            <Button type="primary" onClick={handleTableQuery}>查询</Button>
            <Button type="primary" onClick={download}>下载</Button>
          </div>
          
        </div>
        <Table dataSource={tableData} className={styles.regionTableMain} loading={loading} bordered pagination={paginationProps}>
          <Column title="域名" dataIndex="domain" key="domain" />
          <Column title="探测时间" dataIndex="dt" key="dt" />
          <Column title="评估值" dataIndex="evaluation" key="evaluation" />
        </Table>
      </div>
    </PageHeaderWrapper>
  )
};

