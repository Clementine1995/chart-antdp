import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DatePicker, Button , Table , Input, Select } from 'antd';


import styles from './index.less';
import { getDnsRelated } from './service';
import { getDay } from '../../utils/utils'

const { Column } = Table

const { Option } = Select;

const Region1 = () => {

  const [tableParam, setTableParam] = useState({
    date: '',
    rank: '',
    placeType: '1'
  })

  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)

  const [pageInfo, setpageInfo] = useState({ total: 0, current: 1 })


  const paginationProps = {
    current: pageInfo.current,
    defaultPageSize: 10,
    onChange : page => tablePageChange(page),
    total: pageInfo.total,
    showTotal: () => `共 ${pageInfo.total} 条`
  }


  useEffect(() => {
    tableQuery(1, getDay(0))
  }, [])
  

  function tablePageChange (page) {
    tableQuery(page)
  }

  function handleTableQuery () {
    tableQuery(1)
  }

  function tableQuery (page = 1, startDtDef) {
    setLoading(true)
    getDnsRelated({
      startDt: startDtDef || tableParam.date,
      limit: tableParam.rank ? Number(tableParam.rank) : '',
      placeType: tableParam.placeType,
      size: 10,
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
    setTableParam(pre => ({...pre, date}))
  }
  function tableInputChg (e) {
    setTableParam(pre => ({...pre, rank: e.target.value}))
  }

  return <PageHeaderWrapper>
    <div className={styles.pre}>
      <div className={styles.regionChartHeader} >
        <DatePicker onChange={tableDateChg} />
        <div className={styles.regionTableInput}>
          前<Input placeholder="" type="number" onBlur={tableInputChg} />个
        </div>
        <Select defaultValue="1" style={{ width: 120 }} onChange={handleSelect}>
          <Option value="1">北京</Option>
          <Option value="2">上海</Option>
          <Option value="3" >浙江</Option>
          <Option value="4">广东</Option>
        </Select>
        <Button type="primary" onClick={handleTableQuery}>查询</Button>
      </div>
      <div className={styles.regionDomain} >
        <Table
          dataSource={tableData}
          loading={loading}
          bordered
          pagination={paginationProps}>
          <Column title="dns_ip" dataIndex="dnsIp" key="dnsIp" />
          <Column title="地区" dataIndex="dnsZone" key="dnsZone" />
          <Column title="运营商" dataIndex="dnsOperator" key="dnsOperator" />
          <Column title="解析个数" dataIndex="relatedNums" key="relatedNums" />
        </Table>
      </div>
    </div>
  </PageHeaderWrapper>
}

export default Region1;
