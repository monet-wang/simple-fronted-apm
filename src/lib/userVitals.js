/**
 * 用户行为指标
 */
import worker from './worker';
import { initMetric, MetricsEnum } from './initMetrics';

/**
 * 上报用以收集pv
 */
export const initPV = () => {
    const handler = (e, trackState) => {
        const metrics = {
            trackType: MetricsEnum.PV,
            trackState: trackState,
            ...initMetric(),
        }
        // 一般来说， PV 可以立即上报
        worker.push(metrics, true);
    };

    // 单页应用的history模式，自定义监听事件replaceState和pushState，待实现
    window.addEventListener('replaceState', (e) => handler(e, 'replaceState'), true);
    window.addEventListener('pushState', (e) => handler(e, 'pushState'), true);
    // hash路由
    window.addEventListener('hashchange', (e) => handler(e, 'hashchange'), true);
    // 可选：浏览器回退、前进行为触发的监听，History.back()、History.forward()、History.go()
    window.addEventListener('popstate', (e) => handler(e, 'popstate'), true);
};

/**
 * 用户点击行为
 * @param filterFn 必填，自定义过滤需要上报的事件, return false 和 需要上报的信息
 *  // todo: 根据 tagName 进行全量捕获
 */
export const initClickHandler = (filterFn) => {
    if (!filterFn) { return; }
    const handler = (e) => {
        // if (!mountList.includes(e.target.tagName.toLowerCase())) { return; }
        let request = filterFn(e);
        if (typeof request === 'boolean' && !request ) { return ;}
        
        const metrics = {
            trackType: MetricsEnum.CBR,
            ...request || {},
            ...initMetric(),
        };
        worker.push(metrics);
    };
    window.addEventListener('click', (e) => handler(e), true);
};

// todo
const initTimeOnSystem = () => {
    // 思路：记录第一次进入页面的时间，记录一个操作栈
    // 监听replaceState、popstate等事件，将操作记录入栈，这一步可记录页面停留时长
    // 监听beforeunload，计算总的停留时间
};