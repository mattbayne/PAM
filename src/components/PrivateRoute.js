import React, {useContext} from 'react';
import {Route, Navigate} from 'react-router-dom';
import {AuthContext} from "../firebase/Auth";

const PrivateRoute = ({component: RouteComponent, ...rest}) => {
    console.log('trying private route')
    const {currentUser} = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={(routeProps) => (!!currentUser ?
                <RouteComponent {...routeProps}/> :
                <Navigate replace to='/signin' />
            )
        }
        />
    );
}

export default PrivateRoute
