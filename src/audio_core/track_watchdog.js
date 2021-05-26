export default function trackWatchdog(track) {
    const watch_for = {attributes: true};

    function setRate(list,observer) {
        let speed = parseFloat(track.getAttribute('speed'));
        let sync = parseFloat(track.getAttribute('sync'));
        for (const change of list) {
            if (change.attributeName === 'speed' ||
                change.attributeName === 'sync') {
                let rate = speed * sync;
                track.setAttribute('rate',rate);
            }
        }
    }
    const autorate = new MutationObserver(setRate);
    autorate.observe(track,watch_for);
}
