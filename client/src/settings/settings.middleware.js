export const settingsMiddleware = store => next => action => {
    const prevSettings = store.getState().settings;
    next(action);
    const nextSettings = store.getState().settings;

    if (prevSettings !== nextSettings) {
        localStorage.setItem("settings", JSON.stringify(nextSettings));
    }
};
