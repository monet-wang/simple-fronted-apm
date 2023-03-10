export const generateUniqueID = () => {
    return `tracker-${Date.now()}-${Math.floor(Math.random()*(99999-10000+1)+10000)}`;
}

export const randomCoding = (n) => {
	return Math.random().toString(36).slice(-10);
}

export const afterLoad = (callback) => {
    if (document.readyState === 'complete') {
        setTimeout(callback);
    } else {
        window.addEventListener('pageshow', (e) => callback && callback(e), { once: true, capture: true });
    }
}
