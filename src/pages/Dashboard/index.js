import './dashboard.css';
import { useState, useEffect } from "react";

import Header from "../../components/Header";
import Title from '../../components/Title';
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import Modal from "../../components/Modal";

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export default function Dashboard(){
    const [ chamados, setCahamdos ] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty]= useState(false);
    const [lastDocs ,setLastDocs] = useState();
    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(()=>{
        async function loadChamados() {
            await listRef.limit(5)
            .get()
            .then((snapshot)=>{
                updateState(snapshot);
            })
            .catch((error)=>{
                toast.error("Deu algum erro: ", error);
                setLoadingMore(false);
            })
            setLoading(false);
        }

        loadChamados();
        return()=>{
        }
    }, []);

    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;
        if(!isCollectionEmpty){
            let lista = [];
            snapshot.forEach((doc)=>{
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })
            const lastDoc = snapshot.docs[snapshot.docs.length -1];
            setCahamdos(chamados => [...chamados, ...lista])
            setLastDocs(lastDoc);
        } else {
            setIsEmpty(true);
        }
        setLoadingMore(false);
    }

    async function handleMore(){
        setLoadingMore(true);
        await listRef.startAfter(lastDocs).limit(5)
        .get()
        .then((snapshot)=>{
            updateState(snapshot);
        })
    }

    function togglePostModal(item) {
        setShowPostModal(!showPostModal);
        setDetail(item);
    }

    if(loading){
        return(
            <div>
                <Header/>
                <div className="content">
                    <Title name="Atendimentos">
                        <FiMessageSquare size={25}/>
                    </Title>
                    <div className="container dashboard">
                        <span>Carregando chamados...</span>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Atendimentos">
                    <FiMessageSquare size={25}/>
                </Title>
                {chamados.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum chamado registrado...</span>
                        <Link to="/new" className="new">
                            <FiPlus size={25} color="#FFF" />
                            Novo chamado
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link to="/new" className="new">
                            <FiPlus size={25} color="#FFF" />
                            Novo chamado
                        </Link>
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Assunto</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Cadastrado em:</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chamados.map((item, index)=>{
                                    return(
                                        <tr key={index}>
                                            <td data-label="Cliente">{item.cliente}</td>
                                            <td data-label="Assunto">{item.assunto}</td>
                                            <td data-label="Status">
                                                <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>{item.status}</span>
                                            </td>
                                            <td data-label="Cadastrado">{item.createdFormated}</td>
                                            <td data-label="#">
                                                <button className="action" onClick={()=>togglePostModal(item)}>
                                                    <FiSearch color="#FFF" size={17} />
                                                </button>
                                                <Link className="action-a" to={`/new/${item.id}`} >
                                                    <FiEdit2 color="#FFF" size={17} />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {loadingMore && <h3 className="carregando-chamados">Buscando chamados</h3>}
                        {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Carregar mais</button>}
                    </>
                )}
            </div>
            {showPostModal && (
                <Modal conteudo={detail} close={togglePostModal} />
            )}
        </div>
    )
}