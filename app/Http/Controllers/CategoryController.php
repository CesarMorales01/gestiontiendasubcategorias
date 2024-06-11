<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;

class CategoryController extends Controller
{

    public $global = null;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function index()
    {
        $auth = Auth()->user();
        $categorias=$this->getCategorias();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $token = csrf_token();
        return Inertia::render('Category/Categories', compact('auth', 'categorias', 'globalVars', 'token'));
    }

    public function getCategorias(){
        $categorias = DB::table('categorias')->orderBy('id', 'desc')->get();
        foreach($categorias as $cate){
            $cate->subcategorias=DB::table('subcategorias')->where('category_id', '=', $cate->id)->get();
        }
        return $categorias;
    }

    public function create()
    {
    }

    public function store(Request $request)
    {
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $fileName = time() . "-" . $file->getClientOriginalName();
            $upload = $request->file('imagen')->move($this->global->getGlobalVars()->dirImagenesCategorias, $fileName);
            DB::table('categorias')->insert([
                'nombre' => $request->categoria,
                'imagen' => $fileName
            ]);
           
        }
        return redirect()->route('category.index');
    }

    public function show(string $id)
    {   
       //Eliminar categoria
        $cate = DB::table('categorias')->where('id', $id)->first();
        $subcate=DB::table('subcategorias')->where('category_id', '=', $id)->first();
        $validarEnproductos=DB::table('productos')->where('category_id', '=', $id)->first();
        if($validarEnproductos!=null || $subcate!=null){
            $estado = "¡No puedes eliminar esta categoria porque tiene algunas subcategorias o porque esta en algunos productos!";
            $duracionAlert=2000;
        }else{
            unlink($this->global->getGlobalVars()->dirImagenesCategorias . $cate->imagen);
            $deleted = DB::table('categorias')->where('id', '=', $id)->delete();
            $estado = "¡Categoria eliminada!";
            $duracionAlert=1000;
        }
        $auth = Auth()->user();
        $categorias=$this->getCategorias();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $token = csrf_token();
        return Inertia::render('Category/Categories', compact('auth', 'categorias', 'globalVars', 'token', 'estado', 'duracionAlert'));
    }


    public function edit(string $id)
    {
        //
    }


    public function update(Request $request, string $id)
    {
        return response()->json("update" . $id, 200, []);
    }


    public function destroy(string $id)
    {
    }

    public function actualizar(Request $request, string $id)
    {
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $fileName = time() . "-" . $file->getClientOriginalName();
            $upload = $request->file('imagen')->move($this->global->getGlobalVars()->dirImagenesCategorias, $fileName);
            DB::table('categorias')->where('id', $id)->update([
                'nombre' => $request->categoria,
                'imagen' => $fileName
            ]);
            DB::table('productos')->where('category_id', '=', $request->idAnterior)->update([
                'category_id' => $request->id,
            ]);
            unlink($this->global->getGlobalVars()->dirImagenesCategorias . $request->nombreImagenAnterior);
        } else {
            DB::table('categorias')->where('id', $id)->update([
                'nombre' => $request->categoria
            ]);
            DB::table('productos')->where('category_id', '=', $request->idAnterior)->update([
                'category_id' => $request->id,
            ]);
        }
        $auth = Auth()->user();
        $categorias=$this->getCategorias();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $token = csrf_token();
        $estado = "¡Categoria actualizada!";
        $duracionAlert=1000;
        return Inertia::render('Category/Categories', compact('auth', 'categorias', 'globalVars', 'token', 'estado', 'duracionAlert'));
    }
}
