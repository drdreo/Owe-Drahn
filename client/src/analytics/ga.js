import {debug} from "../environment";
import * as ReactGA from "react-ga";


export function initGa(history) {
    ReactGA.initialize("UA-140380321-2", {debug});
    ReactGA.set({anonymizeIp: true});

    // Initialize google analytics page view tracking
    history.listen((location, action) => {
        ReactGA.set({page: location.pathname}); // Update the user's current page
        ReactGA.pageview(location.pathname); // Record a pageview for the given page
    });

}
