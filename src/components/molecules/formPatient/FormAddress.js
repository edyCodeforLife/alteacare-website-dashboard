import Select from "react-select";
import { AlertClose } from '../../../assets/images';
import { React, useEffect, useState } from '../../../libraries';
import ServiceComboBox from '../../../hooks/location/ServiceComboBox';
import ServiceAddress from '../../../hooks/family-member/ServiceAddress';
import useShallowEqualSelector from '../../../helpers/useShallowEqualSelector';
import AlertMessagePanel from '../modal/AlertMessagePanel';

const FormAddress = (props) => {
	const { handlerClose, addressId, userId, isOpenAddresses } = props;
	const { UserSelectReducer } = useShallowEqualSelector((state) => state);
	const { addAddress, address, getAddress, message, close, setIsCloseFormAddress, isCloseFormAddress } = ServiceAddress();
	const [params, setParams] = useState({
		userId: UserSelectReducer.data.id,
    addressId: '',
	  street: '',
	  country: '',
	  province: '',
	  city: '',
	  district: '',
	  subDistrict: '',
	  rtRw: '',
	});

	const {
		country,
		getCountriesKeyword,
		selectCountry,
		getCountries,
		countries,

		province,
		getProvincesKeyword,
		selectProvince,
		provinces,

		city,
		getCitiesKeyword,
		selectCity,
		cities,

		district,
		getDistrictsKeyword,
		selectDistrict,
		districts,

		subDistrict,
		getSubDistrictsKeyword,
		selectSubDistrict,
		subDistricts,
	} = ServiceComboBox();

  const customStylesSelect = {
    control: base => ({
      ...base,
      height: 50,
      minHeight: 50
    })
  };

	useEffect(() => {
		getCountries();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

  useEffect(() => {
    getAddress({ addressId })
    setParams({
      ...params,
      addressId: addressId,
    });
		// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressId]);

  useEffect(() => {
    if (address && userId) {
      selectCountry({ label: address.country.name, value: address.country.id });
      selectProvince({ label: address.province.name, value: address.province.id });
      selectCity({ label: address.city.name, value: address.city.id });
      selectDistrict({ label: address.district.name, value: address.district.id });
      selectSubDistrict({ label: address.sub_district.name, value: address.sub_district.id });
      setParams({
        ...params,
        userId: userId,
        street: address.street,
        country: address.country.id,
        province: address.province.id,
        city: address.city.id,
        district: address.district.id,
        subDistrict: address.sub_district.id,
        rtRw: address.rt_rw,
      });
    }
		// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, userId]);

  useEffect(() => {
    if(isCloseFormAddress && isCloseFormAddress.status){
      handlerClose({ message: isCloseFormAddress.message, isOpenAddresses: true });
      setIsCloseFormAddress(null);
    }
		// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCloseFormAddress]);

	const applyParams = (param, from) => {
		if (from === 'COUNTRY') {
			selectCountry(param);
			setParams({
				...params,
				country: param.value,
				province: '',
				city: '',
				district: '',
				subDistrict: '',
			});
		}

		if (from === 'PROVINCE') {
			selectProvince(param);
			setParams({
				...params,
				province: param.value,
				city: '',
				district: '',
				subDistrict: '',
			});
		}

		if (from === 'CITY') {
			selectCity(param);
			setParams({ ...params, city: param.value, district: '', subDistrict: '' });
		}

		if (from === 'DISTRICT') {
			selectDistrict(param);
			setParams({ ...params, district: param.value, subDistrict: '' });
		}

		if (from === 'SUB_DISTRICT') {
			selectSubDistrict(param);
			setParams({ ...params, subDistrict: param.value })
		}
	}

	return (
		<div className={`w-full h-full flex flex-col`}>
			<div className="text-sm px-4 py-2 font-bold flex items-center justify-between bg-light3 text-mainColor">
				<span>Tambah Alamat Baru</span>
				<button onClick={() => handlerClose({ isOpenAddresses: isOpenAddresses })}>
					<img alt="close" src={AlertClose} />
				</button>
			</div>
			<div className="flex-1 overflow-y-auto">
				<div className="py-4 px-8 wrap-form-edit">
					<p>Alamat</p>
					<input type="text" value={params.street} onChange={(event) => setParams({ ...params, street: event.target.value })}/>
				</div>
				<div className="py-4 px-8 wrap-form-edit">
					<p>Negara</p>
					<Select
						value={country}
						options={countries}
            placeholder="Pilih negara"
            styles={customStylesSelect}
						onChange={(value) => applyParams(value, 'COUNTRY')}
						onInputChange={(value) => getCountriesKeyword({ keyword: value })}
					/>
				</div>
				<div className="py-4 px-8 wrap-form-edit">
					<p>Provinsi</p>
					<Select
						value={province}
						options={provinces}
            styles={customStylesSelect}
            placeholder="Pilih provinsi"
            isDisabled={!country ? true : false}
						onChange={(value) => applyParams(value, 'PROVINCE')}
						onInputChange={(value) => getProvincesKeyword({ keyword: value, country: country ? country.value : null })}
					/>
				</div>
				<div className="py-4 px-8 wrap-form-edit">
					<p>Kota</p>
					<Select
						value={city}
						options={cities}
            placeholder="Pilih kota"
            styles={customStylesSelect}
            isDisabled={!province ? true : false}
						onChange={(value) => applyParams(value, 'CITY')}
						onInputChange={(value) => getCitiesKeyword({ keyword: value, province: province ? province.value : null })}
					/>
				</div>
				<div className="py-4 px-8 wrap-form-edit">
					<p>Kecamatan</p>
					<Select
						value={district}
						options={districts}
            styles={customStylesSelect}
            placeholder="Pilih kecamatan"
            isDisabled={!city ? true : false}
						onChange={(value) => applyParams(value, 'DISTRICT')}
						onInputChange={(value) => getDistrictsKeyword({ keyword: value, city: city ? city.value : null })}
					/>
				</div>
				<div className="py-4 px-8 wrap-form-edit">
					<p>Keluarahan</p>
					<Select
						value={subDistrict}
						options={subDistricts}
            styles={customStylesSelect}
            placeholder="Pilih kelurahan"
            isDisabled={!district ? true : false}
						onChange={(value) => applyParams(value, 'SUB_DISTRICT')}
						onInputChange={(value) => getSubDistrictsKeyword({ keyword: value, district: district ? district.value : null })}
					/>
				</div>
				<div className="py-4 px-8 wrap-form-edit">
					<p>RT/RW</p>
					<input type="text" value={params.rtRw} onChange={(event) => setParams({ ...params, rtRw: event.target.value })} />
				</div>
				<div className="py-5 flex justify-end px-8 pb-16">
					<button onClick={() => addAddress(params)} className="bg-mainColor text-white rounded py-1 px-4">Simpan</button>
				</div>
			</div>
			{
				message
					? (
						<AlertMessagePanel
							counter={() => close()}
							direction="bottom"
							type="failed"
							text={message}
						/>
					) : ''
			}
		</div>
	);
};

FormAddress.defaultProps = {
	handlerClose: () => {},
  addressId: null,
  isOpenAddresses: false,
}

export default FormAddress;
