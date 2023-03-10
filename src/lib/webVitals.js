/**
 * 性能指标
 */
import { onFCP } from 'web-vitals';
import worker from './worker';
import { afterLoad } from '../utils/tool';
import { initMetric, MetricsEnum } from './initMetrics';

/**
 * 首次绘制任何文本、图像、非空白canvas或者SVG的时间点
 */
export const initFCP = () => {
    afterLoad(() => {
        const handler = (entry) => {
            const { navigationType, rating, value, delta, entries } = entry;
            const metrics = {
                trackType: MetricsEnum.FCP,
                ...initMetric(),
                navigationType,
                rating,
                value,
                delta,
                entries: JSON.stringify(entries)
            }
            worker.push(metrics);
        };
        onFCP(handler);
    })
}

/**
 * 页面视觉首次发生变化的时间点
 * 比如设置的body背景色；FP不包含默认背景绘制，但包含非默认的背景绘制。
 */
export const initFP = () => {
    afterLoad(() => {
        const [entry] = performance.getEntriesByName(MetricsEnum.FP);
        const metrics = {
            trackType: MetricsEnum.FP,
            ...initMetric(MetricsEnum),
            ...entry
        }
        worker.push(metrics);
    })
};

/**
 * 实现W3C规范的中提出的一些关键时间点，如 DNS、TCP等。
 * 详见：https://www.w3.org/TR/navigation-timing-2/ Processing Model 章节
 */
// 初始化 NT 的获取以及返回
export const initNavigationTiming = () => {
    const resolveNavigationTiming = (entry) => {
        const {
            domainLookupStart,
            domainLookupEnd,
            connectStart,
            connectEnd,
            requestStart,
            responseStart,
            responseEnd,
            domContentLoadedEventEnd,
            loadEventStart,
            fetchStart,
        } = entry;
    
        return {
            // 关键时间点
            FP: responseEnd - fetchStart,
            DomReady: domContentLoadedEventEnd - fetchStart,
            Load: loadEventStart - fetchStart,
            // 关键时间段
            DNS: domainLookupEnd - domainLookupStart,
            TCP: connectEnd - connectStart,
            TTFB: responseStart - requestStart,
        };
    }
    const navigation = performance.getEntriesByType('navigation')[0];
    const navigationTiming = resolveNavigationTiming(navigation);
    const metrics = {
        trackType: MetricsEnum.NT,
        ...navigationTiming,
        ...initMetric()
    }
    worker.push(metrics);
}

// todo 以下未实现

const initLCP = () => {}; // 最大内容绘制，页面内首次开始加载的时间点，到可视区域内最大的图像或者文本块完成渲染的相对时间
const initFID = () => { afterLoad() }; // 用户第一次与页面交互（例如点击按钮）直到浏览器对交互作出响应
const initCLS = () => {}; // 每当一个已渲染的可见元素的位置从一个可见位置变更到下一个可见位置时，就发生了布局偏移
