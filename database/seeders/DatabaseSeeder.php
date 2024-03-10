<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Product;
use App\Models\ProductType;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin123'),
        ]);

        // create normal 10 real product types in indonesia
        $productTypes = [
            'Makanan',
            'Minuman',
            'Pakaian',
            'Elektronik',
            'Kesehatan',
            'Olahraga',
            'Kecantikan',
            'Perawatan',
            'Pendidikan',
            'Hiburan',
        ];

        foreach ($productTypes as $productType) {
            $productTypeResult = ProductType::create([
                'name' => $productType,
                'description' => null,
            ]);

            if ($productTypeResult) {
                if ($productType === 'Makanan') {
                    $products = [
                        [
                            'name' => 'Nasi Goreng',
                            'price' => 15000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Mie Goreng',
                            'price' => 12000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Ayam Goreng',
                            'price' => 20000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                    ];

                    foreach ($products as $product) {
                        Product::create($product);
                    }
                } else if ($productType === 'Minuman') {
                    $products = [
                        [
                            'name' => 'Es Teh',
                            'price' => 5000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Es Jeruk',
                            'price' => 6000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Es Campur',
                            'price' => 10000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                    ];

                    foreach ($products as $product) {
                        Product::create($product);
                    }
                } else if ($productType === 'Pakaian') {
                    $products = [
                        [
                            'name' => 'Kaos',
                            'price' => 50000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Celana',
                            'price' => 100000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Jaket',
                            'price' => 150000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                    ];

                    foreach ($products as $product) {
                        Product::create($product);
                    }
                } else if ($productType === 'Elektronik') {
                    $products = [
                        [
                            'name' => 'HP',
                            'price' => 2000000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Laptop',
                            'price' => 10000000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Kamera',
                            'price' => 5000000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                    ];

                    foreach ($products as $product) {
                        Product::create($product);
                    }
                } else if ($productType === 'Kesehatan') {
                    $products = [
                        [
                            'name' => 'Masker',
                            'price' => 5000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Hand Sanitizer',
                            'price' => 10000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Vitamin',
                            'price' => 20000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                    ];

                    foreach ($products as $product) {
                        Product::create($product);
                    }
                } else if ($productType === 'Olahraga') {
                    $products = [
                        [
                            'name' => 'Bola',
                            'price' => 50000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Raket',
                            'price' => 100000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Sepatu Olahraga',
                            'price' => 150000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                    ];

                    foreach ($products as $product) {
                        Product::create($product);
                    }
                } else if ($productType === 'Kecantikan') {
                    $products = [
                        [
                            'name' => 'Lipstik',
                            'price' => 50000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Bedak',
                            'price' => 100000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Parfum',
                            'price' => 150000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                    ];

                    foreach ($products as $product) {
                        Product::create($product);
                    }
                } else if ($productType === 'Perawatan') {
                    $products = [
                        [
                            'name' => 'Shampoo',
                            'price' => 50000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Sabun',
                            'price' => 100000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Lotion',
                            'price' => 150000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                    ];

                    foreach ($products as $product) {
                        Product::create($product);
                    }
                } else if ($productType === 'Pendidikan') {
                    $products = [
                        [
                            'name' => 'Buku',
                            'price' => 50000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Pensil',
                            'price' => 100000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Buku Tulis',
                            'price' => 150000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                    ];

                    foreach ($products as $product) {
                        Product::create($product);
                    }
                } else if ($productType === 'Hiburan') {
                    $products = [
                        [
                            'name' => 'Game',
                            'price' => 50000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Film',
                            'price' => 100000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                        [
                            'name' => 'Musik',
                            'price' => 150000,
                            'stock' => 100,
                            'product_type_id' => $productTypeResult->id,
                        ],
                    ];

                    foreach ($products as $product) {
                        Product::create($product);
                    }
                }
            }
        }

        for ($i = 0; $i < 10; $i++) {
            $productType = ProductType::inRandomOrder()->first();
            $product = Product::where('product_type_id', $productType->id)->inRandomOrder()->first();
            $transaction = Transaction::create([
                'total' => $product->price,
                'product_id' => $product->id,
                'quantity' => rand(1, 100),
                'created_at' => now()->subDays(rand(1, 30)),
            ]);
        }
    }
}
