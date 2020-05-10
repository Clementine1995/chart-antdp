import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, DatePicker , Button , message, Input } from 'antd';
import Link from 'umi/link';

import { getDay } from '../utils/utils'
import styles from './Welcome.less';
import { getEvaluationValues } from './region/service';

const { RangePicker } = DatePicker;

const { Column } = Table;

const queryTableData = async params => {
  try {
    const result = await getEvaluationValues(params);
    return result;
  } catch (error) {
    message.error('获取数据失败');
    return []
  }
}

export default () => {
  const [tableRange, settableRange] = useState(() => [getDay(-3), getDay(0)])

  const [tableData, setTableData] = useState([])
  const [pageInfo, setpageInfo] = useState({ total: 0, current: 1 })
  const [loading, setLoading] = useState(false)

  const [tableParam, setTableParam] = useState({
    domain: ''
  })

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
      domain: tableParam.domain,
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

  function tableDateChg (dates, date) {
    settableRange(date)    
  }

  function tableInputChg (e) {
    setTableParam(pre => ({...pre, domain: e.target.value}))
  }

  return (
    <PageHeaderWrapper>
      <div className={`${styles.pre} ${styles.regionTable}`}>
        <div className={styles.regionTableHeader}>
          <div className={styles.blockTitle}>
            可疑站点可访问风险评估值
          </div>
          <div className={ styles.regionSearch }>
            <RangePicker onChange={tableDateChg}/>
            <div className={styles.regionTableInput}>
              域名：<Input placeholder="" onBlur={tableInputChg} />
            </div>
            <Button type="primary" onClick={handleTableQuery}>查询</Button>
          </div>
          
        </div>
        <Table dataSource={tableData} className={styles.regionTableMain} loading={loading} bordered pagination={paginationProps}>
          <Column title="domain" dataIndex="domain" key="domain" sorter={(a, b) => a.domain > b.domain}/>
          <Column title="北京" dataIndex="bjEvaluationValue" key="bjEvaluationValue" sorter={(a, b) => a.bjEvaluationValue - b.bjEvaluationValue}
            render={(text, record) => (
              <Link to={`/detail?type=1&domain=${record.domain}&startDt=${tableRange[0]}&endDt=${tableRange[1]}`}>{record.bjEvaluationValue}</Link>
            )} />
          <Column title="上海" dataIndex="shEvaluationValue" key="shEvaluationValue" sorter={(a, b) => a.shEvaluationValue - b.shEvaluationValue} 
            render={(text, record) => (
              <Link to={`/detail?type=2&domain=${record.domain}&startDt=${tableRange[0]}&endDt=${tableRange[1]}`}>{record.shEvaluationValue}</Link>
            )} />
          <Column title="浙江" dataIndex="zjEvaluationValue" key="zjEvaluationValue" sorter={(a, b) => a.zjEvaluationValue - b.zjEvaluationValue}
            render={(text, record) => (
              <Link to={`/detail?type=3&domain=${record.domain}&startDt=${tableRange[0]}&endDt=${tableRange[1]}`}>{record.zjEvaluationValue}</Link>
            )} />
          <Column title="广东" dataIndex="gdEvaluationValue" key="gdEvaluationValue" sorter={(a, b) => a.gdEvaluationValue - b.gdEvaluationValue} 
            render={(text, record) => (
              <Link to={`/detail?type=4&domain=${record.domain}&startDt=${tableRange[0]}&endDt=${tableRange[1]}`}>{record.gdEvaluationValue}</Link>
            )}/>
        </Table>
      </div>
    </PageHeaderWrapper>
  )
};