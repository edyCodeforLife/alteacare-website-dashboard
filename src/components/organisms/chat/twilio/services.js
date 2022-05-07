/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import useShallowEqualSelector from '../../../../helpers/useShallowEqualSelector';
import { RoomData, setChatNotification } from '../../../../modules/actions';

const Service = () => {
  const dispatch = useDispatch();
  const inputMessage = useRef(null);
  const identityLocal = useRef(null);
  const identityRemote = useRef(null);
  const [modal, setModal] = useState('');
  const [messages, setMessages] = useState([]);
  const [localUpload, setLocalUpload] = useState(false);
  const [remoteUpload, setRemoteUpload] = useState(false);
  const { chat, RoomReducer } = useShallowEqualSelector(state => state);
  const Room = RoomReducer?.data;

  const submitHandler = async event => {
    event.preventDefault();
    const channel = Room?.channel;

    if (channel && (await channel.channelState.status) === 'joined') {
      const value = inputMessage.current.value;
      await channel.sendMessage(value);
      inputMessage.current.value = '';
    } else {
      setModal('Sedang menghubungkan');
    }
  };

  const handleChangeFile = async event => {
    const room = Room?.room;
    const channel = Room?.channel;

    if (!room || !channel) {
      setModal('Sedang menghubungkan');
      return false;
    }

    if (event.target.files[0] !== undefined && event.target.files[0] !== '') {
      const file = event.target.files[0];
      const fileType = file.type;
      const fileSize = file.size;
      const validImageTypes = [
        'image/gif',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
      ];

      if (fileSize >= 10240000) {
        setModal('File hanya bisa di upload maximum 10 mb');
        event.target.value = '';
        return false;
      }

      if (validImageTypes.indexOf(fileType) === -1) {
        setModal('File hanya bisa gambar atau pdf');
        event.target.value = '';
        return false;
      }

      event.preventDefault();
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      await channel.sendMessage(formData);
    }
  };

  const handleMessage = async message => {
    try {
      if (message.type === 'media') {
        if (message.author === chat.provider?.config?.identity) {
          setLocalUpload(true);
          identityLocal.current.innerHTML = message.author;
        } else {
          setRemoteUpload(true);
          identityRemote.current.innerHTML = message.author;
        }

        const condition =
          message.media.contentType === 'application/pdf' ||
          message.media.contentType === 'application/*';

        message.contentType = condition ? 'pdf' : 'image';
        const url = await message.media.getContentTemporaryUrl();

        message.url = url;
        setMessages(msg => [
          ...msg.filter(item => item.sid !== message.sid),
          message,
        ]);

        if (message.author === chat.provider?.config?.identity)
          setLocalUpload(false);
        else setRemoteUpload(false);
      } else {
        setMessages(msg => [
          ...msg.filter(item => item.sid !== message.sid),
          message,
        ]);
      }
    } catch (err) {
      console.log(err?.message);
    }
  };

  const joinChannel = async channel => {
    try {
      if ((await channel.channelState.status) !== 'joined')
        await channel.join();
      if ((await channel.channelState.status) === 'joined') {
        await channel.on('messageAdded', messages => {
          handleMessage(messages);
          dispatch(setChatNotification(true));
        });

        channel.getMessages().then(function (messages) {
          const totalMessages = messages.items.length;
          for (let i = 0; i < totalMessages; i++) {
            const message = messages.items[i];
            handleMessage(message);
          }
        });
      }
    } catch (err) {
      console.log(err?.message);
    }
  };

  const getChannel = async client => {
    let channel;
    const roomChannel = Room?.channel;
    const { identity, room_code } = chat.provider?.config;

    try {
      channel = await client.getChannelByUniqueName(room_code);
    } catch (err) {
      channel = await client.createChannel({
        uniqueName: room_code,
        friendlyName: identity,
      });
      console.log(err?.message);
    }

    if (!roomChannel) {
      dispatch(RoomData({ ...Room, channel }));
      await joinChannel(channel);
    }
  };

  const connectChat = async () => {
    try {
      const token = chat.provider?.config?.token;
      const Chat = require('twilio-chat');
      const client = await Chat.Client.create(token);

      await getChannel(client);
    } catch (err) {
      console.log(err?.message);
    }
  };

  useEffect(() => connectChat(), [RoomReducer]);

  return {
    modal,
    setModal,
    messages,
    inputMessage,
    RoomReducer,
    localUpload,
    remoteUpload,
    identityLocal,
    identityRemote,
    submitHandler,
    handleChangeFile,
    identity: chat.provider?.config?.identity,
  };
};

export default Service;
