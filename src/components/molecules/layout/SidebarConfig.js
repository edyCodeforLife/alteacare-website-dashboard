import { React } from '../../../libraries'
import { Link } from 'react-router-dom'

const SidebarConfig = () => {
  return (
    <div className="side-configuration flex flex-wrap bg-light4">
      <div className="w-full">
        <div className="my-8 px-6">
          <p className="font-bold text-lg text-dark2">Pengaturan</p>
          <div className="my-2">
            <Link to="/change-password" className="text-dark2">Ubah Password</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarConfig