import { React, useEffect, useState, useRef, useCallback } from '../../../libraries'
import { debounce } from 'lodash'
import { LocalStorage } from '../../../helpers/localStorage'
import { Api, ApiFile } from '../../../helpers/api'
import { connect } from 'react-redux'
import { TriggerUpdate, UserDataSelected } from '../../../modules/actions'
import { FileUpload } from '../../../assets/images'
import { BoxDefault } from '../../atoms'
import { SimpleBio } from '../../molecules/bio'
import { AlertMessagePanel } from '../../molecules/modal'
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import getToday from 'helpers/getToday';

const FormPatient = ({ counter, TriggerUpdate, UserSelectReducer, BioData, type, UserDataSelected, isFromMissedCall = false }) => {
  const onTopScroll = useRef(null)
  const [isErrorKTP, setIsErrorKTP] = useState(false);

  // const [biodata, setBioData] = useState(null)
  const [messageAlert, setMessageAlert] = useState(null);

  const [birthCountryKeyword, setBirthCountryKeyword] = useState("")
  const [countryKeyword, setCountryKeyword] = useState("")
  const [nationalityKeyword, setNationalityKeyword] = useState("")
  const [provinceKeyword, setProvinceKeyword] = useState("")
  const [cityKeyword, setCityKeyword] = useState("")
  const [districtKeyword, setDistrictKeyword] = useState("")
  const [subDistrictKeyword, setSubDistrictKeyword] = useState("")

  const [responseGroups, setResponseGroups] = useState([]);
  const [insuranceGroups, setInsuranceGroups] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [listBirthCountry, setListBirthCountry] = useState([])
  const [listCountry, setListCountry] = useState([])
  const [listNationality, setListNationality] = useState([])
  const [listProvince, setListProvince] = useState([])
  const [listCity, setListCity] = useState([])
  const [listDistrict, setListDistrict] = useState([])
  const [listSubDistrict, setListSubDistrict] = useState([])

  const [insuranceGroup, setInsuranceGroup] = useState(null);
  const [company, setCompany] = useState(null);
  const [birthCountry, setBirthCountry] = useState(null)
  const [country, setCountry] = useState(null)
  const [nationality, setNationality] = useState(null)
  const [province, setProvince] = useState(null)
  const [city, setCity] = useState(null)
  const [district, setDistrict] = useState(null)
  const [subDistrict, setSubDistrict] = useState(null)

  const [disableFormValue, setDisableFormValue] = useState({
    email: "",
    phone: ""
  })

  const [idCard, setIdCard] = useState({
    url: "",
    beforeUpload: ""
  })
  const [file, setFile] = useState({
    percent: 0,
    total: 0,
    name: ""
  })

  const [gender] = useState([
    {
      value: "Laki-laki",
      label: "Laki-laki",
      id: "MALE"
    },
    {
      value: "Perempuan",
      label: "Perempuan",
      id: "FEMALE"
    },
  ])

  const [params, setParams] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    birth_country: "",
    birth_place: "",
    nationality: "",
    gender: "",
    id_card: "",
    photo_id_card: "",
    street: "",
    country: "",
    province: "",
    city: "",
    district: "",
    sub_district: "",
    rt_rw: "",
    insurance_company_id: "",
    insurance_plafon_group: "",
    insurance_number: "",
  })

  const [messageErrorForm, setMessageErrorForm] = useState("")

  useEffect(() => {
    if(BioData !== ""){
      setMessageErrorForm("Data pasien belum lengkap, untuk melanjutkan proses selanjutnya silahkan lengkapi data pasien terlebih dahulu.")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(UserSelectReducer !== null){
      const {
        id,
        first_name,
        last_name,
        email,
        phone,
        user_details,
        user_addresses
      } = UserSelectReducer

      let findUserAddresses = []

      if(user_addresses.length > 0){
        findUserAddresses = user_addresses.filter(items => items.type === "PRIMARY")
      }

      if(user_details.photo_id_card && user_details.photo_id_card.formats){
        setIdCard({
          ...idCard,
          url: user_details.photo_id_card.formats.small
        })
      }

      setDisableFormValue({
        ...disableFormValue,
        email: email,
        phone: phone
      })

      const insuranced = user_details.insurance ? user_details.insurance : null

      setParams({
        ...params,
        user_id: id,
        first_name: first_name,
        last_name: last_name,
        birth_date: user_details.birth_date !== null ? user_details.birth_date : "",
        birth_country: user_details.birth_country !== null ? user_details.birth_country.id : "",
        birth_place: user_details.birth_place !== null ? user_details.birth_place : "",
        nationality: user_details.nationality !== null ? user_details.nationality.id : "",
        gender: user_details.gender !== null ? user_details.gender : "",
        id_card: user_details.id_card !== null ? user_details.id_card : "",
        photo_id_card: user_details.photo_id_card !== null ? user_details.photo_id_card.id : "",
        street: findUserAddresses.length > 0 ? findUserAddresses[0].street : "",
        country: findUserAddresses.length > 0 ? findUserAddresses[0].country.id : "",
        province: findUserAddresses.length > 0 ? findUserAddresses[0].province.id : "",
        city: findUserAddresses.length > 0 ? findUserAddresses[0].city.id : "",
        district: findUserAddresses.length > 0 ? findUserAddresses[0].district.id : "",
        sub_district: findUserAddresses.length > 0 ? findUserAddresses[0].sub_district.id : "",
        rt_rw: findUserAddresses.length > 0 ? findUserAddresses[0].rt_rw : "",
        insurance_company_id: insuranced ? insuranced.insurance_company_id : "",
        insurance_plafon_group: insuranced ? insuranced.insurance_plafon_group : "",
        insurance_number: insuranced ? insuranced.insurance_number : "",
      })

      if (user_details.insurance) {
        setCompany({
          id: insuranced.insurance_company_id,
          value: insuranced.insurance_company_name,
          label: insuranced.insurance_company_name,
          name: 'insurance_company_id',
        });

        setInsuranceGroup({
          id: insuranced.insurance_plafon_group,
          value: insuranced.insurance_plafon_group,
          label: insuranced.insurance_plafon_group,
          name: 'insurance_plafon_group',
        });
      }

      if(user_details.birth_country !== null){
        setBirthCountry({
          name: "birth_country",
          label: user_details.birth_country.name,
          value: user_details.birth_country.name,
          id: user_details.birth_country.id
        })
      }
      if(user_details.nationality !== null){
        setNationality({
          name: "nationality",
          label: user_details.nationality.name,
          value: user_details.nationality.name,
          id: user_details.nationality.id
        })
      }
      if(findUserAddresses.length > 0){
        setCountry({
          name: "country",
          label: findUserAddresses[0].country.name,
          value: findUserAddresses[0].country.name,
          id: findUserAddresses[0].country.id
        })
        setProvince({
          name: "province",
          label: findUserAddresses[0].province.name,
          value: findUserAddresses[0].province.name,
          id: findUserAddresses[0].province.id
        })
        setCity({
          name: "city",
          label: findUserAddresses[0].city.name,
          value: findUserAddresses[0].city.name,
          id: findUserAddresses[0].city.id
        })
        setDistrict({
          name: "district",
          label: findUserAddresses[0].district.name,
          value: findUserAddresses[0].district.name,
          id: findUserAddresses[0].district.id
        })
        setSubDistrict({
          name: "sub_district",
          label: findUserAddresses[0].sub_district.name,
          value: findUserAddresses[0].sub_district.name,
          id: findUserAddresses[0].sub_district.id
        })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserSelectReducer])

  useEffect(() => {
    Api.get(`/data/countries${birthCountryKeyword !== "" ? "?keyword="+birthCountryKeyword : ""}`)
    .then(res => {
      let listBirthCountryData = []
      if(res.data.data.length > 0){
        res.data.data.forEach((res2, idx2) => {
          listBirthCountryData[idx2] = {
            name: "birth_country",
            label: res2.name,
            value: res2.name,
            id: res2.country_id
          }
        })
      }
      setListBirthCountry(listBirthCountryData)
    })
    .catch(function (error) {
      console.log(error)
    })
  }, [birthCountryKeyword])

  useEffect(() => {
    Api.get(`/data/countries${countryKeyword !== "" ? "?keyword="+countryKeyword : ""}`)
    .then(res => {
      let countryData = []
      if(res.data.data.length > 0){
        res.data.data.forEach((res2, idx2) => {
          countryData[idx2] = {
            name: "country",
            label: res2.name,
            value: res2.name,
            id: res2.country_id
          }
        })
      }
      setListCountry(countryData)
    })
    .catch(function (error) {
      console.log(error)
    })
  }, [countryKeyword])

  useEffect(() => {
    Api.get(`/data/countries${nationalityKeyword !== "" ? "?keyword="+nationalityKeyword : ""}`)
    .then(res => {
      let nationalityData = []
      if(res.data.data.length > 0){
        res.data.data.forEach((res2, idx2) => {
          nationalityData[idx2] = {
            name: "nationality",
            label: res2.name,
            value: res2.name,
            id: res2.country_id
          }
        })
      }
      setListNationality(nationalityData)
    })
    .catch(function (error) {
      console.log(error)
    })
  }, [nationalityKeyword])

  useEffect(() => {
    Api.get(`/data/provinces?keyword=${provinceKeyword !== "" ? provinceKeyword : ""}${country !== null ? "&country="+country.id : ""}`)
    .then(res => {
      let provinceData = []
      if(res.data.data.length > 0){
        res.data.data.forEach((res2, idx2) => {
          provinceData[idx2] = {
            name: "province",
            label: res2.name,
            value: res2.name,
            id: res2.province_id
          }
        })
      }
      setListProvince(provinceData)
    })
    .catch(function (error) {
      console.log(error.message)
    })
  }, [provinceKeyword, country])

  useEffect(() => {
    Api.get(`/data/cities?keyword=${cityKeyword !== "" ? cityKeyword : ""}${province !== null ? "&province="+province.id : ""}`)
    .then(res => {
      let cityData = [...listCity]
      if(res.data.data.length > 0){
        res.data.data.forEach((res2, idx2) => {
          cityData[idx2] = {
            name: "city",
            label: res2.name,
            value: res2.name,
            id: res2.city_id
          }
        })
      }
      setListCity(cityData)
    })
    .catch(function (error) {
      console.log(error.message)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityKeyword, province])

  useEffect(() => {
    Api.get(`/data/districts?keyword=${districtKeyword !== "" ? districtKeyword : ""}${city !== null ? "&city="+city.id : ""}`)
    .then(res => {
      let districtData = []
      if(res.data.data.length > 0){
        res.data.data.forEach((res2, idx2) => {
          districtData[idx2] = {
            name: "district",
            label: res2.name,
            value: res2.name,
            id: res2.district_id
          }
        })
      }
      setListDistrict(districtData)
    })
    .catch(function (error) {
      console.log(error.message)
    })
  }, [districtKeyword, city])

  useEffect(() => {
    Api.get(`/data/sub-districts?keyword=${subDistrictKeyword !== "" ? subDistrictKeyword : ""}${district !== null ? "&district="+district.id : ""}`)
    .then(res => {
      let subDistrictData = []
      if(res.data.data.length > 0){
        res.data.data.forEach((res2, idx2) => {
          subDistrictData[idx2] = {
            name: "sub_district",
            label: res2.name,
            value: res2.name,
            id: res2.sub_district_id
          }
        })
      }
      setListSubDistrict(subDistrictData)
    })
    .catch(function (error) {
      console.log(error.message)
    })
  }, [subDistrictKeyword, district])

  useEffect(() => {
    Api.get('/data/insurance-companies').then((res) => {
      const result = [];
      const groups = [];
      res.data.data.forEach((item) => {
        result.push({
          id: item.insurance_company_id,
          name: "insurance_company_id",
          label: item.insurance_company_name,
          value: item.insurance_company_name,
        });

        if (item.insurance_plafon_group.length > 0) {
          groups.push({
            query: item.insurance_plafon_group,
            parrent: item.insurance_company_id,
          });
        }
      });
      setResponseGroups(groups)
      setCompanies(result);
    });
  }, []);

  useEffect(() => {
    if (company) {
      const payloads = responseGroups.find((item) => item.parrent, company.id);
      if (payloads && payloads.query.length > 0) {
        const result = []
        payloads.query.forEach((item) => {
          result.push({
            id: item,
            name: 'insurance_plafon_group',
            label: item,
            value: item,
          });
        })
        setInsuranceGroups(result);
      }
    }
  }, [company, responseGroups]);

  const cancleEdit = () => {
    TriggerUpdate({
      cancelEdit: true
    })
  }

  const handleUploadFile = (event) => {
    const file = event.target.files[0]
    const fileType = file.type;
    const fileSize = file.size;
    const validImageTypes = [
      "image/gif",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (fileSize >= 10240000) {
      setMessageAlert({
        text: "File hanya bisa di upload maximum 10 mb",
        type: "failed",
        direction: "bottom"
      })
      event.target.value = ''
      return;
    }

    if (validImageTypes.indexOf(fileType) === -1) {
      setMessageAlert({
        text: "File hanya bisa gambar",
        type: "failed",
        direction: "bottom"
      })
      event.target.value = ''
      return;
    }

    const formData = new FormData();
    formData.append(
      "file",
      file,
      file.name
    )

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setIdCard({
        ...idCard,
        beforeUpload: reader.result
      })
    });
    reader.readAsDataURL(file);

    const options = {
      onUploadProgress: (progressEvent) => {
        const {loaded, total} = progressEvent
        let percent = Math.floor((loaded*100) / total)
        setFile({
          ...file,
          total: total,
          percent: percent
        })
      },
      headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` }
    }

    ApiFile.post('/file/v1/file/upload', formData, options)
      .then(res => {
        const url = res.data.data.formats
          ? res.data.data.formats.small
          : res.data.data.url;

        setFile({ ...file, total: 0, percent: 0 });
        setIdCard({ ...idCard, url, beforeUpload: "" });
        setParams({ ...params, photo_id_card: res.data.data.id });
      }).catch(function (error) {
        console.log(error.response)
        setFile({ ...file, total: 0, percent: 0 });
        setIdCard({ ...idCard, beforeUpload: "" });
        setMessageAlert({
          text: error.response.data.message,
          type: "failed",
          direction: "bottom"
        })
      })
  }

  const handleDeleteIdCard = () => {
    setIdCard({
      ...idCard,
      url: "",
      beforeUpload: ""
    })
    setParams({
      ...params,
      photo_id_card: ""
    })
  }

  const handleChangeParam = (event) => {
    setParams({
      ...params,
      [event.target.getAttribute('name')]: event.target.value
    })
  }

  const handleChangeParamIdCard = (event) => {
    const value = event.target.value;
    if (value.length <= 16) setIsErrorKTP(true);
    if (value.length >= 16) setIsErrorKTP(false);
    if (value.length > 20) return value;

    setParams({
      ...params,
      [event.target.getAttribute('name')]: event.target.value
    })
  }

  const handleKeydownBirthCountry = debounce((value) => {
    setBirthCountryKeyword(value)
  }, 700)

  const handleKeydownCountry = debounce((value) => {
    setCountryKeyword(value)
  }, 700)

  const handleKeydownNationality = debounce((value) => {
    setNationalityKeyword(value)
  }, 700)

  const handleKeydownProvince = debounce((value) => {
    setProvinceKeyword(value)
  }, 700)

  const handleKeydownCity = debounce((value) => {
    setCityKeyword(value)
  }, 700)

  const handleKeydownDistrict = debounce((value) => {
    setDistrictKeyword(value)
  }, 700)

  const handleKeydownSubDistrict = debounce((value) => {
    setSubDistrictKeyword(value)
  }, 700)

  const handleChangeSelectOption = (value) => {
    const paramsUpdate = {...params};
    if(value.name === "birth_country"){
      setBirthCountry(value)
    } else if(value.name === "nationality"){
      setNationality(value)
    } else if(value.name === "country"){
      setProvince(null)
      setListProvince([])
      setCity(null)
      setListCity([])
      setDistrict(null)
      setListDistrict([])
      setSubDistrict(null)
      setListSubDistrict([])
      paramsUpdate.province = "";
      paramsUpdate.city = "";
      paramsUpdate.district = "";
      paramsUpdate.sub_district = "";
      setCountry(value)
    } else if(value.name === "province"){
      setCity(null)
      setListCity([])
      setDistrict(null)
      setListDistrict([])
      setSubDistrict(null)
      setListSubDistrict([])
      paramsUpdate.city = "";
      paramsUpdate.district = "";
      paramsUpdate.sub_district = "";
      setProvince(value)
    } else if(value.name === "city"){
      setDistrict(null)
      setListDistrict([])
      setSubDistrict(null)
      setListSubDistrict([])
      paramsUpdate.district = "";
      paramsUpdate.sub_district = "";
      setCity(value)
    } else if(value.name === "district"){
      setDistrict(value);
      setSubDistrict(null);
      setListSubDistrict([]);
      paramsUpdate.sub_district = "";
    }
    else if(value.name === "sub_district"){ setSubDistrict(value) }
    else if (value.name === 'insurance_company_id') {
      setCompany(value);
      setInsuranceGroup(null);
      paramsUpdate.insurance_plafon_group = "";
    }
    else if (value.name === 'insurance_plafon_group'){
      setInsuranceGroup(value);
    }

    setParams({
      ...paramsUpdate,
      [value.name]: value.id
    });
  }

  const handleSubmitEdit = () => {
    let status = true;
    let message = "";
    if(params.id_card.length < 16){
      status = false;
      message = "Panjang No. KTP/KIA/Paspor harus Lebih dari 16 - 20 Karakter"
    }

    if(params.id_card.length > 20){
      status = false;
      message = "Panjang No. KTP/KIA/Paspor harus Lebih dari 16 - 20 Karakters"
    }

    if (params.insurance_company_id !== '' && params.insurance_plafon_group === '') {
        status = false;
        message = "Plafon Asuransi Harus dipilih jika telah memilih perusahaan asuransi"
    }

    if(status){
      Api.post(`/user/profile/update`, params, {
        headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` }
      })
      .then(res => {
        updateUserDataSelected()
        TriggerUpdate({
          triggerSuccessEditUser: true,
          text: "Berhasil memperbarui data user"
        })
        if(counter !== ""){
          counter({
            status: "successUpdate"
          })
        }
      })
      .catch(function (error)  {
        setMessageErrorForm(error.response.data.message)
        setMessageDebounce(error.response.data.message)
        executeScroll()
      })
    } else {
      setMessageErrorForm(`${message}`);
      executeScroll();
    }
  }

  const updateUserDataSelected = () => {
    Api.get(`/user/users/${params.user_id}`, {
      headers: { "Authorization" : `Bearer ${LocalStorage('access_token')}` }
    })
    .then(res => {
      UserDataSelected(res.data.data)
    })
    .catch( function (error) {
      console.log(error.message)
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setMessageDebounce = useCallback(
    debounce(() => setMessageErrorForm(""), 10000, true),
    []
  )

  const executeScroll = () => onTopScroll.current.scrollIntoView({behavior: "smooth"})

  const today = getToday();

  return (
    <div className={`w-full flex flex-wrap relative ${type !== "completeData" ? "xl:px-5 px-2 xl:py-5 py-3" : ""}`}>
      {messageAlert !== null ?
        <AlertMessagePanel
          text={messageAlert.text}
          type={messageAlert.type}
          direction={messageAlert.direction}
          counter={(value) => setMessageAlert(value)} />
      : ""}
      <div className={`${type === "completeData" || isFromMissedCall ? "w-full" : "xl:w-8/12 w-full"}`}>
        <div ref={onTopScroll}></div>
        {type !== "completeData" ?
          <div className="text-right">
            <button className="font-bold text-mainColor text-sm mb-8" onClick={cancleEdit}>
              Batal Ubah
            </button>
          </div>
        : ""}

        {messageErrorForm !== "" ?
          <BoxDefault
            text={messageErrorForm}
            className="text-error2 bg-redCustom1 py-2 px-3 mt-0 mb-8 border border-solid border-error2 rounded text-sm"
          />
        : ""}

        {BioData !== "" ?
          <SimpleBio data={BioData} />
        : ""}

        {type !== "completeData" ?
          <>
            <div className="wrap-form-edit">
              <p>Nama Depan</p>
              <input
                type="text"
                placeholder=""
                name="first_name"
                value={params.first_name !== "" ? params.first_name : ""}
                onChange={handleChangeParam}
              />
            </div>
            <div className="wrap-form-edit">
              <p>Nama Belakang</p>
              <input
                type="text"
                placeholder=""
                value={params.last_name !== "" ? params.last_name : ""}
                name="last_name"
                onChange={handleChangeParam}
              />
            </div>
            <div className="wrap-form-edit">
              <p>Tanggal Lahir</p>
              <input
                type="date"
                value={params.birth_date}
                max={today}
                name="birth_date"
                onChange={handleChangeParam}
              />
            </div>
            <div className="wrap-form-edit">
              <p>Tempat Lahir</p>
              <Select
                value={birthCountry !== "" ? birthCountry : {}}
                onChange={(value) => handleChangeSelectOption(value)}
                onInputChange={handleKeydownBirthCountry}
                options={listBirthCountry}
                getOptionValue={(option) => option.value}
                getOptionLabel={(option) => option.value}
                placeholder=""
              />
            </div>
            <div className="wrap-form-edit">
              <input
                type="text"
                value={params.birth_place !== "" ? params.birth_place : ""}
                name="birth_place"
                onChange={handleChangeParam}
              />
            </div>
            <div className="wrap-form-edit">
              <p>Jenis Kelamin</p>
              <Select
                value={ params.gender === "MALE" ? gender[0] : gender[1] }
                onChange={(value) => { setParams({ ...params, gender: value.id }) }}
                options={gender}
                getOptionValue={(option) => option.value}
                getOptionLabel={(option) => option.value}
                placeholder="Pilih Jenis Kelamin"
              />
            </div>
            <div className="wrap-form-edit">
              <p>No. Telepon</p>
              <input
                type="text"
                placeholder=""
                value={disableFormValue.phone !== "" ? disableFormValue.phone : ""}
                disabled={true}
                className="w-full py-2 px-4 text-xs text-dark4 border border-solid border-light1 rounded bg-white" />
            </div>
            <div className="wrap-form-edit">
              <p>Email</p>
              <input
                type="text"
                disabled={true}
                value={disableFormValue.email !== "" ? disableFormValue.email : ""}
                className="w-full py-2 px-4 text-xs text-dark4 border border-solid border-light1 rounded bg-white" />
            </div>

          </>
        : ""}

        <div className="wrap-form-edit">
          <p>No.KTP/KIA/Paspor</p>
          <input
            autoComplete="off"
            type="text"
            value={params.id_card || '' }
            name="id_card"
            onChange={handleChangeParamIdCard}
            onPaste={handleChangeParamIdCard}
          />
          <span className="text-xs text-red-500" style={{ display: isErrorKTP ? '' : 'none' }}>
            Minimum karakter adalah 16 karakter
          </span>
        </div>
        <div className="wrap-form-edit">
          <p>Kewarganegaraan</p>
          <Select
            value={nationality !== "" ? nationality : {}}
            onChange={(value) => handleChangeSelectOption(value)}
            onInputChange={handleKeydownNationality}
            options={listNationality}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.value}
            placeholder=""
          />
        </div>
        <div className="wrap-form-edit">
          <p>Alamat</p>
          <input
            type="text"
            value={params.street !== "" ? params.street : ""}
            name="street"
            onChange={handleChangeParam}
            placeholder="Ketik nama jalan, blok nomor rumah"
          />
        </div>

        <div className="wrap-form-edit">
          <p>Negara</p>
          <Select
            defaultValue={country}
            value={country}
            onChange={handleChangeSelectOption}
            onInputChange={handleKeydownCountry}
            options={listCountry}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.value}
            placeholder=""
          />
        </div>
        <div className="wrap-form-edit">
          <p>Provinsi</p>
          <Select
            defaultValue={province}
            value={province}
            onChange={handleChangeSelectOption}
            onInputChange={handleKeydownProvince}
            options={listProvince}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.value}
            placeholder=""
          />
        </div>
        <div className="wrap-form-edit">
          <p>Kota</p>
          <Select
            defaultValue={city}
            value={city}
            onChange={handleChangeSelectOption}
            onInputChange={handleKeydownCity}
            options={listCity}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.value}
            placeholder=""
          />
        </div>
        <div className="wrap-form-edit">
          <p>Kecamatan</p>
          <Select
            value={district}
            defaultValue={district}
            onChange={handleChangeSelectOption}
            onInputChange={handleKeydownDistrict}
            options={listDistrict}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.value}
            placeholder=""
          />
        </div>
        <div className="wrap-form-edit">
          <p>Kelurahan</p>
          <Select
            value={subDistrict}
            defaultValue={subDistrict}
            onChange={handleChangeSelectOption}
            onInputChange={handleKeydownSubDistrict}
            options={listSubDistrict}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.value}
            placeholder=""
          />
        </div>
        <div className="wrap-form-edit">
          <p>RT/RW</p>
          <input
            type="text"
            value={params.rt_rw !== "" ? params.rt_rw : ""}
            name="rt_rw"
            onChange={handleChangeParam}
            placeholder="Tulis Rt/RW contoh : 001/002"
          />
        </div>
        <div className="wrap-form-edit">
          <p>Nama Perusahaan Asuransi</p>
          <Select
            value={company}
            defaultValue={company}
            onChange={handleChangeSelectOption}
            onInputChange={() => {}}
            options={companies}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.value}
            placeholder="Pilih Perusahaan Asuransi"
          />
        </div>
        <div className="wrap-form-edit">
          <p>Plafon Asuransi</p>
          <Select
            value={insuranceGroup}
            defaultValue={insuranceGroup}
            onChange={handleChangeSelectOption}
            onInputChange={() => {}}
            options={insuranceGroups}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.value}
            placeholder="Pilih Plafon Asuransi"
          />
        </div>
        <div className="wrap-form-edit">
          <p>Nomor Asuransi</p>
          <input
            type="text"
            value={params.insurance_number}
            name="insurance_number"
            onChange={handleChangeParam}
            placeholder="Tulis Nomor Asuransi"
          />
        </div>
        <div className="flex flex-wrap items-center py-2">
          <label className="mr-auto text-sm font-bold">Foto KTP </label>
          {idCard.beforeUpload !== "" || idCard.url !== "" ?
            <div className="w-full h-48 my-2 relative rounded">
              <img src={idCard.url !== "" ? idCard.url : idCard.beforeUpload} alt="ID card" className="w-full h-full" />
              {idCard.url !== "" ?
                <div className="w-full pl-1 pt-1">
                  <button className="text-sm text-error1 font-bold" onClick={handleDeleteIdCard}>Hapus</button>
                </div>
              : ""}
              {file.percent > 0 ?
                <>
                  <div
                    className="absolute z-10 left-0 top-0 w-full h-full flex flex-wrap justify-center content-center px-24 rounded"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    <p className="w-full text-center text-white mb-2">{file.percent}%</p>
                    <div className="w-full bg-subtle h-1">
                      <div className="bg-darker transition-all h-1" style={{ width: `${file.percent}%` }}></div>
                    </div>
                  </div>
                </>
             : ""}
            </div>
          :
            <div className="overflow-hidden relative my-2 ml-auto inline-block">
              <button className="py-2 w-full inline-flex items-center justify-end">
                <img src={FileUpload} alt="File Upload Icon" className="inline mr-1 w-2" />
                <span className="text-xs">Upload Foto KTP</span>
              </button>
              <input
                className="cursor-pointer absolute block py-1 w-full opacity-0 top-0"
                type="file"
                accept="image/*"
                onChange={handleUploadFile}
              />
            </div>
          }
        </div>
        <div className="pb-4 flex flex-wrap items-center justify-end my-2">
          <button
            className="text-white font-bold py-2 px-4 rounded text-xs bg-mainColor"
            onClick={handleSubmitEdit}
          >Perbarui</button>
        </div>

      </div>

      {type !== "completeData" ?
        <div className="w-4/12 flex flex-wrap items-end pb-2"></div>
      : ""}
    </div>
  )
}

FormPatient.defaultProps = {
  type: "",
  BioData: "",
  counter: ""
}

const mapStateToProps = (state) => ({
  UserSelectReducer: state.UserSelectReducer.data
})

const mapDispatchToProps = {
  TriggerUpdate,
  UserDataSelected
}

export default connect(mapStateToProps, mapDispatchToProps)(FormPatient)
