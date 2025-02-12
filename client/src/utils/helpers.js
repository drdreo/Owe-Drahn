import {useNavigate, useParams} from "react-router-dom";
import React from "react";

export const debounce = (func, delay) => {
    let inDebounce;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
};

export const withNavigation = (Component) => {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate}/>;
    };
};

export const withRouter = (Component) => {
    return props => {
        const params = useParams();
        return <Component {...props} params={params} />;
    };
};