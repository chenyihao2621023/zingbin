let mh = 90
let lh
let lhv = 30
// let preLhv = lhv

function adjustAndScroll(evt) {
    // console.log('adjustAndScroll evt', evt)
    let el = evt.target
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
    // console.log('text h: ', el.style.height);
    if (lh !== el.style.height) {
        lh = el.style.height
        lhv = parseInt(lh.slice(0, -2))
        if (lhv <= mh) {
            // console.log('lh: ' + lh);
            // preLhv = lhv
            let resizeEvt = new CustomEvent('resize', {
                bubbles: 'false',
                cancelable: 'true'
            });
            el.dispatchEvent(resizeEvt)
        }
        // console.log('scroll top');
        el.scrollTop = el.scrollHeight - el.clientHeight
    }
}

const directive = {
    bind(el) {
        // console.log('adjustAndScroll', this)
        lh = el.style.height

        el.addEventListener('input', adjustAndScroll)
        el.addEventListener('change', adjustAndScroll)
    },
    unbind(el) {
        el.removeEventListener('input', adjustAndScroll)
        el.removeEventListener('change', adjustAndScroll)
    }
}

module.exports = directive
