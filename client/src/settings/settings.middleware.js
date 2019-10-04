export const settingsMiddleware = store => next => action => {
    const prevSettings = store.getState().settings;
    next(action);
    const nextSettings = store.getState().settings;

    if (prevSettings !== prevSettings) {
        localStorage.setItem("settings", JSON.stringify(nextSettings));
    }
};
