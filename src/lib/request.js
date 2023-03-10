import eventBus from './eventBus';


const sendHandler = (url, reqParam) => {
    // todo: 兼容
    // return typeof navigator.sendBeacon === 'function' ? beaconHandler(url, reqParam) : xmlHandler(url, reqParam);
    // 用请求gif的方式，get请求，ngnix自主收集，稳定
    // return xmlHandler(url, reqParam)
};

const beaconHandler = (url, reqParam) => {
    return navigator.sendBeacon(url, JSON.stringify(reqParam));
}

const imgHandler = (url, reqParam) => {
    let query = ''; //数据拼接字符串
    Object.keys(reqParam).forEach(key => {
        query += key + '=' + typeof reqParam[key] === 'object' ? JSON.stringify(reqParam[key]) : reqParam[key] + '&';
    })

    let img = new Image();
    img.src = `${url}?${query}`;
};

export const registRequest = (url, meta) => {
    eventBus.subscribe('doSend', (reqParam) => imgHandler(url, { ...reqParam, ...meta }));
}
