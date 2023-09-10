import Viewer from 'viewerjs';
import { Route } from 'vitepress';

declare const imageViewer: (route: Route, el?: string, option?: Viewer.Options) => void;
export default imageViewer;
