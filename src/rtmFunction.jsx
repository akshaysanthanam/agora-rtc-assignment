import EventEmitter from 'events'
import AgoraRTM from 'agora-rtm-sdk'
const appID = process.env.REACT_APP_AGORA_APP_ID

// export const initRTMClient = async (accountName, token) => {

//     console.log("rtm console", appID, accountName)
//     const client = await AgoraRTM.createInstance(appID)
//     client.login({ uid: accountName, token })
//     subscribeClientEvents(client)
//     return client
// }


export const subscribeClientEvents = (client) => {
    const myEmitter = new EventEmitter()
    const clientEvents = [
      'ConnectionStateChanged',
      'MessageFromPeer'
    ]
    clientEvents.forEach((eventName) => {
        console.log("client events triggered", client);
        client.on(eventName, (...args) => {
          console.log("client events triggered 2", client);

        console.log('emit ', eventName, ...args)
        // log event message
        myEmitter.emit(eventName, ...args)
      })
    })

  }

  export const joinChannel = async (client, name)  => {
    console.log('joinChannel', client)
    const channel = client.createChannel(name)
    this.channels[name] = {
      channel,
      joined: false // channel state
    }
    subscribeChannelEvents(name)
    return channel.join()
  }


  export const subscribeChannelEvents = (channelName, channels) => {
    const channelEvents = [
      'ChannelMessage',
      'MemberJoined',
      'MemberLeft'
    ]

    console.log("channels", channels)
    channelEvents.forEach((eventName) => {
      console.log("channels", channels[channelName])
      channels[channelName].channel.on(eventName, (...args) => {
        console.log('emit ', eventName, args)
        // this.emit(eventName, { channelName, args: args })
      })
    })
  }

