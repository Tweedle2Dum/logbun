import { useState } from 'react'
import './App.css'
import DataGrid from '../components/DataGrid'
import LiveDataGrid from '../components/LiveDataGrid';
import { BrowserRouter,Routes,Route } from "react-router-dom";

function App() {

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/"  element={<DataGrid/>}/> 
        <Route path="/live"  element={<LiveDataGrid/>}/> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
