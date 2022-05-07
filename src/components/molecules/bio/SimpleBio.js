import moment from 'moment';

const SimpleBio = ({ data, image }) => {
  if (!data) return null;

  const rawGender = data.user_details?.gender || data.gender;
  const gender = rawGender === 'MALE' ? 'Laki-laki' : 'Perempuan';
  const year = data.user_details?.age?.year ?? data.age?.year ?? 0;
  const month = data.user_details?.age?.month ?? data.age?.month ?? 0;
  const age = `${year} Tahun ${month} Bulan`;
  const birthDate = data.user_details?.birth_date || data.birth_date;
  const { phone, email } = data;
  const idCard = data.user_details?.id_card || data.card_id || '-';
  const idCardPhoto = data.user_details?.photo_id_card?.formats || data.card_photo?.formats || {};

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 text-dark3 text-xs xl:text-sm">
        <p className="xl:w-2/6 w-5/12 flex">
          Nama <span className="ml-auto">:</span>
        </p>
        <p className="flex-1">
          {data.first_name} {data.last_name}
        </p>
      </div>
      <div className="flex gap-3 text-dark3 text-xs xl:text-sm">
        <p className="xl:w-2/6 w-5/12 flex">
          Umur <span className="ml-auto">:</span>
        </p>
        <p className="flex-1">{age}</p>
      </div>
      <div className="flex gap-3 text-dark3 text-xs xl:text-sm">
        <p className="xl:w-2/6 w-5/12 flex">
          Tanggal Lahir <span className="ml-auto">:</span>
        </p>
        <p className="flex-1">{moment(birthDate).format('DD/MM/YYYY')}</p>
      </div>
      <div className="flex gap-3 text-dark3 text-xs xl:text-sm">
        <p className="xl:w-2/6 w-5/12 flex">
          Jenis Kelamin <span className="ml-auto">:</span>
        </p>
        <p className="flex-1">{gender}</p>
      </div>
      <div className="flex gap-3 text-dark3 text-xs xl:text-sm">
        <p className="xl:w-2/6 w-5/12 flex">
          No. Telp <span className="ml-auto">:</span>
        </p>
        <p className="flex-1">{phone}</p>
      </div>
      <div className="flex gap-3 text-dark3 text-xs xl:text-sm">
        <p className="xl:w-2/6 w-5/12 flex">
          Email <span className="ml-auto">:</span>
        </p>
        <p className="flex-1">{email}</p>
      </div>
      <div className="flex gap-3 text-dark3 text-xs xl:text-sm">
        <p className="xl:w-2/6 w-5/12 flex">
          Nomor KTP <span className="ml-auto">:</span>
        </p>
        <p className="flex-1">{idCard}</p>
      </div>
      <div className="flex gap-3 text-dark3 text-xs xl:text-sm">
        <p className="xl:w-2/6 w-5/12 flex">
          Alamat <span className="ml-auto">:</span>
        </p>
        <p className="flex-1">
          {data.user_addresses?.length > 0 ? (
            <>
              {data.user_addresses
                .filter(({ type }) => type === 'PRIMARY')
                .map((address, idx) => (
                  <span key={idx}>
                    {`${address.street}, Blok RT/RW ${address.rt_rw} Kel.${address.sub_district?.name} Kec.${address.district?.name} ${address.city?.name} ${address.province?.name}`}
                  </span>
                ))}
            </>
          ) : (
            '-'
          )}
        </p>
      </div>
      {image && idCardPhoto?.small && (
        <div className="flex flex-col gap-2 text-dark3 text-xs xl:text-sm font-bold">
          <p>Photo KTP</p>
          <img src={idCardPhoto?.small} alt="Ktp" className="w-full" />
        </div>
      )}
    </div>
  );
};

SimpleBio.defaultProps = {
  image: false,
};

export default SimpleBio;
