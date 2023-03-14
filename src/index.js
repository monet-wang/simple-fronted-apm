import worker from './lib/worker';
import { generateUniqueID } from './utils/tool';
import { registReporter } from './lib/request';
import { initClickHandler, initPV } from './lib/userVitals';
import { initFCP, initFP, initNavigationTiming } from './lib/webVitals';
import { initJsError, initPromiseError, initVueError } from './lib/exceptionVitals';
/**
 * @param url 上报的url
 * @param meta 自定义的上报信息
 * @param options { filterFn, vue, isInitDefault }
 */
export default function (url, meta, { isInitDefault = true, filterFn, vue }) {
    let uuid = localStorage.getItem('_tracker_uid');
    if (!uuid) {
        uuid = generateUniqueID();
        localStorage.setItem('_tracker_uid', uuid)
    }

    registReporter(url, {uuid, ...meta || {}});

    worker.start();

    if (isInitDefault) {
        initUserVital();
        initWebVital();
        initExceptionVitals();
    }

    return {
        initUserVital,
        initWebVital,
        initExceptionVitals
    };


    function initUserVital() {
        initClickHandler(filterFn);
        initPV();
    }

    function initWebVital() {
        initFCP();
        initFP();
        initNavigationTiming();
    }
    
    function initExceptionVitals() {
        initJsError();
        initPromiseError();
        if (!!vue) {
            initVueError(vue);
        }
    }
}