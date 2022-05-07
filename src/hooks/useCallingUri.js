import { useParams } from 'react-router-dom';

const useCallingUri = () => {
  const { token: encObjCalling } = useParams();

  // Get encoded calling object data from uri, decode and parse it
  const decObjCalling = Buffer.from(encObjCalling, 'base64').toString('ascii');
  const objCalling = JSON.parse(decObjCalling) || {};
  const { name, appointmentId, userId } = objCalling;

  // userId is passed from specialist call
  // Set it to null instead of undefined when userId is not passed
  return { name, appointmentId, userId: userId || null };
};

export default useCallingUri;
