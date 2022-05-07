import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'

const Signal = (props) => {
  const [level, setLevel] = useState('');
  const { twilioSignal, signal } = props;

  useEffect(() => setLevel(signal.level), [signal])

  useEffect(() => () => setLevel(''), []);

  return (
    <div className="flex justify-start items-center rounded ml-2 px-1 py-2" style={{ backgroundColor: '#3A3A3C80' }}>
      <div className="flex flex-wrap inline-block items-end mx-1">
        {
          level === ''
            ? (
              <>
                <div className="w-1 h-2 rounded bg-gray-500" style={{ marginRight: '1px' }}></div>
                <div className="w-1 h-3 rounded bg-gray-500" style={{ marginRight: '1px' }}></div>
                <div className="w-1 h-4 rounded bg-gray-500" style={{ marginRight: '1px' }}></div>
              </>
            ) : ''
        }
        {
          level === 'low'
            ? (
              <>
                <div className="w-1 h-2 rounded bg-red-500" style={{ marginRight: '1px' }}></div>
                <div className="w-1 h-3 rounded bg-gray-500" style={{ marginRight: '1px' }}></div>
                <div className="w-1 h-4 rounded bg-gray-500" style={{ marginRight: '1px' }}></div>
              </>
            ) : ''
        }
        {
          level === 'medium'
            ? (
              <>
                <div className="w-1 h-2 rounded bg-yellow-500" style={{ marginRight: '1px' }}></div>
                <div className="w-1 h-3 rounded bg-yellow-500" style={{ marginRight: '1px' }}></div>
                <div className="w-1 h-4 rounded bg-gray-500" style={{ marginRight: '1px' }}></div>
              </>
            ) : ''
        }
        {
          level === 'high'
            ? (
              <>
                <div className="w-1 h-2 rounded bg-green-500" style={{ marginRight: '1px' }}></div>
                <div className="w-1 h-3 rounded bg-green-500" style={{ marginRight: '1px' }}></div>
                <div className="w-1 h-4 rounded bg-green-500" style={{ marginRight: '1px' }}></div>
              </>
            ) : ''
        }
      </div>
      <div className="text-xs text-white mr-1">
        {
          twilioSignal.level === 'high' || twilioSignal.level === 'medium'
            ? `${twilioSignal.mbps || 0} Mbps`
            : `${twilioSignal.kbps || 0} Kbps`
        }
      </div>
    </div>
  );
}

const reducer = (state) => ({
  signal: state.TwilioSignalReducer,
})

export default connect(reducer, null)(Signal);
