// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import SearchRecipes from './components/SearchRecipes';
import SearchByIngredients from './components/SearchByIngredients';
import './index.css';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search-recipes" element={<SearchRecipes />} />
        <Route path="/search-ingredients" element={<SearchByIngredients />} />
      </Routes>
    </Router>
  );
};

export default App;
