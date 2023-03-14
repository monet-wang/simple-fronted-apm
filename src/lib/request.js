/**
 * 执行上报，采用获取gif模拟请求的策略
 */

import eventBus from './eventBus';

const imgHandler = (url, reqParam) => {
    let query = ''; //数据拼接字符串
    Object.keys(reqParam).forEach(key => {
        query += `${key}=${typeof reqParam[key] === 'object' ? JSON.stringify(reqParam[key]) : reqParam[key]}&`;
    })
    let img = new Image();
    img.onerror = function (error) {
        eventBus.publish('reporterComplete', { success: 0 });
    }
    img.onload = function() {
        eventBus.publish('reporterComplete', { success: 1 });
    }
    img.src = `${url}?${query}`;
};

export const registReporter = (url, meta) => {
    eventBus.subscribe('doSend', (reqParam) => imgHandler(url, { ...reqParam, ...meta }));
}

// const sendHandler = (url, reqParam) => {
//     // todo: 兼容
//     // return typeof navigator.sendBeacon === 'function' ? beaconHandler(url, reqParam) : xmlHandler(url, reqParam);
//     // 用请求gif的方式，get请求，ngnix自主收集，稳定
//     // return xmlHandler(url, reqParam)
// };

// const beaconHandler = (url, reqParam) => {
//     return navigator.sendBeacon(url, JSON.stringify(reqParam));
// }