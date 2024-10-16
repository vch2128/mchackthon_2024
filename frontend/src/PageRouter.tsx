import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import NotFound from './pages/Home/NotFound';
import Home from './pages/Home/Home';
import Tech from './pages/Tech/Tech';
import Emo from './pages/Emo/Emo';
import TechPost from './pages/Tech/TechPost';

const PageRouter = () =>{
    return (
			<>
				<Routes>
					<Route path="/home" element={<Home />} />
					<Route path="/tech" element={<Tech />} />
					<Route path="/tech/post" element={<TechPost />} />
					<Route path="/emo" element={<Emo />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</>
    )
}

export default PageRouter