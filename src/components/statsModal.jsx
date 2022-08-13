import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useGlobalState, useGlobalMutation } from '../utils/stateContainer'

export const StatsModal = ({ isOpen, closeModal }) => {


    const stateCtx = useGlobalState()
    const [rtcStats, setRTCStats] = useState(null)
    const [localAudioStats, setLocalAudioStats] = useState(null)
    const [localVideoStats, setLocalVideoStats] = useState(null)

    const onClose = () => {
        closeModal()
    }
    useEffect(() => {

        if (stateCtx.agoraClient && isOpen) {
            console.log("in here", stateCtx.agoraClient.mLocalAudioTrack.getStats())
            setRTCStats(stateCtx.agoraClient._client.getRTCStats())
            setLocalAudioStats(stateCtx.agoraClient.mLocalAudioTrack.getStats())
            setLocalVideoStats(stateCtx.agoraClient.mLocalVideoTrack.getStats())
        }
    }, [isOpen])
    return (

        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                style={{
                    overlay: {
                        backgroundColor: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyConent: "center",

                    },
                    content: {
                        background: '#fff',
                        overflow: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        borderRadius: '4px',
                        outline: 'none',
                        padding: '20px',
                        width: '50%',
                        backgroundColor: "#fff",
                        left: "300px",
                        maxHeight: "500px"
                        


                    }
                }}
                portalClassName="modalStyles"
            >
                {stateCtx.agoraClient && isOpen && <div>
                    <div>
                        <div className='tableHeader'>Call Stats</div>
                        <table>
                            <tr>
                                <th>Title</th>
                                <th>Stats</th>
                            </tr>
                            <tr>
                                <td>CallDuration</td>
                                <td>{rtcStats ? rtcStats.Duration : 0}</td>
                            </tr>
                            <tr>
                                <td>Local Send Bitrate</td>
                                <td>{localAudioStats ? localAudioStats.sendBitrate : 0}</td>
                            </tr>
                            <tr>
                                <td>Local Audio Send PackLoss </td>
                                <td>{localAudioStats ? localAudioStats.sendPacketsLost : 0}</td>
                            </tr>
                            <tr>
                                <td>Local Video Send PackLoss </td>
                                <td>{localVideoStats ? localVideoStats.sendPacketsLost : 0}</td>
                            </tr>
                            <tr>
                                <td>Local Video Send PackLoss </td>
                                <td>{localVideoStats ? localVideoStats.sendPacketsLost : 0}</td>
                            </tr>
                        </table>
                    </div>
                </div>}
            </Modal>
        </div>
    )
}
