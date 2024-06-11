import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react'
import Swal from 'sweetalert2'
import '../../../css/general.css'
import { useState, useEffect } from 'react';
import newLogo from '../../../../public/Images/Config/plus.png'
import DialogoNewCategory from './DialogoNewCategory'
import logoProducts from '../../../../public/Images/Config/products.jpg'
import Progressbar from '../UIGeneral/ProgressBar'
import DialogoNewSubCategory from './DialogoNewSubCategory';

const Categories = (params) => {

    const [cate, setCate] = useState({
        id: '',
        nombre: '',
        imagen: ''
    })
    const [subCate, setSubCate] = useState({
        id: '',
        category_id: '',
        nombre: ''
    })
    const [progressBar, setProgressBar] = useState(false)

    useEffect(() => {
        if (params.estado != null) {
            Swal.fire({
                title: params.estado,
                icon: params.estado.includes('elimin') ? 'warning' : 'success',
                timer: !params.duracionAlert ? 1000 : params.duracionAlert
            })
        }
    }, [])


    function abrirDialogo(item) {
        setCate({
            id: item.id,
            nombre: item.nombre,
            imagen: item.imagen
        })
        document.getElementById('btnDialogoNewCategory').click()
    }

    function abrirDialogoSubCategory(item, subCate) {
        setCate({
            id: item.id,
            nombre: item.nombre,
            imagen: item.imagen
        })
        if (subCate == '') {
            setSubCate({
                id: '',
                nombre: '',
            })
        } else {
            setSubCate({
                id: subCate.id,
                nombre: subCate.nombre,
            })
        }
        document.getElementById('btnDialogoNewSubCategory').click()
    }

    function goProducts() {
        setProgressBar(true)
        window.location = params.globalVars.myUrl + "product"
    }

    return (
        <AuthenticatedLayout user={params.auth} globalVars={params.globalVars} urlImagenes={params.globalVars.urlImagenes}>
            <Head title="Categorias" />
            <div style={{ display: progressBar ? '' : 'none' }}>
                <Progressbar progress={progressBar}></Progressbar>
            </div>
            <div className='container table-responsive'>
                <div align="center" className="row justify-content-center">
                    <div style={{ marginTop: '0.8em' }} className="row">
                        <div onClick={() => abrirDialogo({ id: '', nombre: '', imagen: '' })} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                            <div className="card border border-primary card-flyer pointer">
                                <img style={{ width: '8em', height: '4em', marginTop: '1em' }} src={newLogo} className="card-img-top img-fluid centerImg" alt="" />
                                <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Nueva categoria</h2>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-6" >
                            <div onClick={goProducts} className="card border border-primary card-flyer pointer">
                                <img style={{ width: '4em', height: '4em', marginTop: '1em' }} src={logoProducts} className="card-img-top img-fluid centerImg" alt="" />
                                <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Productos</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center">Lista de categorias</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Acciones</th>
                            <th scope="col">Nombre categoria</th>
                            <th scope="col">Subcategorias</th>
                            <th scope="col">Imagen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {params.categorias.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">
                                        <button onClick={() => abrirDialogo(item)} className='btn btn-primary btn-sm' style={{ cursor: 'pointer', whiteSpace: 'nowrap'}} >
                                            <i style={{ marginRight: '0.5em' }} className="fa-solid fa-pen-to-square"></i>
                                            Editar categoria
                                        </button>
                                    </th>
                                    <td>{item.nombre}</td>
                                    <td>
                                        <button onClick={() => abrirDialogoSubCategory(item, '')} className='btn btn-success btn-sm' style={{ cursor: 'pointer', whiteSpace: 'nowrap', marginBottom: '0.5em' }} >
                                            <i style={{ marginRight: '0.5em' }} className="fa-regular fa-square-plus"></i>
                                            Crear subcategoria
                                        </button>
                                        {item.subcategorias.map((item1, index) => {
                                            return (
                                                <table key={index}>
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                <button onClick={() => abrirDialogoSubCategory(item, item1)} className='btn btn-primary btn-sm' style={{ cursor: 'pointer' }} >
                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                </button>
                                                            </th>
                                                            <th>{item1.nombre}</th>
                                                        </tr>
                                                    </thead>

                                                </table>
                                            )
                                        })}
                                    </td>
                                    <td>
                                        <img className='img-fluid rounded' style={{ width: '6em', heigth: '6em' }} src={params.globalVars.urlImagenesCategorias + item.imagen} />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <button id='btnDialogoNewCategory' data-toggle="modal" data-target="#dialogoNuevaCategoria" style={{ display: 'none' }} ></button>
            <DialogoNewCategory token={params.token} url={params.globalVars.myUrl} urlImagenes={params.globalVars.urlImagenesCategorias} category={cate}></DialogoNewCategory>
            <button id='btnDialogoNewSubCategory' data-toggle="modal" data-target="#dialogoNuevaSubCategoria" style={{ display: 'none' }} ></button>
            <DialogoNewSubCategory token={params.token} url={params.globalVars.myUrl} urlImagenes={params.globalVars.urlImagenesCategorias} category={cate} subCategory={subCate}></DialogoNewSubCategory>
        </AuthenticatedLayout>
    )
}

export default Categories