import { useState, useEffect } from 'react';

const Recorder = () => {
  const [stop, setStop] = useState(false);
  const [recorded, setRecorded] = useState([]);

  useEffect(() => {
    const stopButton = document.getElementById('stopButton');
    stopButton.addEventListener('click', () => {
      setStop(true);
    });
  }, [])

  useEffect(() => {
    if (stop) startRecord()
  }, [stop]);

  const startRecord = () => new Promise(async (resolve) => {
    const videoPatient = document.getElementsByTagName('video')[0];
    // const videoAdmin = document.getElementsByTagName('video')[1];
    const constraint = {
      audio: { 'echoCancellation': true },
      video: {
        'width': { 'min': 640, 'max': 1024 },
        'height': { 'min': 480, 'max': 768 },
      },
    };

    if (videoPatient) {
      const streamPatient = await navigator.mediaDevices.getUserMedia(constraint);
      // const streamAdmin = await navigator.mediaDevices.getUserMedia(constraint);
      videoPatient.srcObject = streamPatient;
      // videoAdmin.srcObject = streamAdmin;
      record({ stream: streamPatient, mimeType: 'video/mp4' })
      // record({ stream: streamAdmin, mimeType: 'video/mp4' })
    }
  });

  const record = ({stream, mimeType}) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (video) => {
      if (!stop) {
        console.log('start');
        // setRecorded((record) => (
        //   [...record, video.data]
        // ))
      }

      if (stop && mediaRecorder.state === 'recording') mediaRecorder.stop();
    };

    mediaRecorder.onstop = function () {
      const blob = new Blob(recorded, {
        type: mimeType
      });
      console.log(URL.createObjectURL(blob));
      setRecorded([]);
    };

    mediaRecorder.start(200);
  };

  return {
    stop,
    startRecord,
  };
}

export default Recorder;
