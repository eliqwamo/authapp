import React, {useEffect, useState} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { auth } from './utilis/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import Authentication from './screens/Authentication'
import Dashboard from './screens/Dashboard'

const App = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
  })

  return (
    <>
      <Router>
        <Routes>
          {
            user 
              ? (
                <Route path="/dashboard" element={<Dashboard />} />
              ) 
              : (
                <Route path="/" element={<Authentication />} />
              )
          }
        </Routes>
      </Router>
    </>
  )
}

export default App