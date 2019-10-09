import * as ReactGA from "react-ga";
import { prod} from "../environment";

import {TOGGLE_FEED, TOGGLE_SOUND} from "../settings/settings.actions";

const TRACKED_ACTIONS = [TOGGLE_FEED, TOGGLE_SOUND];

// example
// ReactGA.event({
//     category: "Promotion",
//     action: "Displayed Promotional Widget",
//     label: "Homepage Thing",
//     nonInteraction: true
// });
const analyticsMiddleware = store => next => action => {
    if (prod && TRACKED_ACTIONS.includes(action.type)) {
        ReactGA.event({
            category: "Settings",
            action: "click",
            label: action.type
        });
    }
    return next(action);
};
export default analyticsMiddleware;
