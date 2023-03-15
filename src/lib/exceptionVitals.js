/**
 * 异常报错指标
 */
import worker from './worker';
import { initMetric, MetricsEnum } from './initMetrics';
import { parseStackFrames } from '../utils/stackParser';

 /**
  * JS和静态资源异常上报
  */
export const initJsError = () => {
    const handler = (event) => {
        // event.preventDefault();
        const target = event.target;
        const exception = {
            message: event.message,
            error: event.error || '',
            // 解析后的错误堆栈
            stackTrace: parseStackFrames(event.error),
            meta: {
                file: event.filename,
                col: event.colno,
                row: event.lineno,
                // 以下几个字段用于区分是否为静态资源异常
                url: target.src,
                html: target.outerHTML,
                type: target.tagName,
            }
        };
        worker.push({
            trackType: MetricsEnum.NE,
            ...exception,
            ...initMetric()
        }, true);
    };
    window.addEventListener('error', (event) => handler(event), true);
};

/**
 * 没有被catch到的promise异常
 */
export const initPromiseError = () => {
    const handler = (event) => {
        // event.preventDefault();
        const exception = {
            message: event.reason.message || event.reason,
            error: event.reason || '',
            // 解析后的错误堆栈
            stackTrace: parseStackFrames(event.reason),
        }
        worker.push({
            trackType: MetricsEnum.UJ,
            ...exception,
            ...initMetric()
        }, true);
    };
    window.addEventListener('unhandledrejection', (event) => handler(event), true);
};

/**
 * vue 框架的报错异常
 */
export const initVueError = ($vueInstance) => {
    // vue2中是Vue.config.errorHandler， vue3是app.config.errorHandler
    // 因此该函数只需要传入vue实例即可
    $vueInstance.config.errorHandler = (err, vm, info) => {
        const exception = {
            message: err.message,
            error: err || '',
            meta: {
                hook: info,
            },
        };
        worker.push({
            trackType: MetricsEnum.VUE,
            ...exception,
            ...initMetric()
        }, true);
        throw new Error(err);
    };
};
