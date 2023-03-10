import eventBus from './eventBus';

/**
 * 上报采取缓存机制，支持立即上报
 */
function worker () {
    let queue = JSON.parse(localStorage.getItem('_tracker_queue')) || [];
    return {
        push: function (reqParam, isImmediate) {
            if (isImmediate) {
                this.doSend(reqParam);
                // todo：消费失败后继续消费
            }
            queue.push(reqParam);
            localStorage.setItem('_tracker_queue', JSON.stringify(queue));
        },
        consume: function () {
            if (!queue.length) { return; }
            eventBus.publish('doSend', queue[0]);
            // todo: 消费成功的判断
            queue.shift();
            localStorage.setItem('_tracker_queue', JSON.stringify(queue));
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
        }
    }
}

export default new worker();