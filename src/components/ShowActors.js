import React,{useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowActors = () => {
    const url='http://localhost:8080/actor';
    const [actors,setActors]= useState([]);
    const [id,setId]= useState('');
    const [name,setName]= useState('');
    const [nationality,setNationality]= useState('');
    const [operation,setOperation]= useState(1);
    const [title,setTitle]= useState('');

    useEffect( ()=>{
        getActors();
    },[]);

    const getActors = async () => {
        const respuesta = await axios.get(url);
        setActors(respuesta.data);
    }
    const openModal = (op,id, name, nationality) =>{
        setId('');
        setName('');
        setNationality('');
        setOperation(op);
        if(op === 1){
            setTitle('Registrar Actor');
        }
        else if(op === 2){
            setTitle('Editar Actor');
            setId(id);
            setName(name);
            setNationality(nationality);
        }
        window.setTimeout(function(){
            document.getElementById('nombre').focus();
        },500);
    }
    const validar = () => {
        var parametros;
        var metodo;
        var queryParams ="";
        if(name.trim() === ''){
            show_alerta('Escribe el nombre del actor','warning');
        }
        else if(nationality.trim() === ''){
            show_alerta('Escribe la nacionalidad del actor','warning');
        }

        else{
            if(operation === 1){
                parametros= {name:name.trim(),nationality: nationality.trim()};
                metodo= 'POST';
            }
            else{
                parametros={id:id,name:name.trim(),nationality: nationality.trim()};
                metodo= 'PUT';
            }
            enviarSolicitud(metodo,parametros,queryParams);
        }
    }
    const enviarSolicitud = async(metodo,parametros,queryParams) => {
        var urlActor = url+queryParams;
        await axios({ method:metodo, url: urlActor, data:parametros}).then(function(respuesta){
            if(respuesta.status === 200 || respuesta.status === 201 ){
                document.getElementById('btnCerrar').click();
                show_alerta("","success");
                getActors();
            }else{
                show_alerta("","error");
            }
        })
        .catch(function(error){
            show_alerta('Error en la solicitud','error');
            console.log(error);
        });
    }
    const deleteActor= (id,name) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'¿Seguro de eliminar el actor '+name+' ?',
            icon: 'question',text:'No se podrá dar marcha atrás',
            showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result) =>{
            if(result.isConfirmed){
                setId(id);
                enviarSolicitud('DELETE',{},"/"+id);
            }
            else{
                show_alerta('El actor NO fue eliminado','info');
            }
        });
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={()=> openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalActors'>
                            <i className='fa-solid fa-circle-plus'></i> Añadir
                        </button>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr><th>#</th><th>ACTOR</th><th>NACIONALIDAD</th><th></th></tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {actors.map( (actor,i)=>(
                                    <tr key={actor.id}>
                                        <td>{(i+1)}</td>
                                        <td>{actor.name}</td>
                                        <td>{actor.nationality}</td>
                                        <td>
                                            <button onClick={() => openModal(2,actor.id,actor.name,actor.nationality)}
                                                 className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalActors'>
                                                <i className='fa-solid fa-edit'></i>
                                            </button>
                                            &nbsp; 
                                            <button onClick={()=>deleteActor(actor.id,actor.name)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash'></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div id='modalActors' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={name}
                            onChange={(e)=> setName(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                            <input type='text' id='nationality' className='form-control' placeholder='Nacionalidad del actor' value={nationality}
                            onChange={(e)=> setNationality(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={() => validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShowActors