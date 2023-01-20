import { Route, Routes } from 'react-router-dom'
import './App.css';
import Create from './pages/Create';
import Index from './pages/Index';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Post from './pages/Post'
import EditPost from './pages/EditPost'
import { UserContextProvider } from './UserContext';

function App() {
  return (
    <UserContextProvider>
        <Routes>        
            <Route path="/" element={<Layout />}>
                <Route index element={ <Index/>} />
                <Route path={'/login'} element={<Login/>} />
                <Route path={'/register'} element={<Register />} />
                <Route path={'/register'} element={<Register />} />
                <Route path={'/create'} element={<Create />} />
                <Route path={'/post/:id'} element={<Post />} />
                <Route path={'/edit/:id'} element={<EditPost />} />
            </Route>    
        </Routes>   
    </UserContextProvider>    
  );
}

export default App;
