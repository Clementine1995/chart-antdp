import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('http://49.233.219.204:8801/myGradSystem/grad/login', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
