import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {useNavigate} from 'react-router-dom';
import {withFirebase} from '../Firebase';

const withAuthorization = condition => Component => {
  const WithAuthorization = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      props.firebase.onAuthUserListener(
          authUser => {
            if (!condition(authUser)) {
              navigate('/');
            }
          },
          () => navigate('/'),
      );
    }, [navigate, props.firebase]);

    return condition(props.authUser) ? <Component {...props} /> : null;
  };

  const mapStateToProps = state => ({
    authUser: state.auth.authUser,
  });

  return compose(
      withFirebase,
      connect(mapStateToProps),
  )(WithAuthorization);
};

export default withAuthorization;
