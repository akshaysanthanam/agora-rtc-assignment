import create from 'zustand'
import AgoraRTM from 'agora-rtm-sdk'
import {subscribeClientEvents, subscribeChannelEvents} from "../rtmFunction"
import EventEmitter from 'events'



const appID = process.env.REACT_APP_AGORA_APP_ID
const params = new URLSearchParams(window.location.search)

const accountName = "test"
const token = "006d08d8223518c470fa7022f97bbd3c1e9IAC4S2FM0OcgG4nqZerIC3ffukWbxzevl1nzbpW9+0rj1wx+f9gAAAAAEAApn62E3fP2YgEA6APd8/Zi"

const messageDefault = {

    rtmClient: null,
    messages: [],
    channel: null,
    channels:[],
    onlineMembers: [],
    rtmID: null,
    token: null
}

export const useMessageStore = create((set, get) => ({
    ...messageDefault,
    updateChannel: (channel) => {
        set((state) => ({channel: channel}))

    },
    updateClientObject: (client) => {
        set((state) => ({rtmClient: client}))
    },
    initRTM: async () => {
        const client = await AgoraRTM.createInstance(appID)
        console.log("client events triggered 3", client);

        client.login({ uid: get().rtmID, token: get().token })
        subscribeClientEvents(client)
        set((state) => ({rtmClient: client}))
    },
    upendMessages: (message) => {
        const messageList = get().messages
        set((state) => {
            const Emessages = [...messageList]
            return {messages: [...messageList, message]}
        })
    },
    joinChannel: () => {
        const client = get().rtmClient
        const channelObj = client.createChannel(get().channel)
        set((state) => {
            const channelArray = [...get().channels]
            channelArray[get().channel] = {
                channel:channelObj,
                joined: false // channel state
              }
            return {channels: channelArray}
        })
        subscribeChannelEvents(get().channel, get().channels)
        channelObj.join()
    },
    sendChannelMessage: (text, channelName) => {
        if (get().channels[channelName] || get().channels[channelName] [channelName].joined){
            console.log("get message sent")
            const channelInfo = get().channels[channelName] 
            const current = new Date()
            channelInfo.channel.sendMessage({ text }).then(() => {
                const messageObject = {
                    messageText: text,
                    messageType: "TEXT",
                    userId: get().rtmID,
                    fromRemote: false,
                    timeStamp: current
                }
                get().upendMessages(messageObject)
            })        
        }

    },
    getJoinedMembers: async () => {
        const client = get().rtmClient
        const members  = await client.getMembers()
        return members
    },  
    setIdAndToken: async (id, token) => {
        set((state) => ({rtmID: id, token: token}))
    },
    updateClientRole: async () => {

    }
  }))