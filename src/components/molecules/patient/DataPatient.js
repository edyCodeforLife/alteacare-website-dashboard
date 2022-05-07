import { React, useState, useEffect } from '../../../libraries';
import { connect } from 'react-redux';
import { Api } from '../../../helpers/api';
import { FormatDate } from '../../../helpers/dateFormat';
import { DoctorSpesialist } from '../../molecules';
import { FormPatient, FormNotePatient } from '../../molecules/patient';
import { ButtonDarkGrey, BoxDefault } from '../../atoms';
import {
  ArrowDown,
  UncheckBox,
  AlertClose,
  MagnifierIcon,
} from '../../../assets/images';

const DataPatient = ({ HeightElementReducer }) => {
  const [section, setSection] = useState('frame-1');
  const [sectionSecondHeight, setSectionSecondHeight] = useState('');
  const [simpleBioData, setSimpleBioData] = useState([
    { label: 'Nama', value: '' },
    { label: 'Umur', value: '29 Tahun 3 Bulan' },
    { label: 'Tanggal Lahir', value: '' },
    { label: 'Jenis Kelamin', value: '' },
    { label: 'No. Telp', value: '' },
    { label: 'Email', value: '' },
  ]);

  useEffect(() => {
    if (HeightElementReducer !== null) {
      const elementHeader =
        document.getElementById('element-header').clientHeight;
      setSectionSecondHeight(
        parseInt(HeightElementReducer.heightElement) - parseInt(elementHeader)
      );
    }
  }, [HeightElementReducer]);

  useEffect(() => {
    Api.get('/user/profile/me')
      .then(res => {
        let data = res.data.data;
        let paramSetBio = [...simpleBioData];
        paramSetBio[0].value = data.first_name + ' ' + data.last_name;
        // paramSetBio[1].value = data.first_name+' '+data.last_name
        paramSetBio[2].value = FormatDate(data.user_details.birth_date);
        paramSetBio[3].value = data.user_details.gender;
        paramSetBio[4].value = data.phone;
        paramSetBio[5].value = data.email;
        setSimpleBioData(paramSetBio);
      })
      .catch(function (error) {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickSectionChange = value => {
    setSection(value);
  };

  return (
    <>
      <div id="element-header">
        {/* <LabelTitle text="Order ID : 66870080" fontStyle="font-bold" /> */}
        <div
          className="w-full py-2 px-5 flex"
          style={{ backgroundColor: '#F2F2F5', color: '#6B7588' }}
        >
          <button
            className={`font-bold text-xs ${
              section === 'frame-1' || section === 'frame-2'
                ? 'border-b-2 border-solid'
                : ''
            } py-1 mr-5`}
            style={{ borderColor: '#2C528B' }}
            onClick={() => handleClickSectionChange('frame-1')}
          >
            Pasien
          </button>
          <button
            className={`font-bold text-xs ${
              section === 'frame-3' ? 'border-b-2 border-solid' : ''
            } py-1 mr-5`}
            style={{ borderColor: '#2C528B' }}
            onClick={() => handleClickSectionChange('frame-3')}
          >
            Note
          </button>
          <button
            className={`font-bold text-xs ${
              section === 'frame-4' ||
              section === 'frame-5' ||
              section === 'frame-6' ||
              section === 'frame-7'
                ? 'border-b-2 border-solid'
                : ''
            } py-1`}
            style={{ borderColor: '#2C528B' }}
            onClick={() => handleClickSectionChange('frame-4')}
          >
            Spesialis
          </button>
        </div>
      </div>
      <div
        className="flex flex-wrap overflow-y-auto scroll-small border-l border-solid"
        style={{
          height: sectionSecondHeight !== '' ? sectionSecondHeight + 'px' : '',
          borderColor: '#F2F2F5',
        }}
      >
        <div className="w-full flex flex-wrap">
          {section === 'frame-1' ? (
            <>
              <div className="w-full flex flex-wrap px-5 py-5">
                <BoxDefault
                  className="border border-solid p-3 rounded mb-4 text-xs w-5/6"
                  borderColor="#D12B2B"
                  backgroundColor="#F8E3E3"
                  color="#D12B2B"
                  text="Data pasien belum lengkap, untuk melanjutkan proses selanjutnya silahkan lengkapi data pasien terlebih dahulu."
                />
                <div className="w-8/12">
                  {/* <SimpleBio data={simpleBioData} fontSize="text-xs" /> */}
                </div>
                <div className="w-4/12 flex flex-wrap items-end pb-2">
                  <button
                    className="border border-solid p-2 rounded text-xs"
                    style={{
                      borderColor: '#61C7B5',
                      color: '#61C7B5',
                    }}
                    onClick={() => {}}
                  >
                    Check data patient
                  </button>
                </div>
              </div>
              <FormPatient />
            </>
          ) : (
            ''
          )}
          {section === 'frame-2' ? <DataPatient /> : ''}
          {section === 'frame-3' ? <FormNotePatient /> : ''}
          {section === 'frame-4' ? <DoctorSpesialist /> : ''}
          {section === 'frame-7' ? (
            <div
              className="flex flex-wrap relative w-full"
              style={{ borderColor: '#F2F2F5' }}
            >
              <div className="w-full px-6 pt-2 pb-2 flex flex-wrap items-center">
                <div className="w-11/12 flex flex-wrap items-center">
                  <p className="w-full flex items-center pb-2 font-bold text-left text-sm">
                    <span className="mr-auto">Spesialist</span>
                  </p>
                </div>
                <div className="w-1/12 flex justify-end items-start">
                  <img
                    src={AlertClose}
                    alt="Alert Close"
                    className="w-2/5 cursor-pointer"
                    onClick={() => handleClickSectionChange('frame-5')}
                  />
                </div>
              </div>
              <div className="w-full px-6 pb-4 flex flex-wrap items-center">
                <div className="relative w-full">
                  <button className="absolute z-10 left-0 inset-y-0 ml-4 focus:outline-none">
                    <img
                      src={MagnifierIcon}
                      alt="Magnifier Icon"
                      className="w-4"
                    />
                  </button>
                  <input
                    type="text"
                    className="w-full py-1 pl-10 pr-3 rounded-full focus:outline-none"
                    style={{ backgroundColor: '#F2F2F5' }}
                  />
                </div>
              </div>
              <div className="w-full px-4 pb-4">
                <div
                  className="border-b border-solid py-2 my-1 flex flex-wrap items-center px-3"
                  style={{ borderColor: '#BDBDBD' }}
                >
                  <div className="w-11/12 flex items-center pr-5">
                    <p className="text-sm mr-auto">Dokter Umum</p>
                    <img src={ArrowDown} alt="Arrow Down" className="ml-auto" />
                  </div>
                  <div className="w-1/12">
                    <img
                      src={UncheckBox}
                      alt="Uncheck Box Icon"
                      className="mx-auto"
                    />
                  </div>
                </div>
                <div
                  className="border-b border-solid py-2 my-1 flex flex-wrap items-center px-3"
                  style={{ borderColor: '#BDBDBD' }}
                >
                  <div className="w-11/12 flex items-center pr-5">
                    <p className="text-sm mr-auto">Spesialis Anak</p>
                    <img src={ArrowDown} alt="Arrow Down" className="ml-auto" />
                  </div>
                  <div className="w-1/12">
                    <img
                      src={UncheckBox}
                      alt="Uncheck Box Icon"
                      className="mx-auto"
                    />
                  </div>
                </div>
                <div
                  className="border-b border-solid py-2 my-1 flex flex-wrap items-center px-3"
                  style={{ borderColor: '#BDBDBD' }}
                >
                  <div className="w-11/12 flex items-center pr-5">
                    <p className="text-sm mr-auto">Spesialis THT</p>
                    <img src={ArrowDown} alt="Arrow Down" className="ml-auto" />
                  </div>
                  <div className="w-1/12">
                    <img
                      src={UncheckBox}
                      alt="Uncheck Box Icon"
                      className="mx-auto"
                    />
                  </div>
                </div>
                <div
                  className="border-b border-solid py-2 my-1 flex flex-wrap items-center px-3"
                  style={{ borderColor: '#BDBDBD' }}
                >
                  <div className="w-11/12 flex items-center pr-5">
                    <p className="text-sm mr-auto">Dokter Umum</p>
                    <img src={ArrowDown} alt="Arrow Down" className="ml-auto" />
                  </div>
                  <div className="w-1/12">
                    <img
                      src={UncheckBox}
                      alt="Uncheck Box Icon"
                      className="mx-auto"
                    />
                  </div>
                </div>
                <div
                  className="border-b border-solid py-2 my-1 flex flex-wrap items-center px-3"
                  style={{ borderColor: '#BDBDBD' }}
                >
                  <div className="w-11/12 flex items-center pr-5">
                    <p className="text-sm mr-auto">Spesialis Anak</p>
                    <img src={ArrowDown} alt="Arrow Down" className="ml-auto" />
                  </div>
                  <div className="w-1/12">
                    <img
                      src={UncheckBox}
                      alt="Uncheck Box Icon"
                      className="mx-auto"
                    />
                  </div>
                </div>
                <div
                  className="border-b border-solid py-2 my-1 flex flex-wrap items-center px-3"
                  style={{ borderColor: '#BDBDBD' }}
                >
                  <div className="w-11/12 flex items-center pr-5">
                    <p className="text-sm mr-auto">Spesialis THT</p>
                    <img src={ArrowDown} alt="Arrow Down" className="ml-auto" />
                  </div>
                  <div className="w-1/12">
                    <img
                      src={UncheckBox}
                      alt="Uncheck Box Icon"
                      className="mx-auto"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full px-5 pb-2 absolute bottom-0">
                <ButtonDarkGrey text="Apply" dimension="w-full" />
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  HeightElementReducer: state.HeightElementReducer.data,
});

export default connect(mapStateToProps, null)(DataPatient);
