import eventBus from './eventBus';
import { initMetric, MetricsEnum } from './initMetrics';

/**
 * 上报采取缓存机制，支持立即上报
 */
function worker () {
    let queue = JSON.parse(localStorage.getItem('_tracker_queue')) || [];
    return {
        push: function (reqParam, isImmediate) {
            const self = this;
            if (isImmediate) {
                self.doSend(reqParam);
            }
            queue.push(reqParam);
            self.updateLocal(queue);
        },
        consume: function () {
            if (!queue.length) { return; }
            const self = this;
            self.doSend(queue[0]);

            eventBus.subscribe('reporterComplete', res => {
                if (!res.success) {
                    self.push({ trackType: MetricsEnum.RE, ...initMetric() });
                    self.stopReport();
                    return;
                };

                queue.shift();
                self.updateLocal(queue);
            })
        },
        doSend: function (reqParam) {
            eventBus.publish('doSend', reqParam);
        },
        start: function () {
            const self = this;
            // 定时上报数据
            window._tracker_timer = setInterval(function () {
                self.consume();
            }, 1000)
        },
        stopReport: function () {
            // 上报出错时关闭
            clearInterval(window._tracker_timer);
        },
        updateLocal: function (queue) {
            localStorage.setItem('_tracker_queue', JSON.stringify(queue));
        }
    }
}

export default new worker();