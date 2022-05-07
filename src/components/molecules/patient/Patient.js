import { React } from '../../../libraries';
import moment from 'moment';

const PatientScreen = ({ firstName, lastName, age, birthDate, gender, phone, email, cardId, address, photo, contactPhone, contactEmail }) => {
  return (
    <>
      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
        <div className="xl:w-2/6 w-5/12 flex">
          Nama <span className="ml-auto">:</span>
        </div>
        <div className="xl:w-4/6 w-7/12 px-3">{firstName} {lastName}</div>
      </div>
      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
        <div className="xl:w-2/6 w-5/12 flex">
          Umur <span className="ml-auto">:</span>
        </div>
        <div className="xl:w-4/6 w-7/12 px-3">{`${age.year} Tahun ${age.month} Bulan`}</div>
      </div>
      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
        <div className="xl:w-2/6 w-5/12 flex">
          Tanggal Lahir <span className="ml-auto">:</span>
        </div>
        <div className="xl:w-4/6 w-7/12 px-3">{moment(birthDate).format("DD/MM/YYYY")}</div>
      </div>
      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
        <div className="xl:w-2/6 w-5/12 flex">
          Jenis Kelamin <span className="ml-auto">:</span>
        </div>
        <div className="xl:w-4/6 w-7/12 px-3">{gender}</div>
      </div>
      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
        <div className="xl:w-2/6 w-5/12 flex">
          No. Telp <span className="ml-auto">:</span>
        </div>
        <div className="xl:w-4/6 w-7/12 px-3">{phone}</div>
      </div>
      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
        <div className="xl:w-2/6 w-5/12 flex">
          Email <span className="ml-auto">:</span>
        </div>
        <div className="xl:w-4/6 w-7/12 px-3">{email}</div>
      </div>
      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
        <div className="xl:w-2/6 w-5/12 flex">
          No. Whatsapp <span className="ml-auto">:</span>
        </div>
        <div className="xl:w-4/6 w-7/12 px-3">{contactPhone || phone || '-'}</div>
      </div>
      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
        <div className="xl:w-2/6 w-5/12 flex">
          Email Lainnya <span className="ml-auto">:</span>
        </div>
        <div className="xl:w-4/6 w-7/12 px-3">{contactEmail || email || '-'}</div>
      </div>
      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
        <div className="xl:w-2/6 w-5/12 flex">
          Nomor KTP <span className="ml-auto">:</span>
        </div>
        <div className="xl:w-4/6 w-7/12 px-3">{cardId}</div>
      </div>
      <div className="flex flex-wrap items-start xl:text-sm text-xs mb-2 text-dark3">
        <div className="xl:w-2/6 w-5/12 flex">
          Alamat <span className="ml-auto">:</span>
        </div>
        <div className="xl:w-4/6 w-7/12 px-3">{address}</div>
      </div>
      {photo ?
        <div className="flex flex-wrap items-start xl:text-sm text-xs my-4" style={{ color: "#8F90A6" }}>
          <div className="w-5/6 flex flex-wrap font-bold">
            <p className="w-full">Photo KTP</p>
            <div className="w-full mt-2">
              <img src={photo} alt="Ktp" className="w-full" />
            </div>
          </div>
        </div>
      : ""}
    </>
  );
};

PatientScreen.defaultProps = {
  firstName: null,
  lastName: null,
  age: { month: null, year: null },
  birthDate: null,
  gende: null,
  phone: null,
  email: null,
  cardId: null,
  address: null,
  photo: null,
  contactPhone: null,
  contactEmail: null,
};

export default PatientScreen;
