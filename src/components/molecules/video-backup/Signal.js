import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'

const Signal = (props) => {
  const [signalColor, setLocalSignalColor] = useState('bg-red-500')
  const { twilioSignal, signal } = props;

  useEffect(() => {
    if(signal.level === 'low') setLocalSignalColor('bg-red-500');
    if(signal.level === 'medium') setLocalSignalColor('bg-yellow-500');
    if(signal.level === 'high') setLocalSignalColor('bg-green-500');
  }, [signal])

  return (
    <div className="flex justify-start items-center rounded ml-2 px-1 py-2" style={{ backgroundColor: '#3A3A3C80' }}>
      <div className="flex flex-wrap inline-block items-end mx-1">
        <div className={`w-1 h-2 rounded ${signalColor}`} style={{ marginRight: '1px' }}></div>
        <div className={`w-1 h-3 rounded ${signalColor}`} style={{ marginRight: '1px' }}></div>
        <div className={`w-1 h-4 rounded ${signalColor}`} style={{ marginRight: '1px' }}></div>
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
