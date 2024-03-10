<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Transaction/Index');
    }

    public function getData(Request $request) {
        try {
            $perPage = $request->query('perPage', 5);
            $search = $request->query('search', '');
            $sortedBy = $request->query('sortedBy', 'transactions.created_at');
            $sortedOrder = $request->query('sortedOrder', 'desc');

            $transactions = Transaction::join('products', 'transactions.product_id', '=', 'products.id')
                ->select('transactions.*', 'products.name as product_name', 'products.stock as product_stock', 'products.price as product_price', 'products.product_type_id as product_type_id')
                ->where('products.name', 'ilike', "%$search%")
                ->orWhereHas('product.productType', function ($query) use ($search) {
                    $query->where('name', 'ilike', "%$search%");
                })
                ->orderBy($sortedBy, $sortedOrder) 
                ->paginate($perPage);

            foreach ($transactions as $transaction) {
                $product = $transaction->product;
                $product->product_type = $product->productType;
                $transaction->product = $product;
            }
                
            return response()->json($transactions, 200);
            
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
                'product_id' => ['required', 'exists:products,id'],
                'quantity' => ['required', 'integer'],
                'total' => ['required', 'numeric'],
            ]);
            
            $product = Product::findOrFail($request->product_id);


            if ($product->stock < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product stock is not enough',
                ], 400);
            }

            $product->stock -= $request->quantity;
            $product->save();
            $transaction = Transaction::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Transaction created successfully',
                'data' => $transaction,
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
            $transaction = Transaction::findOrFail($id);
            $transaction->product = $transaction->product;
            $transaction->product->product_type = $transaction->product->productType;

            return response()->json([
                'success' => true,
                'message' => 'Transaction retrieved successfully',
                'data' => $transaction,
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
                'product_id' => ['required', 'exists:products,id'],
                'quantity' => ['required', 'integer'],
                'total' => ['required', 'numeric'],
            ]);
        
            $transaction = Transaction::findOrFail($id);
            $product = Product::findOrFail($transaction->product_id);
            $newStock = $product->stock;
            
            if ($transaction->quantity > $request->quantity) {
                $newStock += $transaction->quantity - $request->quantity;
            } else if ($transaction->quantity < $request->quantity) {
                $newStock -= $request->quantity - $transaction->quantity;
            }

            if ($newStock < 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product stock is not enough',
                ], 400);
            }

            $product->update([
                'stock' => $newStock,
            ]);
            $transaction->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Transaction updated successfully',
                'data' => $transaction,
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
            $transaction = Transaction::findOrFail($id);
            $transaction->delete();

            return response()->json([
                'success' => true,
                'message' => 'Transaction deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
