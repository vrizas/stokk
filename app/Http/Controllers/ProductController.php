<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Product/Index');
    }

    public function getData(Request $request) {
        try {
            $perPage = $request->query('perPage', 5);
            $search = $request->query('search', '');
            $sortedBy = $request->query('sortedBy', 'created_at');
            $sortedOrder = $request->query('sortedOrder', 'desc');

            $products = Product::where('name', 'ilike', "%$search%")
                ->orWhereHas('productType', function ($query) use ($search) {
                    $query->where('name', 'ilike', "%$search%");
                })
                ->orderBy($sortedBy, $sortedOrder)
                ->paginate($perPage);

            foreach ($products as $product) {
                $product->product_type = $product->productType;
            }
                
            return response()->json($products, 200);
            
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
                'product_type_id' => ['required', 'exists:product_types,id'],
                'stock' => ['required', 'integer'],
                'price' => ['required', 'numeric'],
            ]);

            $product = Product::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product,
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
            $product = Product::findOrFail($id);
            $product->product_type = $product->productType;

            return response()->json([
                'success' => true,
                'data' => $product,
            ]);
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
                'product_type_id' => ['required', 'exists:product_types,id'],
                'stock' => ['required', 'integer'],
                'price' => ['required', 'numeric'],
            ]);

            $product = Product::findOrFail($id);
            $product->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product,
            ]);
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
            $product = Product::findOrFail($id);
            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
