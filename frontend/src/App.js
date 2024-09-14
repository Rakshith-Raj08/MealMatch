import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AboutWebsite from './components/AboutWebsite';
import AboutDeveloper from './components/AboutDeveloper';
import Header from './components/Header';
import SearchByIngredients from './components/SearchByIngredients';
import SearchRecipes from  './components/SearchRecipes' ;
import GyMeals from './components/gymmeals.js' ; 
import './index.css'; // Ensure  this import is correct

const App = () => {
  return (
    <Router>
      <Header />
      <div className="app-container"> {/* Ensure this class is applied */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about-website" element={<AboutWebsite />} />
          <Route path="/about-developer" element={<AboutDeveloper />} />
          <Route path="/search-by-ingredients" element={<SearchByIngredients />} />
          <Route path="/search-recipes" element={<SearchRecipes />} />
          <Route path="/gym-meals" element={<GyMeals />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
