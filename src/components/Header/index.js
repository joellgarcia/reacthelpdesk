import { useContext } from 'react';
import './header.css';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";

export default function Header(){
    const { user, signOut } = useContext(AuthContext);
    return(
        <div className="sidebar">
            <div className="avatar">
                <img src={user.avatarUrl == null ? avatar : user.avatarUrl} alt="foto avatar"/>
            </div>
            <Link to="/dashboard">
                <FiHome color="FFF" size={24}/>
                Chamados
            </Link>
            <Link to="/customers">
                <FiUser color="FFF" size={24}/>
                Clientes
            </Link>
            <Link to="/profile">
                <FiSettings color="FFF" size={24}/>
                Configurações
            </Link>
            <Link className="logout" to="" onClick={()=>signOut()}>
                <BiLogOut color="FFF" size={24}/>
                Sair
            </Link>
        </div>

    )
}