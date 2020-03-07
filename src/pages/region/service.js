import request from '@/utils/request';

export async function queryRegion(params) {
  return request('http://106.54.192.199:8801/myGradSystem/grad/getIndexLineChart', {
    method: 'POST',
    data: { ...params },
  });
}

// http://106.54.192.199:8801/myGradSystem/grad/getEvaluationValues

export async function getEvaluationValues (params) {
  return request('http://106.54.192.199:8801/myGradSystem/grad/getEvaluationValues', {
    method: 'POST',
    data: { ...params },
  });
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}


// http://106.54.192.199:8801/myGradSystem/grad/getIndexLineChart
// url: "http://127.0.0.1:8800/myGradSystem/grad/getIndexLineChart",
//        contentType: 'application/json;charset=UTF-8',
//        data: JSON.stringify({
//         startDt: dateStart,
//         endDt: dateEnd // 传过去的值
//        }),
