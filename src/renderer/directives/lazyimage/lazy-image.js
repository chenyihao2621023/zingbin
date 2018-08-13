
const directive = {
    bind(el) {
        el.addEventListener('load', evt => {
            let src = el.getAttribute('data-src')
            let error = el.getAttribute('data-error')
            if (!src) return

            let cache = new Image()
            // todo loading gif
            cache.onload = () => {
                el.setAttribute('src', src)
            }
            cache.onerror = () => {
                console.warn('lazy-image not found: ', src)
                if (error) {
                    el.setAttribute('src', error)
                } else {
                    el.setAttribute('src', './static/images/image-default.png')
                }
            }
            cache.src = src
        })
    }
}

export default directive
