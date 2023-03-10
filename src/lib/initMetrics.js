import { randomCoding } from '../utils/tool';

export const MetricsEnum = {
    FP:  'first-paint',               // 首次非网页背景像素渲染
    FCP: 'first-contentful-paint',    // 首次内容渲染
    LCP: 'largest-contentful-paint',  // 最大内容绘制，页面内首次开始加载的时间点，到可视区域内最大的图像或者文本块完成渲染的相对时间
    FID: 'first-input-delay',         // 用户第一次与页面交互（例如点击按钮）直到浏览器对交互作出响应
    CLS: 'cumulative-layout-shift',   // 每当一个已渲染的可见元素的位置从一个可见位置变更到下一个可见位置时，就发生了布局偏移
    NT:  'navigation-timing',         // 关键时间点
    NE:  'normal-exception',          // js异常、静态资源加载
    UJ:  'unhandledrejection',        // promise异常
    VUE: 'vue',                       // vue 框架捕捉的异常
    PV:  'page-view',                 // PV
    CBR: 'click-behavior',            // 点击事件
    TS:  'time-on-system'             // 页面停留时长
}

export const initMetric = () => {
    return {
        _: randomCoding(9) ,// 增加随机数
        ts: new Date().getTime()
    }
}
