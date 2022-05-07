import users from '../../../assets/images/users.png';

const EmptyFamilyMemberList = () => (
  <div className="w-full h-full flex justify-center items-center">
    <div className="inline-block text-center">
      <img src={users} alt="users icon" className="mb-5 mx-auto" />
      <p className="text-sm text-dark3">Tidak ada daftar keluarga saat ini</p>
    </div>
  </div>
);

export default EmptyFamilyMemberList;
