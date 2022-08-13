
import React , {useEffect} from "react"
import {makeStyles} from '@material-ui/core/styles'
import {Container} from '@material-ui/core'
import { useGlobalState, useGlobalMutation } from '../utils/stateContainer'
import {CardPage} from "../components/cardPage"

const useStyles = makeStyles(() => ({
    container: {
        height: '100%',
        width: '100%',
        minWidth: 800,
        minHeight: 600,
        boxSizing: 'content-box',
        display: 'flex',
        justifyContent: 'center'
    }
}))

export const JoinPage = () => {

    const stateCtx = useGlobalState()
    const mutationCtx = useGlobalMutation()
    const classes = useStyles()

    useEffect(() => {
        if (stateCtx.loading === true) {
            mutationCtx.stopLoading()
        }
    }, [stateCtx.loading, mutationCtx])

    return (
        <Container maxWidth="sm" className={classes.container}>
            <CardPage/>
        </Container>
    )
   
}