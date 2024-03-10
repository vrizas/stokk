<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductType;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard');
    }

    public function getData()
    {
        try {
            $totalRevenue = Transaction::sum('total');
            $totalTransactions = Transaction::count();
            $totalProducts = Product::count();
            $totalProductTypes = ProductType::count();

            $data = [
                'total_revenue' => $totalRevenue,
                'total_transactions' => $totalTransactions,
                'total_products' => $totalProducts,
                'total_product_types' => $totalProductTypes,
            ];
                
            return response()->json([
                'success' => true,
                'data' => $data,
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function compareProductTypes(Request $request)
    {
        try {
            $firstProductTypeId = $request->query('first_product_type_id');
            $secondProductTypeId = $request->query('second_product_type_id');
            $firstProductType = ProductType::find($firstProductTypeId);
            $secondProductType = ProductType::find($secondProductTypeId);
            $firstProductTypeTotalRevenue = Transaction::join('products', 'transactions.product_id', '=', 'products.id')
                ->where('products.product_type_id', $firstProductTypeId)
                ->sum('total');
            $secondProductTypeTotalRevenue = Transaction::join('products', 'transactions.product_id', '=', 'products.id')
                ->where('products.product_type_id', $secondProductTypeId)
                ->sum('total');
            $highestProductType = [
                'id' => $firstProductTypeTotalRevenue > $secondProductTypeTotalRevenue ? $firstProductTypeId : $secondProductTypeId,
                'name' => $firstProductTypeTotalRevenue > $secondProductTypeTotalRevenue ? $firstProductType->name : $secondProductType->name,
                'total_revenue' => $firstProductTypeTotalRevenue > $secondProductTypeTotalRevenue ? $firstProductTypeTotalRevenue : $secondProductTypeTotalRevenue,
            ];
            $lowestProductType = [
                'id' => $firstProductTypeTotalRevenue < $secondProductTypeTotalRevenue ? $firstProductTypeId : $secondProductTypeId,
                'name' => $firstProductTypeTotalRevenue < $secondProductTypeTotalRevenue ? $firstProductType->name : $secondProductType->name,
                'total_revenue' => $firstProductTypeTotalRevenue < $secondProductTypeTotalRevenue ? $firstProductTypeTotalRevenue : $secondProductTypeTotalRevenue,
            ];

            $data = [
                'highest_product_type' => $highestProductType,
                'lowest_product_type' => $lowestProductType,
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
