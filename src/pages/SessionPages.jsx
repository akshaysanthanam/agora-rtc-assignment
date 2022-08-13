import React , {useEffect, useState, useMemo} from "react"
import {useGlobalState, useGlobalMutation} from '../utils/stateContainer'
import { useRouter} from "../utils/router"
import RTCClient from '../rtcFunctions'
import StreamPlayer from '../components/stream-player'
import StreamMenu from '../components/menu-options'
import Tooltip from '@material-ui/core/Tooltip'
import { MessagingPage } from "./MessagingPage"


export const SessionPages = () => {
    const routerCtx = useRouter()
    const stateCtx = useGlobalState()
    const mutationCtx = useGlobalMutation()

    const onUserPublished = (remoteUser, mediaType) => {
        // remoteUser:
        // mediaType: "audio" | "video" | "all"
        console.debug(`onUserPublished ${remoteUser.uid}, mediaType= ${mediaType}`)
        localClient.subscribe(remoteUser, mediaType)
            .then(mRemoteTrack => {
                addRemoteUser(remoteUser)
            })
            .catch(err => {
                mutationCtx.toastError(
                    `stream ${remoteUser.getId()} subscribe failed: ${err}`
                )
            })

        if (mediaType === 'video' || mediaType === 'all') {

        }

        if (mediaType === 'audio' || mediaType === 'all') {

        }
    }

    const onUserUnPublished = (remoteUser, mediaType) => {
        // remoteUser:
        // mediaType: "audio" | "video" | "all"
        console.debug(`onUserUnPublished ${remoteUser.uid}`)
        removeRemoteUser(remoteUser)
        if (mediaType === 'video' || mediaType === 'all') {

        }

        if (mediaType === 'audio' || mediaType === 'all') {

        }
    }

    const localClient = useMemo(() => {
        console.log("useMemo called", stateCtx)
        const client = new RTCClient()
        client.createClient({codec: stateCtx.codec, mode: stateCtx.mode})
        client.on('connection-state-change', mutationCtx.connectionStateChanged)
        client.on('user-published', onUserPublished)
        client.on('user-unpublished', onUserUnPublished)
        setTimeout(() => {
            mutationCtx.setClient(client)
        }, 1)
        return client
    }, [stateCtx.codec, stateCtx.mode])

    const [muteVideo, setMuteVideo] = useState(stateCtx.muteVideo)
    const [muteAudio, setMuteAudio] = useState(stateCtx.muteAudio)
    const [isShareScreen, setShareScreen] = useState(false)
    const [VideoTrack, setVideoTrack] = useState(null)
    const [AudioTrack, setAudioTrack] = useState(null)
    const [remoteUsers, setRemoteUsers] = useState({})

    const addRemoteUser = (remoteUser) => {
        remoteUsers[remoteUser.uid] = remoteUser
        setRemoteUsers(remoteUsers)
    }

    const removeRemoteUser = (remoteUser) => {
        delete remoteUsers[remoteUser.uid]
        setRemoteUsers(remoteUsers)
    }

    const config = useMemo(() => {
        console.log("stateCtx", stateCtx)
        return {
            token: stateCtx.config.token,
            channel: stateCtx.config.channelName,
            microphoneId: stateCtx.config.microphoneId,
            cameraId: stateCtx.config.cameraId,
            uid: stateCtx.config.uid,
            host: stateCtx.config.host,
            isRoleChange: stateCtx.config.isRoleChange
        }
    }, [stateCtx, muteVideo, muteAudio])

    const history = routerCtx.history

    const params = new URLSearchParams(window.location.search)

    useEffect(() => {
        console.log("inside this", history, config.channel, params)
        const roleParams = params.get('role')
        if (!config.channel && roleParams !== 'audience') {
            history.push('/')
        }
    }, [config.channel, history, params])

    useEffect(() => {
        console.log("useEffect called")
        if (
            config.channel &&
            localClient._created &&
            (localClient._joined === false || config.isRoleChange === true) &&
            localClient._leave === false
        ) {
            console.log("inside the if", config)
            localClient.setClientRole(config.host ? 'host' : 'audience')
            localClient.join(config.channel, config.token)
                .then((uid) => {
                    config.uid = uid
                    console.log("config", config)
                    if (config.host) {
                        localClient.startLive(config.microphoneId, config.cameraId)
                            .then(() => {
                                setVideoTrack(localClient.mLocalVideoTrack)
                                setAudioTrack(localClient.mLocalAudioTrack)
                            })
                    }
                    mutationCtx.updateConfig({
                        isRoleChange: false,
                    })
                    mutationCtx.stopLoading()
                })
                .catch((err) => {
                    mutationCtx.toastError(`join error: ${err.info}`)
                    routerCtx.history.push('/')
                })
        }
        else {
            console.log("iniside the else", localClient, config)
        }
    }, [localClient, mutationCtx, config, routerCtx])

    const toggleVideo = () => {

        console.log("toggleVideo", toggleVideo, VideoTrack)
        const newValue = !muteVideo
        if (newValue) {
            localClient._client.unpublish(VideoTrack)
        } else {
            localClient._client.publish(VideoTrack)
        }
        setMuteVideo(newValue)
    }

    const toggleAudio = () => {
        const newValue = !muteAudio
        if (newValue) {
            localClient._client.unpublish(AudioTrack)
        } else {
            localClient._client.publish(AudioTrack)
        }
        setMuteAudio(newValue)
    }


    const doLeave = () => {
        localClient.leave().then(() => {
            localClient.stopLive()
            localClient.destroy()
            routerCtx.history.push('/')
        })
    }

    return (
        <div className="meeting">
            <div className="current-view">
                <div className="nav">
                    <div className="avatar-container">
                        <div className="default-avatar"></div>
                        <div className="avatar-text">Agora Test</div>
                        <div className="like"></div>
                    </div>
                    {/* <Tooltip title="quit">
                        <div
                            className="quit"
                            onClick={doLeave}
                        ></div>
                    </Tooltip> */}
                </div>
                <StreamPlayer
                    uid={config.uid}
                    isLocal={true}
                    videoTrack={VideoTrack}
                    audioTrack={AudioTrack}
                    muteAudio={muteAudio}
                    muteVideo={muteVideo}
                    showInfo={stateCtx.profile}
                    rtcClient={localClient._client}
                >
                    {config.host ? <StreamMenu
                        muteAudio={muteAudio}
                        muteVideo={muteVideo}
                        shareScreen={isShareScreen}
                        toggleVideo={toggleVideo}
                        toggleAudio={toggleAudio}
                    /> : null}
                </StreamPlayer>
                <div className="stream-container">
                    {Object.values(remoteUsers).map(remoteUser => {
                        return <StreamPlayer
                            key={`key-${remoteUser.uid}`}
                            uid={remoteUser.uid}
                            videoTrack={remoteUser.videoTrack}
                            audioTrack={remoteUser.audioTrack}
                            muteAudio={false}
                            muteVideo={false}
                            showInfo={false}
                            rtcClient={localClient._client}
                        />
                    })}
                </div>
            </div>
            <MessagingPage/>
        </div>
    )
}