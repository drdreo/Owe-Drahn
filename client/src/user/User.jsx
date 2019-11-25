import React, { Component } from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../auth/Firebase";

import UserHistory from "./UserHistory";

class User extends Component {


    render() {
        return <div className="page-container">

            <h2>History</h2>
            <UserHistory></UserHistory>
        </div>
    }
}

export default compose(
    withFirebase,
)(withRouter(User));