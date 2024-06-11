import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import Swal from 'sweetalert2'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react';
import SelectProductos from './SelectProductos';
import PrimaryButton from '@/Components/PrimaryButton'

const NuevaPromocion = (params) => {
    const glob = new GlobalFunctions()
    const [mensaje, setMensaje] = useState('')
    const [promo, setPromo] = useState({
        descripcion: '',
        imagen: '',
        codigoProducto: '',
        codigoPromo: '',
        categoria: ''
    })
    const [redirectProducto, setRedirectProducto] = useState(true)

    useEffect(() => {
        validarParams()
    }, [])


    function validarParams() {
        if (params.promo.descripcion == '') {
            setPromo((valores) => ({
                ...valores,
                descripcion: '',
                imagen: '',
                codigoPromo: ''
            }))
            document.getElementById('img').src = params.globalVars.myUrl + "Images/Config/noPreview.jpg"
        } else {
            setPromo((valores) => ({
                ...valores,
                descripcion: params.promo.descripcion,
                imagen: params.promo.imagen,
                codigoProducto: params.promo.ref_producto,
                codigoPromo: params.promo.id
            }))
            document.getElementById('img').src = params.globalVars.urlImagenes + params.promo.imagen
        }
    }

    function mostrarImagen(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = document.getElementById('img');
            img.src = event.target.result;

        }
        reader.readAsDataURL(file)
        setPromo((valores) => ({
            ...valores,
            imagen: event.target.files[0].name
        }))
        setMensaje('')
    }

    function loadingOn() {
        document.getElementById('btnLoading').style.display = 'inline'
        document.getElementById('btnIngresar').style.display = 'none'
    }

    function cambioNombre(e) {
        setPromo((valores) => ({
            ...valores,
            descripcion: e.target.value,
        }))
    }

    function cambioProducto(e) {
        let codigo = ''
        for (let i = 0; i < params.productos.length; i++) {
            if (params.productos[i].id == e.target.value) {
                codigo = params.productos[i].id
            }
        }
        setPromo((valores) => ({
            ...valores,
            codigoProducto: codigo,
            categoria: ''
        }))
    }

    function getFileSize() {
        if (document.getElementById('fileImg') != null) {
            return document.getElementById('fileImg').files.length
        } else {
            return 0
        }
    }

    function validarDatos(e) {
        e.preventDefault()
        if (promo.imagen != '') {
            if (promo.codigoProducto != '' || promo.categoria != '') {
                loadingOn()
                if (promo.codigoPromo == '') {
                    document.getElementById('formCrear').submit()
                } else {
                    updatePromo()
                }
            } else {
                setMensaje('¡Asigna un producto o categoria!')
            }
        } else {
            setMensaje('¡Selecciona una imagen!')
        }

    }

    function updatePromo() {
        const form = document.getElementById("formCrear")
        form.setAttribute("method", "post")
        form.action = route('promo.actualizar', promo.codigoPromo)
        form.submit()
    }

    function enviarBorrar() {
        document.getElementById('btnEliminar').click()
        loadingOn()
    }

    function abrirDialogoEliminar() {
        Swal.fire({
            title: '¿Eliminar esta promoción?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                enviarBorrar()
            }
        })
    }

    function cambioRedirect(e) {
        if (redirectProducto) {
            setRedirectProducto(false)
        } else {
            setRedirectProducto(true)
        }
        setTimeout(() => {
            if (document.getElementById('selectCate') != null) {
                document.getElementById('selectCate').click()
            }
        }, 100);
    }

    function cambioCategoria(e) {
        setPromo((valores) => ({
            ...valores,
            codigoProducto: "",
            categoria: e.target.value
        }))
    }

    return (
        <AuthenticatedLayout user={params.auth} globalVars={params.globalVars}>
            <Head title="Carrusel" />
            <a id='btnEliminar' href={route('promo.destroy', promo.codigoPromo)} style={{ display: 'none' }}></a>
            <div className='container bg-white overflow-hidden shadow-sm sm:rounded-lg py-3'>
                <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center">{params.promo.id == '' ? 'Ingresar imagen a carrusel' : 'Editar carrusel'}</h1>
                <div align="center" className="row justify-content-center">
                    <div className='col-lg-11 col-md-11 col-sm-10 col-10' >
                    </div>
                    <div className='col-lg-1 col-md-1 col-sm-2 col-2 '>
                        <button onClick={abrirDialogoEliminar} id='btnDialogoEliminar' style={{ marginTop: '0.5em', display: promo.codigoPromo == '' ? 'none' : '', backgroundColor: 'red' }} className="btn btn-danger" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                        </button>
                    </div>
                    <form style={{ marginTop: '0.5em' }} onSubmit={validarDatos} method="POST" id="formCrear" action={route('promo.store')} encType="multipart/form-data">
                        <input type='hidden' name='ref_producto' value={promo.codigoProducto}></input>
                        <input type='hidden' name='categoria' value={promo.categoria}></input>
                        <input type="hidden" name='_token' value={params.token} />
                        <div className='row'>
                            <div className='col-lg-6 col-md-6 col-sm-6 col-12' style={{ marginTop: '0.5em' }} >
                                <div style={{ marginBottom: '1.5em' }} className="col-lg-6 col-md-6 col-sm-12 col-12" >
                                    <label style={{ fontWeight: 'bold', marginBottom: '0.2em' }}>Elije el redireccionamiento al hacer click en el carrusel:</label>
                                    <div className="row justify-content-start">
                                        <div className="col-6" >
                                            <input onChange={cambioRedirect} checked={redirectProducto} style={{ height: '1.3em', width: '1.3em' }} type='checkbox' className='rounded' name="remember" />
                                            <span style={{ marginLeft: '0.4em' }} className="text-sm">Ir a un producto</span>
                                        </div>
                                        <div className="col-6" >
                                            <input onChange={cambioRedirect} checked={redirectProducto ? false : true} style={{ height: '1.3em', width: '1.3em' }} type='checkbox' className='rounded' name="remember" />
                                            <span style={{ marginLeft: '0.4em' }} className="text-sm">Ir a una categoria</span>
                                        </div>
                                    </div>
                                </div>
                                {redirectProducto ?
                                    <div>
                                        <label>Selecciona un producto a promocionar:</label>
                                        <SelectProductos cambioProducto={cambioProducto} productos={params.productos}></SelectProductos>
                                    </div>
                                    :
                                    <div>
                                        <label>Selecciona una categoria a promocionar:</label>
                                        <select onChange={cambioCategoria} onClick={cambioCategoria} name='categoria' id='selectCate' className="form-select rounded" >
                                            {params.categorias.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.id} >{item.nombre}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                }

                                <textarea name='descripcion' rows={'1'} style={{ marginTop: '1em' }} className='form-control col-12' onChange={cambioNombre} placeholder="Descripción (Este texto aparecerá abajo de la imagen en el carrusel, es opcional." value={promo.descripcion == '' ? '' : promo.descripcion} />
                            </div>
                            <div style={{ marginTop: window.screen.width >= 600 ? '' : '0.5em' }} className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                <input style={{ marginTop: '0.5em' }} name='imagen' data-toggle="tooltip" title="Ingresa imagenes de 3840x1776 mp. aprox." type="file" id="fileImg" onChange={mostrarImagen} />
                                <input type='hidden' name='nombreImagen' value={promo.imagen}></input>
                                <input type='hidden' name='nombreImagenAnterior' value={!params.promo.imagen ? '' : params.promo.imagen}></input>
                                <br />
                                <span style={{ color: 'black' }}>{getFileSize > 0 ? '' : promo.imagen}</span>
                                <br />
                                <p style={{ color: 'red', margin: '1em' }}>{mensaje}</p>
                                <img id="img" width="60%" height="auto" src={params.promo.imagen == '' ? params.globalVars.myUrl + "Images/Config/noPreview.jpg" : params.globalVars.urlImagenes + params.promo.imagen} />
                            </div>
                        </div>
                        <div className='row'>
                            <div style={{ marginTop: '1em' }} className="row justify-content-center" >
                                <div className="col-6 col-lg-3 col-md-3 col-sm-6 align-self-center"  >
                                    <a className='btn btn-danger' href={route('promo.index')} >Cancelar</a>
                                </div>
                                <div className="col-6 col-lg-3 col-md-3 col-sm-6"  >
                                    <PrimaryButton type='submit' id="btnIngresar">{params.promo.id == '' ? 'Ingresar imagen a carrusel' : 'Editar carrusel'}</PrimaryButton>
                                    <button id='btnLoading' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default NuevaPromocion