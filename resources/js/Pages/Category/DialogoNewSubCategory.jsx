import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions'
import Swal from 'sweetalert2'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const DialogoNewSubCategory = (params) => {
    const glob = new GlobalFunctions()
    const [subCategoria, setSubCategoria] = useState({
        id: '',
        category_id: '',
        nombre: ''
    })

    useEffect(() => {
        if (params.subCategory.id != subCategoria.id) {
            setSubCategoria((valores) => ({
                ...valores,
                id: params.subCategory.id,
                category_id: params.category.id,
                nombre: params.subCategory.nombre
            }))
        }
    })

    function mostrarAlertDatosFaltantes() {
        Swal.fire({
            title: 'Faltan datos importantes!',
            icon: 'warning',
            timer: 1000
        })
    }

    function cambioNombre(cate) {
        setSubCategoria((valores) => ({
            ...valores,
            nombre: cate.target.value,
        }))
    }

    function loadingOn() {
        document.getElementById('btnIngresarSubCate').style.display = 'none'
        document.getElementById('btnLoadingSubCate').style.display = 'inline'
    }

    function validarCampos(e) {
        e.preventDefault()
        if (subCategoria.nombre != '') {
            if (subCategoria.id == '') {
                document.getElementById('formCrearSubCate').submit()
            } else {
                updateSubCategoria()
            }
            loadingOn()
        } else {
            mostrarAlertDatosFaltantes()
        }
    }

    function updateSubCategoria() {
        const form = document.getElementById("formCrearSubCate")
        form.action = route('subcategory.actualizar', subCategoria.id)
        form.submit()
    }

    function enviarBorrar(){
        document.getElementById('btnEliminarSubCate').click()
        loadingOn()
    }


    function abrirDialogoEliminarSubCate(){
        Swal.fire({
            title: '¿Eliminar subcategoria '+subCategoria.nombre+'?',
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

    return (
        <div className="modal fade" id='dialogoNuevaSubCategoria' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 style={{ fontSize: '1.5em', marginLeft: '0.5em' }} className="modal-title">{params.subCategory.id == '' ? 'Nueva subcategoria para '+params.category.nombre  : 'Editar subcategoria '+params.subCategory.nombre}</h1>
                        <button onClick={abrirDialogoEliminarSubCate} id='btnDialogoEliminarSubCategoria' style={{ marginTop: '0.5em', display: params.subCategory.id == '' ? 'none' : '', backgroundColor: 'red' }} className="btn btn-danger" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                        </button>
                        <a id='btnEliminarSubCate' style={{ display: 'none'}} href={route('subcategory.show', subCategoria.id)}></a>
                    </div>
                    <div className='container' style={{ margin: '0.2em' }}>
                        <form method="POST" id="formCrearSubCate" onSubmit={validarCampos} action={route('subcategory.store')} >
                            <input type="hidden" name='_token' value={params.token} />
                            <input type="hidden" name='id' value={params.subCategory.id == '' ? '' : params.subCategory.id} />
                            <input type="hidden" name='id_category' value={params.category.id} />
                            <input name='subcategory' onChange={cambioNombre} className='form-control rounded' type="text" placeholder='Nombre subcategoria' value={subCategoria.nombre} />
                            <div className="modal-footer">
                                <SecondaryButton type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</SecondaryButton>
                                <PrimaryButton type='submit' id="btnIngresarSubCate" style={{ display: 'inline' }} className="btn btn-success">{params.subCategory.id == '' ? 'Crear subcategoria' : 'Editar subcategoria'}</PrimaryButton>
                                <PrimaryButton id='btnLoadingSubCate' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DialogoNewSubCategory