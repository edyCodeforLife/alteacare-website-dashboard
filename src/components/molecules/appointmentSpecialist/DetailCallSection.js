import { React, useState, useEffect } from '../../../libraries';
import moment from 'moment';

import { Api } from '../../../helpers/api';
import { LocalStorage } from '../../../helpers/localStorage';

import { LabelTitle } from '../../atoms';
// import { SimpleBio } from '../../molecules/bio';
import PatientScreen from '../../molecules/patient/Patient';
import { LoadingComponent } from '../../molecules';

const DetailCallSection = ({ data, sectionFirstHeight, counter }) => {
  const [tab, setTab] = useState(1);
  const [patientData, setPatientData] = useState(null);
  const [heightContent, setHeightContent] = useState(0);
  const [heightContentNote, setHeightContentNote] = useState(0);
  const [consultationSelect, setConsultationSelect] = useState(null);

  useEffect(() => {
    if (sectionFirstHeight) {
      const heightHeader = document.getElementById("header-section-form-patient").clientHeight;
      const heightHeaderFooterNote = document.getElementById("footer-note").clientHeight;
      setHeightContent(sectionFirstHeight - parseInt(heightHeader));
      setHeightContentNote(sectionFirstHeight - parseInt(heightHeader) - parseInt(heightHeaderFooterNote));
    }
  }, [sectionFirstHeight]);

  const settingPatientData = (item) => {
    const birthDate = item.birthdate || item.birth_date;
    const phone = item.phone_number || item.phone;
    let addressData = item.address_raw ? item.address_raw[0] : null;

    if (!addressData) {
      addressData = {
        street: item.street,
        rt_rw: item.rt_rw,
        sub_district: item.sub_district,
        district: item.district,
        city: item.city,
        province: item.province,
      }
    }

    setPatientData({
      id: item.id,
      age: item.age,
      email: item.email,
      phone: phone,
      cardId: item.card_id,
      lastName: item.last_name,
      birthDate: birthDate,
      firstName: item.first_name,
      gender: item.gender === 'MALE' ? 'Laki-laki' : 'Perempuan',
      photo: item.card_photo ? item.card_photo.url : '',
      address:
        `${addressData.street},
        Blok RT/RW ${addressData.rt_rw}
        kel.${addressData.sub_district ? addressData.sub_district.name : ''}
        Kec.${addressData.district ? addressData.district.name : ''}
        ${addressData.city ? addressData.city.name : ''}
        ${addressData.province ? addressData.province.name : ''}`,
      contactEmail: item.contact_email,
      contactPhone: item.contact_phone,
    });
  }

  useEffect(() => {
    if (data && data.appointmentId) {
      Api.get(`/appointment/v1/consultation/${data.appointmentId}`, {
        headers: { "Authorization": `Bearer ${LocalStorage('access_token')}` }
      })
      .then(response => {
        const item = response.data.data;
        if (item && item.patient) settingPatientData(item.patient);
        setConsultationSelect(item);
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.appointmentId]);

  const handleBack = () => {
    setConsultationSelect(null)
    counter({ backSectionDetailCall: true })
  };

  const handleViewFile = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="w-full">
      <div id="header-section-form-patient">
        <LabelTitle
          text={`Order ID : ${consultationSelect && consultationSelect.order_code}`}
          fontStyle="font-bold text-base"
          buttonBack={() => handleBack()} />
      </div>
      <div className="flex pt-2 px-5 bg-light3 text-dark2">
        <button
          className={`font-bold text-xs ${tab === 1 ? "border-b-2" : ""} border-solid border-info2 py-1 mr-5`}
          onClick={() => setTab(1)}
        >Pasien</button>
        <button
          className={`font-bold text-xs ${tab === 2 ? "border-b-2" : ""} border-solid border-info2 py-1 mr-5`}
          onClick={() => setTab(2)}
        >Note</button>
        <button
          className={`font-bold text-xs ${tab === 3 ? "border-b-2" : ""} border-solid border-info2 py-1`}
          onClick={() => setTab(3)}
        >Lampiran</button>
      </div>
      <div className="flex flex-wrap relative overflow-y-auto scroll-small" style={{ height: `${heightContent}px` }}>
        <div className={`relative w-full flex flex-wrap px-5 py-5 ${tab === 1 ? "block" : "hidden"}`}>
          {
            patientData
            ? (
              <div className="lg:w-1/3 md:w-1/2 w-2/3">
                 <PatientScreen
                    age={patientData.age}
                    photo={patientData.photo}
                    email={patientData.email}
                    phone={patientData.phone}
                    gender={patientData.gender}
                    cardId={patientData.cardId}
                    address={patientData.address}
                    lastName={patientData.lastName}
                    birthDate={patientData.birthDate}
                    firstName={patientData.firstName}
                    contactEmail={patientData.contactEmail}
                    contactPhone={patientData.contactPhone}
                  />
                <div className="pb-5"></div>
              </div>
            ) : (
              <div className="w-full h-full absolute inset-0 bg-white z-10">
                <LoadingComponent />
              </div>
            )
          }
        </div>

        <div className={`sm:w-2/3 w-full px-5 py-5 ${tab === 2 ? "block" : "hidden"}`}>
          <div style={{ height: `${heightContentNote}px` }}>
            {consultationSelect && consultationSelect.symptom_note !== "" ?
              <p className="text-black">{consultationSelect.symptom_note}</p>
            :
              <p className="text-mainColor">Tidak ada Catatan</p>
            }
          </div>
          <div id="footer-note" className="text-dark3 leading-snug text-sm">
            <p className="pt-5">Note by &nbsp;:&nbsp;
              {consultationSelect && consultationSelect.notes_by ?
                `${consultationSelect.notes_by.first_name} ${consultationSelect.notes_by.last_name}`
              : "-"}
            </p>
            <p>
              Date &nbsp;:&nbsp;
              {consultationSelect && consultationSelect.notes_at ?
                moment(`${consultationSelect.notes_at}`).format("DD/MM/YYYY")
              : "-"}
            </p>
            <p className="pb-5">
              Time &nbsp;:&nbsp;
              {consultationSelect && consultationSelect.notes_at ?
                moment(`${consultationSelect.notes_at}`, "HH:mm:ss").format("HH:mm")
              : "-"}
            </p>
          </div>
        </div>

        <div className={`sm:w-2/3 w-full px-5 py-5 ${tab === 3 ? "block" : "hidden"}`}>
          { consultationSelect
            && consultationSelect.medical_document
            && consultationSelect.medical_document.length > 0 ?
            consultationSelect.medical_document.map((res, idx) => {
              return(
                <div key={idx} className="flex flex-wrap py-4 border-b border-gray-100">
                  <div className="w-2/5">
                    <p className="font-bold text-sm truncate text-black">{res.original_name}</p>
                  </div>
                  <div className="w-2/5">
                    <p className="text-sm text-center text-dark3">{res.size}kb</p>
                  </div>
                  <div className="w-1/5 flex justify-end">
                    <button className="text-sm text-mainColor" onClick={() => handleViewFile(res.url)}>Lihat</button>
                  </div>
                </div>
              )
            })
          :
            <p className="text-mainColor">Tidak ada Lampiran</p>
          }
        </div>
      </div>
    </div>
  );
};

export default DetailCallSection;
