import { useState } from 'react'
import './App.css'
import { Home } from './pages/Home'
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import { Routes,Route , BrowserRouter} from 'react-router'
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
  
  
}

export default App
