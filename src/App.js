import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './contexts/auth';
import Routes from './routes'

function App() {
  return (
    <AuthProvider>
      <HashRouter>
      <ToastContainer autoClose={3000} />
        <Routes/>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
