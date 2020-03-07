import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { message } from 'antd';

import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import { queryRegion } from '../service';

const cols = {
  month: {
    range: [0, 1]
  }
};

/**
 *  删除节点
 * @param selectedRows
 */

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

const Region1 = () => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    handleQuery().then(data => {
      setChartData(data)
    })
    
  }, [])

  return (<PageHeaderWrapper>
    <div>
      <Chart height={400} data={chartData} scale={cols} forceFit>
        <Legend />
        <Axis name="month" />
        <Axis
          name="temperature"
          label={{
            formatter: val => `${val}°C`
          }}
        />
        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />
        <Geom
          type="line"
          position="month*temperature"
          size={2}
          color="city"
          shape="smooth"
        />
        <Geom
          type="point"
          position="month*temperature"
          size={4}
          shape="circle"
          color="city"
          style={{
            stroke: "#fff",
            lineWidth: 1
          }}
        />
      </Chart>
    </div>
  </PageHeaderWrapper>)
} ;


export default Region1;
