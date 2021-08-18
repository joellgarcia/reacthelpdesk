import { useState, useEffect, useContext } from "react";
import "./new.css";
import Header from "../../components/Header";
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { FiPlusCircle } from 'react-icons/fi';
import { useHistory, useParams } from 'react-router-dom';

export default function New() {
    const { id } = useParams();
    const history = useHistory();
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');
    const { user } = useContext(AuthContext);
    const [customers, setCustomers] = useState([]);
    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customerSelected, setCusumerSelected] = useState(0);
    const [idCustomer, setIdCustomer] = useState(false);
    
    useEffect(()=>{
        async function loadCustomers() {
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot)=>{
                let lista = [];
                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })
                if(lista.length === 0){
                    toast.warn('Nenhuma empresa encontrada.')
                    setCustomers([{id: '1', nomeFantasia: 'Freela'}])
                    setLoadCustomers(false);
                    return;
                }
                setCustomers(lista);
                setLoadCustomers(false);

                if(id){
                    loadId(lista);
                }

            })
            .catch((error)=>{
                toast.error('Deu algum erro!', error)
                setLoadCustomers(false);
                setCustomers([{id: '1', nomeFantasia: ''}])
            })
        }
        loadCustomers();

    },[id]);

    async function loadId(lista) {
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);
            setCusumerSelected(lista.findIndex(item => item.id === snapshot.data().clienteId));
            setIdCustomer(true);
        })
        .catch((error)=>{
            toast.error('Erro no Id passado.', error)
            setIdCustomer(false);
            history.push('/dashboard');
        })
    }

    async function handleRegister(e) {
        e.preventDefault();

        if(idCustomer){
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(()=>{
                toast.success('Chamado alterado com sucesso!');
                setCusumerSelected(0);
                setComplemento('');
                history.push('/dashboard');
            })
            .catch((error)=>{
                toast.error('Erro ao atualizar o chamado.', error);
            })
            return;
        }

        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
        .then(()=>{
            toast.success('Chamado criado com sucesso!');
            setComplemento('');
            setCusumerSelected(0);
        })
        .catch((error)=>{
            toast.error('Deu algum erro.', error);
        })
    }

    function handleChangeSelect(e) {
        setAssunto(e.target.value);
    }

    function handleOptionChange(e) {
        setStatus(e.target.value);
    }

    function handleChangeCustomers(e){
        setCusumerSelected(e.target.value);
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Novo Chamado">
                    <FiPlusCircle size={25}/>
                </Title>
                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Clientes</label>
                        {loadCustomers ? (
                            <input type="text" disabled={true} value="Carregando clientes..."/>
                        ) : (
                                <select value={customerSelected} onChange={handleChangeCustomers}>
                                    {customers.map((item, index)=>{
                                        return(
                                            <option key={item.id} value={index}>
                                                {item.nomeFantasia}
                                            </option>
                                        )
                                    })}
                            </select>
                        )}
                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Técnica">Visita Técnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>
                        <label>Status</label>
                        <div className="status">
                            <input type="radio" name="radio" value="Aberto" onChange={handleOptionChange} checked={status === 'Aberto'}/>
                            <span>Em Aberto</span>
                            <input type="radio" name="radio" value="Progresso" onChange={handleOptionChange} checked={status === 'Progresso'} />
                            <span>Progresso</span>
                            <input type="radio" name="radio" value="Atendido" onChange={handleOptionChange} checked={status === 'Atendido'} />
                            <span>Atendido</span>
                        </div>
                        <label>Complemento</label>
                        <textarea type="text" placeholder="Descreva seu problema (opcional)" value={complemento} onChange={(e)=> setComplemento(e.target.value)}/>
                        <button type="submit">Salvar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}