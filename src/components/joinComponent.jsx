import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { useGlobalState, useGlobalMutation } from '../utils/stateContainer'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { useRouter } from '../utils/router'
import { Link } from 'react-router-dom'
import AgoraRTC from 'agora-rtc-sdk-ng'
import { useMessageStore } from '../utils/messageStore'

const CustomRadio = withStyles({
    root: {
        color: '#999999',
        '&$checked': {
            color: '#44A2FC'
        },
        '&:hover': {
            backgroundColor: 'inherit'
        }
    }
})(({ children, ...props }) => {
    return (
        <div className={`role-item ${props.checked ? 'active' : 'inactive'}`} onClick={(evt) => {
            props.onClick(props)
        }}>
            <div className={`icon-${props.value}`}></div>
            <div className={`radio-row ${props.value}`}>
                <div className="custom-radio">
                    <input
                        readOnly
                        type="radio"
                        value={props.value}
                        checked={props.checked}
                    />
                    <div className="checkmark"></div>
                </div>
                <Box
                    flex="1"
                    className={`role-name ${props.checked ? 'active' : 'inactive'}`}
                >
                    {props.value}
                </Box>
            </div>
        </div>
    )
})

const useStyles = makeStyles((theme) => ({
    fontStyle: {
        color: '#9ee2ff'
    },
    midItem: {
        marginTop: '1rem',
        marginBottom: '6rem'
    },
    item: {
        flex: 1,
        display: 'flex',
        alignItems: 'center'
    },
    coverLeft: {
        background: 'linear-gradient(to bottom, #307AFF, 50%, #46cdff)',
        alignItems: 'center',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    coverContent: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        color: '#fff'
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        display: 'flex',
        minWidth: 700,
        minHeight: 500,
        maxHeight: 500,
        borderRadius: '10px',
        boxShadow: '0px 6px 18px 0px rgba(0,0,0,0.2)'
    },
    input: {
        maxWidth: '250px',
        minWidth: '250px',
        alignSelf: 'center',
        margin: '10px'
    },
    grid: {
        // margin: '0 !important'
    },
    button: {
        lineHeight: '21px',
        color: 'rgba(255,255,255,1)',
        fontSize: '17px',
        textTransform: 'none',
        height: '44px',
        width: '260px',
        '&:hover': {
            backgroundColor: '#82C2FF'
        },
        margin: theme.spacing(1),
        marginTop: '33px',
        backgroundColor: '#44a2fc',
        borderRadius: '30px'
    },
    radio: {
        padding: '0',
        fontSize: '14px',
        // display: 'flex',
        alignItems: 'center',
        paddingRight: '5px'
    }
}))

export const JoinComponent = () => {
    const classes = useStyles()
    const updateChannelName = useMessageStore((state) => state.updateChannel)
    const updateRTMToken = useMessageStore((state) => state.setIdAndToken)
    const [rtmID, setRTMID] = useState("")
    const [rtmToken, setToken] = useState("")
    const routerCtx = useRouter()
    const stateCtx = useGlobalState()
    const mutationCtx = useGlobalMutation()

    const handleClick = () => {
        if (!stateCtx.config.channelName) {
            mutationCtx.toastError('You need enter the channel name')
            return
        }
        mutationCtx.startLoading()
        updateChannelName(stateCtx.config.channelName)
        updateRTMToken(rtmID, rtmToken)
        routerCtx.history.push({
            pathname: `/session/${stateCtx.config.channelName}`
        })
    }

    const handleChange = (evt) => {
        const { value, checked } = evt
        mutationCtx.updateConfig({
            host: value === 'host'
        })
    }

    return (
        <Box
            marginTop="40px"
            flex="1"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            flexDirection="column"
        >
            <div className="role-container">
                <CustomRadio
                    className={classes.radio}
                    value="host"
                    checked={stateCtx.config.host}
                    onClick={handleChange}
                ></CustomRadio>
                <CustomRadio
                    className={classes.radio}
                    value="audience"
                    checked={!stateCtx.config.host}
                    onClick={handleChange}
                ></CustomRadio>
            </div>
            <Box
                marginTop="92"
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
            >
                <FormControl className={clsx(classes.input, classes.grid)}>
                    {/* <InputLabel htmlFor="channelName">Enter a channel name</InputLabel> */}
                    <Input
                        id="channelName"
                        name="channelName"
                        value={stateCtx.config.channelName}
                        placeholder='Channel Name'

                        onChange={(evt) => {
                            const PATTERN = /^[a-zA-Z0-9!#$%&()+\-:;<=.>?@[\]^_{}|~,\s]{1,64}$/
                            const value = PATTERN.test(evt.target.value)
                            if (value && evt.target.value.length < 64) {
                                console.log("mutation", mutationCtx);
                                mutationCtx.updateConfig({ channelName: evt.target.value })
                            } else {
                                mutationCtx.updateConfig({ channelName: '' })
                            }
                        }}
                    />
                </FormControl>
                <FormControl className={clsx(classes.input, classes.grid)}>

                    {/* <InputLabel htmlFor="userID">Enter Messenger ID</InputLabel> */}
                    <Input
                        id="userID"
                        name="userID"
                        value={rtmID}
                        placeholder='Enter RTM Id'
                        onChange={(evt) => {
                            setRTMID(evt.target.value)
                        }}
                    />

                </FormControl>
                <FormControl className={clsx(classes.input, classes.grid)}>
                    {/* <InputLabel htmlFor="token">Enter Token</InputLabel> */}
                    <Input
                        id="token"
                        name="token"
                        value={rtmToken}
                        placeholder='Enter Token'
                        onChange={(evt) => {
                            setToken(evt.target.value)
                        }}
                    />
                </FormControl>
                <FormControl className={classes.grid}>
                    <Button
                        onClick={handleClick}
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        disabled={rtmToken === "" || rtmID === "" || stateCtx.config.channelName.length <= 0}
                    >
                        Start Session
                    </Button>
                </FormControl>
            </Box>
        </Box>
    )
}
