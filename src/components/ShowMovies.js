import React,{useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowMovies = () => {
    const url='http://localhost:8080/movie';
    const [movies,setMovies]= useState([]);
    const [id,setId]= useState('');
    const [name,setName]= useState('');
    const [kind_movie,setKind_movie]= useState('');
    const [operation,setOperation]= useState(1);
    const [title,setTitle]= useState('');

    
    useEffect( ()=>{
        getMovies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

      
    const getMovies = async () => {
        const respuesta = await axios.get(url);
        setMovies(respuesta.data);
    }    
    const openModal = (op,id, name, kind_movie) =>{
        setId('');
        setName('');
        setKind_movie('');
        setOperation(op);
        if(op === 1){
            setTitle('Registrar Pelicula');
        }
        else if(op === 2){
            setTitle('Editar Pelicula');
            setId(id);
            setName(name);
            setKind_movie(kind_movie);
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
            show_alerta('Escribe el nombre de la pelicula','warning');
        }
        else if(kind_movie.trim() === ''){
            show_alerta('Escribe el genero de la pelicula','warning');
        }

        else{
            if(operation === 1){
                parametros= {name:name.trim(),kind_movie: kind_movie.trim()};
                metodo= 'POST';
            }
            else{
                parametros={id:id,name:name.trim(),kind_movie: kind_movie.trim()};
                metodo= 'PUT';
            }
            envarSolicitud(metodo,parametros,queryParams);
        }
    }
    const envarSolicitud = async(metodo,parametros,queryParams) => {
        var urlMovie = url+queryParams;
        await axios({ method:metodo, url: urlMovie, data:parametros}).then(function(respuesta){
            console.log(respuesta)
            if(respuesta.status === 200 || respuesta.status === 201 ){
                document.getElementById('btnCerrar').click();
                show_alerta("","success");
                getMovies();
            }else{
                show_alerta("","error");
            }
           
        })
        .catch(function(error){
            show_alerta('Error en la solicitud','error');
            console.log(error);
        });
    }
    const deleteMovie= (id,name) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'¿Seguro de eliminar la pelicula '+name+' ?',
            icon: 'question',text:'No se podrá dar marcha atrás',
            showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result) =>{
            if(result.isConfirmed){
                setId(id);
                envarSolicitud('DELETE',{},"/"+id);
            }
            else{
                show_alerta('La pelicula NO fue eliminada','info');
            }
        });
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={()=> openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalMovies'>
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
                                <tr><th>#</th><th>PELICULA</th><th>GENERO DE LA PELICULA</th><th>ACTORES</th><th></th></tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {movies.map( (movie,i)=>(
                                    <tr key={movie.id}>
                                        <td>{(i+1)}</td>
                                        <td>{movie.name}</td>
                                        <td>{movie.kind_movie}</td>
                                        <td>{movie.actors}</td>
                                        <td>
                                            <button onClick={() => openModal(2,movie.id,movie.name,movie.kind_movie)}
                                                 className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalMovies'>
                                                <i className='fa-solid fa-edit'></i>
                                            </button>
                                            &nbsp; 
                                            <button onClick={()=>deleteMovie(movie.id,movie.name)} className='btn btn-danger'>
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
        <div id='modalMovies' className='modal fade' aria-hidden='true'>
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
                            <input type='text' id='kind_movie' className='form-control' placeholder='Género de la pelicula' value={kind_movie}
                            onChange={(e)=> setKind_movie(e.target.value)}></input>
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

export default ShowMovies