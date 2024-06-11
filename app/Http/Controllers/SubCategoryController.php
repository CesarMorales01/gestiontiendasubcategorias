<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GlobalVars;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SubCategoryController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        DB::table('subcategorias')->insert([
            'nombre' => $request->subcategory,
            'category_id' => $request->id_category
        ]);
        return redirect()->route('category.index');
    }

    public function show(string $id)
    {

        //Eliminar subcategoria
        $subcate = DB::table('subcategorias')->where('id', '=', $id)->first();
        $validarEnproductos = DB::table('productos')->where('category_id', '=', $subcate->category_id)->first();
        if ($validarEnproductos != null) {
            $estado = "¡No puedes eliminar esta subcategoria porque esta en algunos productos!";
            $duracionAlert = 2000;
        } else {

            $deleted = DB::table('subcategorias')->where('id', '=', $id)->delete();
            $estado = "¡Subcategoria eliminada!";
            $duracionAlert = 1000;
        }
        $auth = Auth()->user();
        $categorias = DB::table('categorias')->orderBy('id', 'desc')->get();
        foreach ($categorias as $cate) {
            $cate->subcategorias = DB::table('subcategorias')->get();
        }
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $token = csrf_token();
        return Inertia::render('Category/Categories', compact('auth', 'categorias', 'globalVars', 'token', 'estado', 'duracionAlert'));
    }

    public function edit(string $id, string $nombre)
    {
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
    }

    public function actualizar(Request $request, string $id)
    {
        DB::table('subcategorias')->where('id', $id)->update([
            'nombre' => $request->subcategory
        ]);
        return redirect()->route('category.index');
    }
}
