import { useRef, useEffect, useState } from '../../../libraries'
import { connect } from 'react-redux';

const RemoteParticipantTrack = ({ RoomReducer, Load, muteHandler, signal }) => {
  const remoteMedia = useRef(null);
  const [, setMute] = useState(false);

  useEffect(() => {
    if (RoomReducer) {
      const { room } = RoomReducer;

      room.participants.forEach(participant => participantConnected(participant))
      // room.on('participantReconnecting', remoteParticipant => {
      //   console.log(`${remoteParticipant.identity} is reconnecting the signaling connection to the Room!`);
      //   /* Update the RemoteParticipant UI here */
      // });
      // room.on('participantReconnected', remoteParticipant => {
      //   console.log(`${remoteParticipant.identity} has reconnected the signaling connection to the Room!`);
      //   /* Update the RemoteParticipant UI here */
      // });
      // remoteParticipant.on('reconnecting', () => {
      //   assert.equal(remoteParticipant.state, 'reconnecting');
      //   console.log(`${remoteParticipant.identity} is reconnecting the signaling connection to the Room!`);
      //   /* Update the RemoteParticipant UI here */
      // });
      room.on('participantConnected', participant => participantConnected(participant))
      room.on('trackPublished', participant => trackPublished(participant));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Load]);

  const trackPublished = (publication) => {
    publication.on('subscribed', subscribed);
    publication.on('unsubscribed', unsubscribed);
    publication.on('subscriptionFailed', subscriptionFailed);
  }

  const subscribed = (track) => {
    console.log('Subscribed to RemoteTrack:', track.sid);
    //Code for starting track rendering goes here.
  }

  const unsubscribed = (track) => {
    console.log('Unsubscribed to RemoteTrack:', track.sid);
    //Code for stopping track rendering goes here.
  }

  const subscriptionFailed = (error, publication) => {
    console.log(`Failed to subscribe to RemoteTrack ${publication.trackSid}:`, error);
    //Code for managing subscribe errors goes here.
  }

  const handleReconect = (error) => {
    if (error.code === 53001) {
      console.log('signal low', error.message);
    } else if (error.code === 53405) {
      console.log('signal lost', error.message);
    }
  }

  const participantConnected = (participant) => {
    remoteMedia.current.innerHTML = '';
    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed) {
        remoteMedia.current.appendChild(publication.track.attach());
      }
    });

    participant.on('trackSubscribed', track => {
      if (remoteMedia.current && remoteMedia.current.children && remoteMedia.current.children.length > 0) {
        if(remoteMedia.current.children[1] !== undefined){
          remoteMedia.current.removeChild(remoteMedia.current.children[1]);
        }
      }

      remoteMedia.current.appendChild(track.attach());
      track.on('disabled', () => {
        if (track.kind === 'video') {
          setMute(true);
          muteHandler({ mute: 'video', status: true });
        } else {
          muteHandler({ mute: 'audio', status: true });
        }
      });

      track.on('enabled', () => {
        if (track.kind === 'video') {
          setMute(false);
          muteHandler({ mute: 'video', status: false });
        } else {
          muteHandler({ mute: 'audio', status: false });
        }
      });
    });
  }

  return (
    <div className="custom-child-video-large absolute left-0 top-0" ref={remoteMedia}></div>
  );
};

const reducer = (state) => ({
  RoomReducer: state.RoomReducer.data,
  signal: state.TwilioSignalReducer,
});

export default connect(reducer, null)(RemoteParticipantTrack);
