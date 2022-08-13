import React, {useContext} from 'react'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'

export const RouterContext = React.createContext({})

export const RouterHook = ({children}) => (
    <Router>
        <Switch>
            <Route>
                {(routeProps) => (
                    <RouterContext.Provider value={routeProps}>
                        {children}
                    </RouterContext.Provider>
                )}
            </Route>
        </Switch>
    </Router>
)

export const useRouter = ()=> {
    return useContext(RouterContext)
}
