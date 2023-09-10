import Viewer from 'viewerjs';
import { nextTick, onMounted, watch } from 'vue';
import { Route } from 'vitepress';

const setViewer = (el: string = '.vp-doc img', option?: Viewer.Options) => {
    const defaultBaseOption: Viewer.Options = {
        navbar: false,
        title: false,
        toolbar: {
            zoomIn: 4,
            zoomOut: 4,
            reset: 4,
            oneToOne: 4
        }
    }
    document.querySelectorAll(el).forEach((item: Element) => {
        (item as HTMLElement).onclick = () => {
            const viewer = new Viewer(<HTMLElement>item, {
                ...defaultBaseOption,
                ...option,
                hide(e) {
                    viewer.destroy();
                }
            });
            viewer.show()
        }
    });
};

/**
 * set imageViewer
 *
 * @param route vue router instance
 * @param el The string corresponding to the CSS selector, the default is ".vp-doc img".
 * @param option viewerjs options
 */
const imageViewer = (route: Route, el?: string, option?: Viewer.Options) => {
    onMounted(() => {
        setViewer(el, option);
    })
    watch(() => route.path, () => nextTick(() => {
        setViewer(el, option);
    }));
}

export default imageViewer;
