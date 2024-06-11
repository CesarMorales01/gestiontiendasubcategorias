<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;

trait MetodosGenerales
{

    public function all_products()
    {
        //No paginado
        $prods = DB::table('productos')->get();
        foreach ($prods as $prod) {
            $getCate = DB::table('categorias')->where('id', '=', $prod->category_id)->first();
            $subcategoria = DB::table('subcategorias')->where('id', '=', $prod->subcategory_id)->first();
            $prod->categoria = $getCate;
            $prod->subcategoria = $subcategoria;
        }
        return $prods;
    }

    public function all_clientes()
    {
        $clientes = DB::table('clientes')->get();
        foreach ($clientes as $cliente) {
            $telefono = DB::table('telefonos_clientes')->where('cedula', '=', $cliente->id)->get();
            $usuario = DB::table('keys')->where('cedula', '=', $cliente->id)->get();
            $cliente->telefonos = $telefono;
            $cliente->usuario = $usuario;
        }
        return $clientes;
    }

    public function get_compra_n($cliente)
    {
        $compran = 1;
        $validarNCompra = DB::table('lista_compras')->where('cliente', '=', $cliente)->orderBy('compra_n', 'desc')->first();
        if ($validarNCompra) {
            $compran = $validarNCompra->compra_n + 1;
        }
        return $compran;
    }

    public function ingresar_telefonos($request)
    {
        $check = DB::table('telefonos_clientes')->where('cedula', '=', $request->id)->first();
        if ($check) {
            DB::table('telefonos_clientes')->where('cedula', '=', $request->id)->delete();
        }
        for ($i = 0; $i < count($request->telefonos); $i++) {
            $token = strtok($request->telefonos[$i], ",");
            while ($token !== false) {
                DB::table('telefonos_clientes')->insert([
                    'cedula' => $request->id,
                    'telefono' => $token
                ]);
                $token = strtok(",");
            }
        }
    }

    public function getFechaHoy()
    {
        date_default_timezone_set('America/Bogota');
        $date = now();
        $año = date_format($date, "y");
        $mes = date_format($date, "m");
        $dia = date_format($date, "d");
        return $año . "-" . $mes . "-" . $dia;
    }
}
