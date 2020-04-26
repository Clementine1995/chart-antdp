import request from '@/utils/request';

export async function queryRegion(params) {
  return request('http://49.233.219.204:8801/myGradSystem/grad/getIndexLineChart', {
    method: 'POST',
    data: { ...params },
  });
}

// http://106.54.192.199:8801/myGradSystem/grad/getEvaluationValues

export async function getEvaluationValues (params) {
  return request('http://49.233.219.204:8801/myGradSystem/grad/getEvaluationValues', {
    method: 'POST',
    data: { ...params },
  });
}


// http://106.54.192.199:8801/myGradSystem/grad/getDetailLineChart

export async function getDetailLineChart(params) {
  return request('http://49.233.219.204:8801/myGradSystem/grad/getDetailLineChart', {
    method: 'POST',
    data: { ...params },
  });
}


// http://106.54.192.199:8801/myGradSystem/grad/getDetailForm

export async function getDetailForm(params) {
  return request('http://49.233.219.204:8801/myGradSystem/grad/getDetailForm', {
    method: 'POST',
    data: { ...params },
  });
}

export async function getDomains(params) {
  return request('http://49.233.219.204:8801/myGradSystem/grad/getDomains', {
    method: 'POST',
    data: { ...params },
  });
}

export async function getDnsRelated(params) {
  return request('http://49.233.219.204:8801/myGradSystem/grad/getDnsRelated', {
    method: 'POST',
    data: { ...params },
  });
}

export async function getGradAalter(params) {
  return request('http://49.233.219.204:8801/myGradSystem/grad/alter', {
    method: 'POST',
    data: { ...params },
  });
}

