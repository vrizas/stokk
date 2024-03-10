<?php

namespace App\Http\Controllers;

use App\Models\ProductType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('ProductType/Index');
    }

    public function getData(Request $request) {
        try {
            $perPage = $request->query('perPage', 5);
            $search = $request->query('search', '');
            $sortedBy = $request->query('sortedBy', 'created_at');
            $sortedOrder = $request->query('sortedOrder', 'desc');

            $productTypes = ProductType::where('name', 'ilike', "%$search%")
                ->orderBy($sortedBy, $sortedOrder)
                ->paginate($perPage);

            return response()->json($productTypes, 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => ['required', 'string', 'max:200'],
                'description' => ['max:200'],
            ]);
    
            $productType = ProductType::create($request->all());
    
            return response()->json([
                'success' => true,
                'message' => 'Product type created successfully',
                'data' => $productType,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $productType = ProductType::findOrFail($id);
    
            return response()->json([
                'success' => true,
                'data' => $productType,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $request->validate([
                'name' => ['required', 'string', 'max:200'],
                'description' => ['max:200'],
            ]);
    
            $productType = ProductType::findOrFail($id);
            $productType->update($request->all());
    
            return response()->json([
                'success' => true,
                'message' => 'Product type updated successfully',
                'data' => $productType,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $productType = ProductType::find($id);
            $productType->delete();
    
            return response()->json([
                'success' => true,
                'message' => 'Product type deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
