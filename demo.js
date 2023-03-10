import Tracker from './src/index';

const whiteList = ['016aUVwqtp']

new Tracker('http://localhost:8999/tracker.gif', {}, {
    // isInitDefault: false,
    filterFn: (e) => {
        let trackBtn = e.target.attributes['_tracker_id'];
        if (!trackBtn || !whiteList.includes(trackBtn.value)) {
            return false;
        }
        return {
            tagName: e.target.tagName,
            wid: trackBtn.value
        }
    }
})