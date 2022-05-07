import { React, useEffect, useState, useHistory } from '../../libraries'
import { TokenCreate } from '../../modules/actions'
import { connect } from 'react-redux'
import { Footer } from '../molecules/layout'
import { BgFirstPage, Logo, MaIcon, ProIcon, SpIcon } from '../../assets/images'

const SelectRole = ({ HeightElementReducer, TokenCreate, TokenReducer }) => {
  const history = useHistory()
  const [HeightElement, setHeightElement] = useState("")
  const [role1] = useState({role: "MA", roleName: "Medical Advisor"})
  const [role2] = useState({role: "PRO", roleName: "Patient Relation Officer"})
  const [role3] = useState({role: "DOCTOR", roleName: "Spesialist"})

  useEffect(() => {
    if(HeightElementReducer !== null){
      setHeightElement(parseInt(HeightElementReducer.heightElement))
    }
  }, [HeightElementReducer])

  // select role
  const handleRole = (value) => {
    history.push('/login', {
      role: value.role,
      name: value.roleName
    })
  }

  return (
    <>
      <div
        className="fixed w-full h-full flex flex-wrap overflow-auto"
        style={{
          backgroundImage: "linear-gradient(#FFFFFF, #FFFFFF, #FFFFFF, #D6EDF6)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div
          className="w-full flex flex-wrap items-center overflow-auto small-scroll lg:px-0 px-5"
          style={{
            height: HeightElement !== "" ? HeightElement+"px" : ""
          }}
        >
          <div className="w-full flex flex-wrap items-start">
            <div className="w-full relative z-10 flex justify-center mb-6">
              <img src={Logo} alt="Logo" />
            </div>
            <div className="relative z-10 inset-x-auto xl:w-1/3 lg:w-1/2 sm:w-3/4 px-8 w-full mx-auto bg-white rounded-lg shadow-lg border border-solid border-grey-200" style={{ boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1)" }}>
              <div className="mb-12 mt-2 pt-16 px-8">
                <p className="text-center text-darker text-sm mb-6">
                  Halo, Silahkan masuk sesuai dengan role Anda
                </p>
                <p className="text-center text-sm">Pilih salah satu untuk masuk ke<br />Alteacare consultation dashboard</p>
              </div>
              <div className="flex flex-wrap pb-16">
                <div className="w-1/3 px-4">
                  <button onClick={() => handleRole(role1)} className="w-full flex flex-wrap px-2 py-6 justify-center border-2 border-dark4 hover:border-darker rounded">
                    <img src={MaIcon} alt="Medical Advisor Icon" />
                  </button>
                  <p className="w-full text-xs mt-3 text-center">Medical<br />Advisor (MA)</p>
                </div>
                <div className="w-1/3 px-4">
                  <button onClick={() => handleRole(role2)} className="w-full flex flex-wrap px-2 py-6 justify-center border-2 border-dark4 hover:border-darker rounded">
                    <img src={ProIcon} alt="Patient Realtion Officer Icon" />
                  </button>
                  <p className="w-full text-xs mt-3 text-center">Patien Relation<br />Officer (PRO)</p>
                </div>
                <div className="w-1/3 px-4">
                  <button onClick={() => handleRole(role3)} className="w-full flex flex-wrap px-2 py-6 justify-center border-2 border-dark4 hover:border-darker rounded">
                    <img src={SpIcon} alt="Spesialist Icon" />
                  </button>
                  <p className="w-full text-xs mt-3 text-center py-2">Spesialist</p>
                </div>
              </div>
            </div>
          </div>
          <img src={BgFirstPage} alt="Bg First Page" className="absolute bottom-0 -inset-x-0 mx-auto" />
        </div>
        <Footer />
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  HeightElementReducer: state.HeightElementReducer.data,
  TokenReducer: state.TokenReducer.data
})

const mapDispatchToProps = {
  TokenCreate
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectRole)
