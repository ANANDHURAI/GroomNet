import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './reduxStore/store';
import Register from './CommonPages/Register';
import Home from './CommonPages/Home';
import LoginPage from './CommonPages/LoginPage';
import LandingPage from './CommonPages/LandingPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />}/>
          <Route path='/login/:userType' element={<LoginPage />}/>
          <Route path='/register/:userType' element={<Register />}/>
          <Route path='/home' element={<Home />}/>
        </Routes>
      </Router>
    </Provider>
  )
}

export default App

