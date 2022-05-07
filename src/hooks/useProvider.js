import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Api } from '../helpers/api';
import { LocalStorage } from '../helpers/localStorage';
import useCallingUri from './useCallingUri';
import { setChatProvider, setVideoProvider } from '../modules/actions';

const useProvider = () => {
  const dispatch = useDispatch();
  const { appointmentId } = useCallingUri();

  // Fetch room data based on appointment id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (appointmentId) {
      const getProviders = async () => {
        try {
          setLoading(true);
          const providersUrl = `/appointment/v2/room/${appointmentId}`;
          const token = LocalStorage('access_token');
          const options = { headers: { Authorization: `Bearer ${token}` } };
          const providers = await Api.get(providersUrl, options);

          const buildProvider = function (provider) {
            const obj = provider.data;
            const [config] =
              Object.keys(obj)
                .map(prop => obj[prop])
                .filter(config => config !== null) || null;

            return { name: provider.name, config };
          };

          // Create config name and object for current active chat provider and video provider
          const chat = providers.data.data.chat_provider || '';
          const objChat = providers.data.data.chat_provider_data || {};
          const video = providers.data.data.video_call_provider || '';
          const objVideo = providers.data.data.video_call_provider_data || {};
          const chatProvider = buildProvider({ name: chat, data: objChat });
          const videoProvider = buildProvider({ name: video, data: objVideo });

          // Dispatch chat provider and video provider to global state
          dispatch(setChatProvider(chatProvider));
          dispatch(setVideoProvider(videoProvider));
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      getProviders();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  return { loading, error };
};

export default useProvider;
