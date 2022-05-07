import { useEffect } from '../../../libraries';
import { AlertClose } from '../../../assets/images';
import ServiceAddress from '../../../hooks/family-member/ServiceAddress';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';
import { EmptyData, LoadingComponent } from '../../molecules';
import AlertMessagePanel from '../../molecules/modal/AlertMessagePanel';

const Addresses = props => {
  const {
    isShowing,
    handlerClose,
    selectAddress,
    addressMessage,
    openFormAddress,
    clearAddressMessage,
  } = props;

  const { loader, addresses, getAddresses } = ServiceAddress();
  const { UserSelectReducer } = useShallowEqualSelector(state => state);

  useEffect(() => {
    getAddresses({ userId: UserSelectReducer.data.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (addressMessage) {
      getAddresses({ userId: UserSelectReducer.data.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressMessage]);

  const openFormEdit = event => {
    event.stopPropagation();
    openFormAddress(event.target.value);
  };

  return (
    <div
      className={`w-full h-full flex flex-col relative bg-white ${
        !isShowing ? 'hidden' : ''
      }`}
    >
      <div className="text-sm px-4 py-2 mb-2 font-bold flex items-center justify-between bg-light3 text-mainColor">
        <span>Daftar Alamat</span>
        <button onClick={() => handlerClose()}>
          <img alt="close" src={AlertClose} />
        </button>
      </div>
      <div className="overflow-y-auto scroll-small pb-16">
        {addresses.length > 0 && !loader
          ? addresses.map((item, index) => {
              return (
                <div
                  key={index}
                  className="py-2 px-4 cursor-pointer"
                  onClick={() => selectAddress(item)}
                >
                  <div className="p-5 border border-solid border-grey-200 shadow-xs hover:bg-light3 rounded p-2 flex flex-row items-start">
                    <div className="flex-1">
                      <div className="text-sm text-mainColor mb-5 xl:w-2/3 lg:w-4/5 w-full">
                        {`${item.street}, Blok RT/RW ${item.rt_rw} kel.${item.sub_district.name} Kec.${item.district.name} ${item.city.name} ${item.province.name}`}
                      </div>
                      {item.type === 'PRIMARY' ? (
                        <label className="text-sm rounded py-1 px-2 text-white bg-lighter">
                          Alamat Utama
                        </label>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="relative z-10">
                      <button
                        onClick={openFormEdit}
                        value={item.id}
                        className="text-sm font-bold border border-solid border-darker text-darker py-1 px-2 rounded"
                      >
                        Ubah
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          : ''}
        {addresses.length < 1 && !loader ? (
          <EmptyData text="Tidak ada daftar alamat!" styleWrap="py-16" />
        ) : (
          ''
        )}
        {loader ? <LoadingComponent className="my-20" /> : ''}
      </div>
      {addressMessage ? (
        <AlertMessagePanel
          type="success"
          direction="bottom"
          text={addressMessage}
          counter={() => clearAddressMessage()}
        />
      ) : (
        ''
      )}
    </div>
  );
};

Addresses.defaultProps = {
  handlerClose: () => {},
  openFormAddress: () => {},
  selectAddress: () => {},
  addressMessage: null,
  clearAddressMessage: () => {},
};

export default Addresses;
