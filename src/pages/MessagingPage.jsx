import React, { useState, useEffect } from "react"
import { TextField, Drawer, Button } from "@material-ui/core";
import { useMessageStore } from "../utils/messageStore"
import MessageIcon from '@material-ui/icons/Message'
import HandIcon from "@material-ui/icons/PanTool"
import QueryStatsIcon from '@material-ui/icons/QueryBuilder';
import {useGlobalState, useGlobalMutation} from '../utils/stateContainer'
import {StatsModal} from "../components/statsModal"

const MessageItem = (message) => {

    console.log("isnide the message", message.message.fromRemote)
    return (
        <div className={message.message.fromRemote ? "toMessage" : "fromMessage"}>
            {message.message.messageText}
        </div>
    )
}

const MessagesList = () => {

    const messages = useMessageStore((state) => state.messages)
    console.log("messages", messages)
    return (
        <>
            {
                messages && messages.map((messageItem, i) => {
                    return (
                        <div>
                            <MessageItem message={messageItem} />
                        </div>

                    );
                })
            }
        </>
    )
}

export const MessagingPage = () => {

    const stateCtx = useGlobalState()
    const mutationCtx = useGlobalMutation()
    const [isOpen, setOpenState] = useState(false)
    const upendMessage = useMessageStore((state) => state.upendMessages)
    const rtmClientObj = useMessageStore((state) => state.rtmClient)
    const initRTM = useMessageStore((state) => state.initRTM)
    const joinMessageChannel = useMessageStore((state) => state.joinChannel)
    const [channelMessage, setChannelMessage] = useState("")
    const sendMessageFunction = useMessageStore((state) => state.sendChannelMessage)
    const channelInfo = useMessageStore((state) => state.channel)
    const channels = useMessageStore((state) => state.channels)
    const getOnlineUsers = useMessageStore((state) => state.getJoinedMembers)
    const [isModalOpen, setModalState] = useState(false)
    useEffect(async () => {
        initRTM()
    }, [])

    const onChange = (envt) => {
        setChannelMessage(envt.target.value)
        console.log("channel message", envt.target.value)
    }

    const closeModal = () =>  {
        setModalState(false)
    }


    const sendMessage = () => {
        sendMessageFunction(channelMessage, channelInfo)
        setChannelMessage("")

    }

    const changeUserRole = () => {
        stateCtx.agoraClient.setClientRole("host")
        mutationCtx.updateConfig({
            host: true,
            isRoleChange: true,
        })
    }


    useEffect(() => {


        console.log("###", stateCtx.agoraClient)

        if (channels && Object.keys(channels).length > 0) {
            console.log("channels useEffect", Object.keys(channels).length, channels)
            channels[channelInfo].channel.on("ChannelMessage", (...args) => {
                var current = +new Date();
                // this.emit(eventName, { channelName, args: args })
                console.log("channel Message", args)
                const messageObject = {
                    messageText: args[0].text,
                    messageType: args[0].messageType,
                    userId: args[1],
                    fromRemote: true,
                    timeStamp: current
                }
                upendMessage(messageObject)

            })
        }
    }, [channels])

    useEffect(() => {

        if (rtmClientObj) {
            console.log("inside the useEffect", rtmClientObj)
            rtmClientObj.on("ConnectionStateChanged", (evnt) => {
                console.log("inide the value", evnt);
                evnt === "CONNECTED" && joinMessageChannel()
            })
        }

    }, [rtmClientObj])


    return (

        <>
            {isOpen ? <Drawer open={isOpen} anchor={"right"} onClose={() => setOpenState(false)}>
                <div className="messageContainer">
                    <div className="messageTitle">Chat Messages</div>
                    <div className="messageZone">
                        <MessagesList />
                    </div>
                    <div className="messageTextContainer">
                        <TextField
                            className="messageText"
                            value={channelMessage}
                            onChange={onChange}
                        />
                        <Button onClick={sendMessage}>Send</Button>
                    </div>

                </div>
            </Drawer> : <div className="sideBarEmptyContainer">
                <div className="sideBarIconDiv">
                    <MessageIcon style={{ color: '#fff', cursor: 'pointer', margin: "5px" }} onClick={() => setOpenState(true)} />
                </div>
                {stateCtx.config.host === false && <div className="sideBarIconDiv">
                    <HandIcon style={{ color: '#fff', cursor: 'pointer' }} onClick={() => changeUserRole()} />
                </div>}
                <div className="sideBarIconDiv">
                    <QueryStatsIcon style={{ color: '#fff', cursor: 'pointer', margin: "5px" }} onClick={() => setModalState(true)}/> 
                </div>
            </div>}
            <StatsModal isOpen={isModalOpen} closeModal={closeModal}/>
        </>
    )
}