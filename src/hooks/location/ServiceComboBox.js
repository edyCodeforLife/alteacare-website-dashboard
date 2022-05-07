import { useState } from '../../libraries';
import { Api } from '../../helpers/api';
import { debounce } from 'lodash'

const ServiceComboBox = () => {
  const [gender, setGender] = useState(null);
  const [genders] = useState([
    {
      label: 'Laki-laki',
      value: 'MALE',
    },
    {
      label: 'Perempuan',
      value: 'FEMALE',
    },
  ]);

  const [country, setCountry] = useState(null);
  const [countries, setCountries] = useState([]);

  const [birthCountry, setBirthCountry] = useState(null);
  const [birthCountries, setBirthCountries] = useState([]);

  const [nationality, setNationality] = useState(null);
  const [nationalities, setNationalities] = useState([]);

  const [province, setProvince] = useState(null);
  const [provinces, setProvinces] = useState([]);

  const [city, setCity] = useState(null);
  const [cities, setCities] = useState([]);

  const [district, setDistrict] = useState(null);
  const [districts, setDistricts] = useState([]);

  const [subDistrict, setSubDistrict] = useState(null);
  const [subDistricts, setSubDistricts] = useState([]);

  const [company, setCompany] = useState(null);
  const [companies, setCompanies] = useState([]);

  const [plafon, setPlafon] = useState(null);
  const [plafones, setPlafones] = useState([]);

  const [familyType, setFamilyType] = useState(null);
  const [familyTypes, setFamilyTypes] = useState([]);

  const locationApi = (payload) => new Promise((resolve) => {
    const params = {};
    if (payload && payload.country) params.country = payload.country;
    if (payload && payload.province) params.province = payload.province;
    if (payload && payload.city) params.city = payload.city;
    if (payload && payload.district) params.district = payload.district;
    params.keyword = payload && payload.keyword ? payload.keyword : '';
    Api.get(`${payload.url}`, {
      params: params
    }).then(response => {
      resolve(response.data.data);
    }).catch((error) => {
      resolve([]);
    })
  });

  const companiesApi = () => new Promise((resolve) => {
    Api.get(`/data/insurance-companies`, {
      //
    }).then((response) => {
      resolve(response.data.data);
    }).catch((error) => {
      resolve([]);
    })
  });

  const familyTypesApi = () => new Promise((resolve) => {
    Api.get(`/data/family-relation-types?show_all=true`, {
      //
    }).then(response => {
      resolve(response.data.data);
    })
    .catch(function (error) {
      console.log(error);
      resolve([]);
    })
  });

  const getCountries = async (payload) => {
    const params = { url: '/data/countries' }
    if (payload && payload.keyword) params.keyword = payload.keyword;
    const response = await locationApi(params);
    const result = response.map((item) => ({
      label: `${item.code} - ${item.name}`,
      value: item.country_id,
    }));
    setCountries(result);
  }

  const getCountriesKeyword = debounce((params) => {
    if (params.keyword !== '') {
      getCountries(params);
    }
  }, 700);

  const selectCountry = (params) => {
    setCountry(params || null);
    setProvince(null);
    setCity(null);
    setDistrict(null);
    setSubDistrict(null);
    if (params && params.value) getProvinces({ country: params.value });
  }

  const getBirthCountries = async (payload) => {
    const params = { url: '/data/countries' }
    if (payload && payload.keyword) params.keyword = payload.keyword;
    const response = await locationApi(params);
    const result = response.map((item) => ({
      label: `${item.code} - ${item.name}`,
      value: item.country_id,
    }));
    setBirthCountries(result);
  }

  const getCountryById = async (id) => {
    const params = { url: `/data/countries/${id}` }
    const response = await locationApi(params);
    return {
      label: `${response.code} - ${response.name}`,
      value: response.country_id
    };
  }

  const getBirthCountriesKeyword = debounce((params) => {
    if (params.keyword !== '') {
      getBirthCountries(params);
    }
  }, 700);

  const selectBirthCountry = (params) => {
    setBirthCountry(params || null);
  }

  const getNationalities = async (payload) => {
    const params = { url: '/data/countries' }
    if (payload && payload.keyword) params.keyword = payload.keyword;
    const response = await locationApi(params);
    const result = response.map((item) => ({
      label: `${item.code} - ${item.name}`,
      value: item.country_id,
    }));
    setNationalities(result);
  }

  const getNationalitiesKeyword = debounce((params) => {
    if (params.keyword !== '') {
      getNationalities(params);
    }
  }, 700);

  const selectNationality = (params) => {
    setNationality(params || {});
  }

  const getProvinces = async (payload) => {
    const params = { url: '/data/provinces' };
    if (payload && payload.keyword) params.keyword = payload.keyword;
    if (payload && payload.country) params.country = payload.country;
    const response = await locationApi(params);
    const result = response.map((item) => ({
      label: item.name,
      value: item.province_id,
    }));
    setProvinces(result);
  }

  const getProvincesKeyword = debounce((params) => {
    if (params.keyword !== '') {
      getProvinces(params);
    }
  }, 700);

  const selectProvince = (params) => {
    setProvince(params || {});
    setCity(null);
    setDistrict(null);
    setSubDistrict(null);
    if (params && params.value) getCities({ province: params.value });
  }

  const getCities = async (payload) => {
    const params = { url: '/data/cities' }
    if (payload && payload.keyword) params.keyword = payload.keyword;
    if (payload && payload.province) params.province = payload.province;
    const response = await locationApi(params);
    const result = response.map((item) => ({
      label: item.name,
      value: item.city_id,
    }));
    setCities(result);
  }

  const getCitiesKeyword = debounce((params) => {
    if (params.keyword !== '') {
      getCities(params);
    }
  }, 700);

  const selectCity = (params) => {
    setCity(params || null);
    setDistrict(null);
    setSubDistrict(null);
    if (params && params.value) getDistricts({ city: params.value });
  }

  const getDistricts = async (payload) => {
    const params = { url: '/data/districts' }
    if (payload && payload.keyword) params.keyword = payload.keyword;
    if (payload && payload.city) params.city = payload.city;
    const response = await locationApi(params);
    const result = response.map((item) => ({
      label: item.name,
      value: item.district_id,
    }));
    setDistricts(result);
  }

  const getDistrictsKeyword = debounce((params) => {
    if (params.keyword !== '') {
      getDistricts(params);
    }
  }, 700);

  const selectDistrict = (params) => {
    setDistrict(params || null);
    setSubDistrict(null);
    if (params && params.value) getSubDistricts({ district: params.value });
  }

  const getSubDistricts = async (payload) => {
    const params = { url: '/data/sub-districts' }
    if (payload && payload.keyword) params.keyword = payload.keyword;
    if (payload && payload.district) params.district = payload.district;
    const response = await locationApi(params);
    const result = response.map((item) => ({
      label: item.name,
      value: item.sub_district_id,
    }));
    setSubDistricts(result);
  }

  const getSubDistrictsKeyword = debounce((params) => {
    if (params.keyword !== '') {
      getSubDistricts(params);
    }
  }, 700);

  const selectSubDistrict = (params) => {
    setSubDistrict(params || null);
  }

  const getFamilyTypes = async () => {
    const response = await familyTypesApi();
    const result = response.map((item) => ({
      label: item.name,
      value: item.id,
    }));
    setFamilyTypes(result);
  }

  const selectFamilyType = (params) => {
    setFamilyType(params || null);
  }

  const getCompanies = async () => {
    const response = await companiesApi();
    const result = response.map((company) => ({
      label: company.insurance_company_name,
      value: company.insurance_company_id,
      plafones: company.insurance_plafon_group.map((plafon) => ({
        label: plafon,
        value: plafon,
      }))
    }));

    setCompanies(result);
  }

  const selectCompany = (params) => {
    setCompany(params || null);
    setPlafon(null);
    if (params) getPlafones(params);
  }

  const getPlafones = (payload) => {
    const params = payload || (company || null);
    const result = companies.filter((item) => item.value === params.value);
    setPlafones((result[0] && result[0].plafones) || []);
  };

  const selectPlafon = (params) => {
    setPlafon(params || null);
  };

  const selectGender = (params) => {
    setGender(params || null);
  };

  return {
    getCountries,
    getCompanies,
    getBirthCountries,
    getNationalities,
    getFamilyTypes,

    gender,
    selectGender,
    genders,

    getCountriesKeyword,
    country,
    selectCountry,
    countries,

    getBirthCountriesKeyword,
    birthCountry,
    selectBirthCountry,
    birthCountries,

    getNationalitiesKeyword,
    nationality,
    selectNationality,
    nationalities,

    getProvincesKeyword,
    province,
    selectProvince,
    provinces,

    getCitiesKeyword,
    city,
    selectCity,
    cities,

    getDistrictsKeyword,
    district,
    selectDistrict,
    districts,

    getSubDistrictsKeyword,
    subDistrict,
    selectSubDistrict,
    subDistricts,

    company,
    selectCompany,
    companies,

    plafon,
    selectPlafon,
    plafones,
    setPlafones,

    familyType,
    selectFamilyType,
    familyTypes,

    getCountryById,
  }
};

export default ServiceComboBox;
