import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import SinglePost from "./components/SinglePost";
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
<>
   
    <Router>
     <Navbar />
      <div>

        <Routes>
        <Route  path="/" element={<Home />} />
				<Route  path="/login" element={<Login />} />
				<Route  path="/dashboard/:userName" element={<Dashboard />} />
				<Route path="/post/:id" element={<SinglePost />} />
     
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
