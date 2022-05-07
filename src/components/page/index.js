import { lazy } from '../../libraries'

const Home = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./Home")), 500)
  })
})

const Login = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./Login")), 500)
  })
})

const SelectRole = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./SelectRole")), 500)
  })
})

const Call = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./Call")), 500)
  })
})

const Appointment = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./Appointment")), 500)
  })
})

const DataPatientPage = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./DataPatientPage")), 500)
  })
})

const AppointmentSpecialist = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./AppointmentSpecialist")), 500)
  })
})

const Message = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./Message")), 500)
  })
})

const ManagePassword = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./configuration/ManagePassword")), 500)
  })
})

const SpecialistCall = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./SpecialistCall")), 500)
  })
})

const SpecialistCallEnd = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./SpecialistCallEnd")), 500)
  })
})

export {
  Login,
  Home,
  Call,
  Appointment,
  DataPatientPage,
  AppointmentSpecialist,
  Message,
  SelectRole,
  ManagePassword,
  SpecialistCall,
  SpecialistCallEnd
}
