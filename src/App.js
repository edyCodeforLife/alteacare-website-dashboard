/* eslint-disable react-hooks/exhaustive-deps */
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  useEffect,
  useLayoutEffect,
  Suspense,
} from './libraries';
import { connect } from 'react-redux';
import { HeightElement } from './modules/actions';
import './assets/tailwind/tailwind.output.css';
import './App.css';
import { LocalStorage } from './helpers/localStorage';
import {
  Login,
  SelectRole,
  Home,
  Call,
  Appointment,
  DataPatientPage,
  AppointmentSpecialist,
  Message,
  ManagePassword,
  SpecialistCall,
  SpecialistCallEnd,
} from './components/page';
import { Loading } from './components/molecules';
import useLogin from './hooks/useLogin';

const App = ({ HeightElement }) => {
  const { loggedIn } = useLogin();
  let role = LocalStorage('role');

  const setHeight = () => {
    const heightWindow = window.innerHeight;
    HeightElement({ heightElement: parseInt(heightWindow) - 78 });
  };

  useEffect(() => {
    setHeight();
  }, []);

  const updateSize = () => {
    setHeight();
  };

  useLayoutEffect(() => {
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const opera =
      (!!window.opr && !!window.opr.addons) ||
      !!window.opera ||
      navigator.userAgent.indexOf(' OPR/') >= 0;
    const ie = /*@cc_on!@*/ false || !!document.documentMode;
    const edge = !ie && !!window.StyleMedia;

    if (opera || ie || edge) {
      alert('Web ini tidak mendukung browser yang anda gunakan');
      window.history.back(-1);
    }
  }, []);

  const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props =>
          loggedIn ? <Component {...props} /> : <Redirect to={{ pathname: '/' }} />
        }
      />
    );
  };

  const GuestRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props =>
          loggedIn ? (
            <Redirect
              to={{ pathname: `/${role === 'PRO' || role === 'DOCTOR' ? 'appointment' : ''}` }}
            />
          ) : (
            <Component {...props} />
          )
        }
      />
    );
  };

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <GuestRoute exact path="/" component={SelectRole} />
        <GuestRoute exact path="/login" component={Login} />
        <GuestRoute exact path="/forgot-password" component={ManagePassword} />
        {role === 'DOCTOR' && (
          <>
            <PrivateRoute exact path="/appointment" component={AppointmentSpecialist} />
            <PrivateRoute exact path="/call/:token" component={SpecialistCall} />
            <PrivateRoute exact path="/call-end" component={SpecialistCallEnd} />
          </>
        )}
        {role === 'MA' && (
          <>
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/call/:token" component={Call} />
          </>
        )}
        {(role === 'PRO' || role === 'MA') && (
          <>
            <PrivateRoute exact path="/appointment" component={Appointment} />
            <PrivateRoute exact path="/users" component={DataPatientPage} />
          </>
        )}
        <PrivateRoute exact path="/message" component={Message} />
        <PrivateRoute exact path="/change-password" component={ManagePassword} />
      </Suspense>
    </Router>
  );
};

const reducer = {
  HeightElement,
};

export default connect(null, reducer)(App);
