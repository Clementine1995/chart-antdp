import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DatePicker, message, Button , List, Card, Table , Input } from 'antd';


import styles from './index.less';
import { getDomains, getDnsRelated } from './service';
import { getDay } from '../../utils/utils'

const { RangePicker } = DatePicker
const { Column } = Table

const reflectMap = {
  '/regionbj': {
    type: 1,
    title: '北京'
  },
  '/regionsh': {
    type: 2,
    title: '上海'
  },
  '/regionzj': {
    type: 3,
    title: '浙江'
  },
  '/regiongd': {
    type: 4,
    title: '广东'
  }
}

const handleQuery = async params => {
  try {
    const result = await getDomains(params);
    return result;
  } catch (error) {
    message.error('获取数据失败');
    return []
  }
};

const Region1 = props => {
  const [chartRange, setchartRange] = useState(() => ['', ''])
  const [tableParam, setTableParam] = useState({
    date: '',
    rank: ''
  })
  const [isLoad, setIsLoad] = useState(false)
  const [listData, setListData] = useState([])
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

  const { pathname } = props.location

  useEffect(() => {
    // listQuery()
    tableQuery(1, getDay(0))
  }, [])
  

  function tablePageChange (page) {
    tableQuery(page)
  }


  function chartQuery () {
    const [startDt, endDt] = chartRange
    listQuery(startDt, endDt)
  }
  function handleTableQuery () {
    tableQuery(1)
  }

  function tableQuery (page = 1, startDtDef) {
    setLoading(true)
    getDnsRelated({
      startDt: startDtDef || tableParam.date,
      limit: tableParam.rank ? Number(tableParam.rank) : '',
      placeType: reflectMap[pathname].type,
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

  function listQuery (startDt = getDay(-3), endDt = getDay(0)) {
    setIsLoad(true)
    handleQuery({
      placeType: reflectMap[pathname].type,
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

  function chartDateChg (dates, date) {
    setchartRange(date)    
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
    <div className={styles.pre}>
      <div className={styles.regionChartHeader} >
        <RangePicker onChange={chartDateChg}/>
        <Button type="primary" onClick={chartQuery}>查询</Button>
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
}

export default Region1;
