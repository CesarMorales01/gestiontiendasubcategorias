import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2'
import '../../../css/general.css'
import MasImagenes from './MasImagenes'

const NewProduct = (params) => {

    const glob = new GlobalFunctions()
    const [producto, setProducto] = useState({
        fecha: '',
        id: '',
        referencia: '',
        categoria: '',
        subcategoria: '',
        nombre: '',
        descripcion: '',
        cantidad: 0,
        valor: '',
        imagen: '',
        proveedor: null,
        publicacionweb: true
    })
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState()
    const [message, setMessage] = useState('')
    const [displayBtnBorrar, setDisplayBtnBorrar] = useState('none')

    useEffect(() => {
        setFecha()
        if (params.producto.id == '') {
            setSelectSubCategorias('')
            setProducto((valores) => ({
                ...valores,
                proveedor: params.proveedores.length > 0 ? params.proveedores[0].id : '',
                imagen: 'noPreview.jpg',
                publicacionweb: true
            }))
        } else {
            setDisplayBtnBorrar('inline')
            // Se recibe un array en params.product, el id se registra en fk_producto
            let img = ''
            if (params.producto[0].nombre_imagen == '') {
                img = 'noPreview.jpg'
            } else {
                img = params.producto[0].nombre_imagen
            }
            setSelectSubCategorias(params.producto[0].category_id)
            setProducto({
                id: params.producto[0].id,
                referencia: params.producto[0].referencia,
                categoria: params.producto[0].category_id,
                subcategoria: params.producto[0].subcategory_id,
                nombre: params.producto[0].nombre,
                descripcion: params.producto[0].descripcion,
                cantidad: params.producto[0].cantidad,
                publicacionweb: params.producto[0].publicacionweb == 'true' ? true : false,
                costo: params.producto[0].costo,
                valor: params.producto[0].valor,
                imagen: img,
                proveedor: params.producto[0].proveedor
            })
        }
    }, [])
    //== 1 ? true : false
    useEffect(() => {
        if (params.estado != null && params.estado != '') {
            Swal.fire({
                title: params.estado,
                icon: 'success',
                timer: 1000,
            })
        }
        if (params.categorias.length == 0) {
            sweetAlertWarning('Ingresa primero una categoria!')
            setTimeout(() => {
                window.location = params.globalVars.myUrl + "category"
            }, 2000);
        }
        if (params.proveedores.length == 0) {
            sweetAlertWarning('Ingresa primero un proveedor!')
            setTimeout(() => {
                window.location = params.globalVars.myUrl + "provider/list/nothing"
            }, 2000);
        }
    }, [])

    function setSelectSubCategorias(idCategory) {
        if (params.categorias.length > 0) {
            if (idCategory == '') {
                setCategoriaSeleccionada(params.categorias[0])
            } else {
                setCategoriaSeleccionada(buscarCategoria(idCategory))
            }
        }
    }

    function cambioPublicacionweb(e) {
        let boolean = false
        if (producto.publicacionweb) {
            boolean = false
        } else {
            boolean = true
        }
        setProducto((valores) => ({
            ...valores,
            publicacionweb: boolean,
        }))
    }

    function sweetAlertWarning(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            timer: 2000,
        })
    }

    function setFecha() {
        var fecha = new Date(); //Fecha actual
        var mes = fecha.getMonth() + 1; //obteniendo mes
        var dia = fecha.getDate(); //obteniendo dia
        var ano = fecha.getFullYear(); //obteniendo año
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes //agrega cero si el menor de 10
        document.getElementById('fecha').value = ano + "-" + mes + "-" + dia
        setTimeout(() => {
            setProducto((valores) => ({
                ...valores,
                fecha: ano + "-" + mes + "-" + dia
            }))
        }, 100);
    }

    function cambioCate(cate) {
        setProducto((valores) => ({
            ...valores,
            categoria: cate.target.value,
        }))
        setCategoriaSeleccionada(buscarCategoria(cate.target.value))
    }

    function buscarCategoria(idCate){
        let getCate = null
        params.categorias.forEach(element => {
            if (element.id == idCate) {
                getCate = element
            }
        })
        return getCate
    }

    function cambioSubCate(subcate) {
        setProducto((valores) => ({
            ...valores,
            subcategoria: subcate.target.value,
        }))
    }

    function cambioNombre(e) {
        setProducto((valores) => ({
            ...valores,
            nombre: e.target.value,
        }))
        if (producto.categoria == '') {
            document.getElementById('selectCate').click()
            if (categoriaSeleccionada != undefined && categoriaSeleccionada.subcategorias.length > 0) {
                document.getElementById('selectSubCate').click()
            }
        }
    }

    function cambioRef(e) {
        setProducto((valores) => ({
            ...valores,
            referencia: e.target.value,
        }))
    }

    function cambioDescripcion(e) {
        setProducto((valores) => ({
            ...valores,
            descripcion: e.target.value,
        }))
    }

    function cambioPrecio(e) {
        setProducto((valores) => ({
            ...valores,
            valor: e.target.value,
        }))
    }

    function cambioProveedor(e) {
        setProducto((valores) => ({
            ...valores,
            proveedor: e.target.value,
        }))
    }

    function loadingOn() {
        document.getElementById('btnLoading').style.display = 'inline'
        document.getElementById('btnIngresar').style.display = 'none'
    }

    function validarContenidoFile() {
        let respuesta = false
        if (document.getElementById("fileImagen").files.length > 0) {
            respuesta = true
        } else {
            setMessage('Debes ingresar una imagen!')
        }
        return respuesta
    }

    function validarFuncion() {
        if (validarCampos()) {
            if (producto.id == '') {
                if (validarContenidoFile()) {
                    document.getElementById('formCrear').submit()
                    loadingOn()
                }
            } else {
                updateProduct()
                loadingOn()
            }
        }
    }

    function validarContenidoFile() {
        let respuesta = false
        if (document.getElementById("fileImagen").files.length > 0) {
            respuesta = true
        } else {
            setMessage('Debes ingresar una imagen!')
        }
        return respuesta
    }

    function validarCampos() {
        let validado = false
        if (producto.nombre != '' && producto.valor != '' && producto.categoria != '' && producto.proveedor != null) {
            validado = true
            setMessage('')
        } else {
            setMessage('Faltan datos importantes!')
        }
        return validado
    }

    function mostrarImagen(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = document.getElementById('img');
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
        setMessage('')
    }

    function spinOff() {
        document.getElementById('spanvalidandoNombreImagen').style.display = 'none'
    }

    function setCantidad(e) {
        setProducto((valores) => ({
            ...valores,
            cantidad: e.target.value
        }))
    }

    function setPrecio(e) {
        let uti = parseInt(e.target.value) * 0.3;
        let uti2 = parseInt(e.target.value) * 0.2;
        let precio = uti + parseInt(e.target.value)
        if (precio > 0) {
            setProducto((valores) => ({
                ...valores,
                valor: precio,
            }))
        }
    }

    function enviarBorrar() {
        loadingOn()
        document.getElementById('eliminar').click()
    }

    function abrirDialogoEliminar() {
        Swal.fire({
            title: '¿Eliminar este producto?',
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

    function updateProduct() {
        const form = document.getElementById("formCrear")
        form.setAttribute("method", "get")
        form.action = route('product.actualizar', producto.id)
        form.submit()
    }

    function cambioFecha(e) {
        setProducto((valores) => ({
            ...valores,
            fecha: e.target.value
        }))
    }
   
    return (
        <AuthenticatedLayout
            user={params.auth} globalVars={params.globalVars} >
            <Head title="Producto" />
            <div className="container justify-content-justify">
                <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center"> {producto.id == '' ? 'Registrar' : 'Editar'} producto</h1>
                <br />
                <form method="POST" id="formCrear" action={route('product.store')} encType="multipart/form-data">
                    <div style={{ marginBottom: '1em' }} className="row justify-content-around">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                            Id (Predeterminado)
                            <input className='form-control rounded' type="text" name='id' readOnly value={producto.id == '' ? '' : producto.id} />
                            <br />
                            <input type="hidden" name='_token' value={params.token} />
                            Fecha de registro:<br />
                            <input className='form-control rounded' onChange={cambioFecha} type="date" id='fecha' name='fecha' value={producto.fecha} />
                            <br />
                            Referencia (Opcional)
                            <input className='form-control rounded' type="text" name='referencia' onChange={cambioRef} placeholder="Referencia" id="referencia" value={producto.referencia == '' ? '' : producto.referencia} />
                            <br />
                            Categoria:
                            <select onChange={cambioCate} value={producto.categoria} onClick={cambioCate} name='categoria' id='selectCate' className="form-select rounded" >
                                {params.categorias.map((item, index) => {
                                    return (
                                        <option key={index} value={item.id} >{item.nombre}</option>
                                    )
                                })}
                            </select>
                            <br />
                            {categoriaSeleccionada != undefined && categoriaSeleccionada.subcategorias.length > 0 ?
                                <>
                                    <span >Subcategoria:</span>
                                    <select onChange={cambioSubCate} value={producto.subcategoria} onClick={cambioSubCate} name='subcategoria' id='selectSubCate' className="form-select rounded" >
                                        {categoriaSeleccionada.subcategorias.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id} >{item.nombre}</option>
                                            )
                                        })}
                                    </select>
                                </>
                                :
                                ''
                            }
                            <br />
                            Nombre
                            <br />
                            <textarea className='form-control rounded' name='nombre' required onChange={cambioNombre} placeholder="Nombre" value={producto.nombre == '' ? '' : producto.nombre} />
                            <br />
                            Descripción
                            <br />
                            <textarea className='form-control rounded' name='descripcion' rows="2" onChange={cambioDescripcion} placeholder="Descripcion" value={producto.descripcion == '' ? '' : producto.descripcion}></textarea>
                            <br />

                        </div>
                        <div style={{ marginTop: window.screen.width > 600 ? '' : '1.5em' }} className="col-lg-6 col-md-6 col-sm-12 col-12" >
                            Cantidad (Opcional)
                            <br />
                            <input className='form-control rounded' type="number" name='cantidad' onChange={setCantidad} placeholder="Cantidad" defaultValue={producto.cantidad == '' ? '' : producto.cantidad} />
                            <br />
                            Costo (Opcional)
                            <br />
                            <input className='form-control rounded' type="number" name='costo' onChange={setPrecio} placeholder="Costo producto" defaultValue={producto.costo == '' ? '' : producto.costo} />
                            <br />
                            Precio de venta:
                            <br />
                            <input className='form-control rounded' name='valor' onChange={cambioPrecio} type='number' required placeholder="Precio de venta" value={producto.valor == '' ? '' : producto.valor} />
                            <br />
                            Proveedor:
                            <select onChange={cambioProveedor} value={producto.proveedor} onClick={cambioProveedor} name='proveedor' id='selectProveedor' className="form-select rounded" >
                                {params.proveedores.map((item, index) => {
                                    return (
                                        <option key={index} value={item.id} >{item.nombre}</option>
                                    )
                                })}
                            </select>
                            <br />
                            <label>Imagen:</label>
                            <br />
                            <input name='imagen' data-toggle="tooltip" id='fileImagen' title="Ingresa imagenes con fondo blanco, aprox 500x500 mp." type="file" disabled={producto.id == '' ? false : true} onChange={mostrarImagen} />
                            <br /><br />
                            <img onLoad={spinOff} className='border' id="img" width="140px" height="150px" src={producto.imagen == 'noPreview.jpg' ? params.globalVars.myUrl + "Images/Config/" + producto.imagen : params.globalVars.urlImagenes + producto.imagen} />
                            <span id='spanvalidandoNombreImagen' style={{ display: '' }} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            {producto.id == '' ? '' : producto.imagen}
                            <span style={{ color: 'red' }}>{message}</span>
                            <br />
                            <SecondaryButton style={{ margin: '1em', cursor: 'pointer', display: producto.id == '' ? 'none' : '' }} type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-images" viewBox="0 0 16 16">
                                    <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                    <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" />
                                </svg>
                                <a href='#imagenes' style={{ marginLeft: '0.2em' }}>Subir más imagenes</a>
                            </SecondaryButton>
                            <div style={{ margin: '1em' }} >
                                <p style={{ color: 'black', marginBottom: '0.5em', marginTop: '0.8em' }}>¿Publicar este producto en la página web?</p>
                                <label className="relative inline-flex items-center mr-5 cursor-pointer">
                                    <input type='hidden' value={producto.publicacionweb} name='publicacion'></input>
                                    <input name='publicacionweb' type="checkbox" className="sr-only peer" checked={producto.publicacionweb} onChange={cambioPublicacionweb} />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{producto.publicacionweb ? 'Si' : 'No'}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
                <div style={{ margin: '2em', textAlign: 'center' }} className='row'>
                    <div className={producto.id == '' ? 'col-12' : 'col-md-6 col-6'}>
                        <PrimaryButton id="btnIngresar" type="button" onClick={validarFuncion} className="ml-4" >
                            {producto.id == '' ? 'Registrar producto' : 'Editar producto'}
                        </PrimaryButton>
                        <PrimaryButton id='btnLoading' style={{ display: 'none' }} className="ml-4" type="button" disabled>
                            <span style={{ marginRight: '0.2em' }} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </PrimaryButton>
                    </div>
                    <div style={{ display: displayBtnBorrar }} className={producto.id == '' ? '' : 'col-md-6 col-6'}>
                        <button id="btnBorrar" onClick={abrirDialogoEliminar} style={{ backgroundColor: 'red' }} className="btn btn-danger" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                        </button>
                        <button id='btnLoadingBorrar' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                        {/*show cause @method dont work...*/}
                        <a id='eliminar' href={route('product.show', producto.id)}></a>
                    </div>
                </div>
            </div>

            <div style={{ display: producto.id == '' ? 'none' : 'inline' }}>
                <MasImagenes token={params.token} id={producto.id} nombre={producto.nombre} globalVars={params.globalVars} />
            </div>
        </AuthenticatedLayout>
    )
}

export default NewProduct