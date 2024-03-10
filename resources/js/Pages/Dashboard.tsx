import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Card } from "@/Components/ui/card";
import { useEffect, useState } from "react";
import formatPrice from "@/utils/formatPrice";
import { ProductType } from "./ProductType/Index";

type Data = {
    total_revenue: number;
    total_transactions: number;
    total_products: number;
    total_product_types: number;
};

type ComparisonProductType = {
    highest_product_type: {
        id: number;
        name: string;
        total_revenue: number;
    };
    lowest_product_type: {
        id: number;
        name: string;
        total_revenue: number;
    };
};

export default function Dashboard({ auth }: PageProps) {
    const [data, setData] = useState<Data>({
        total_revenue: 0,
        total_transactions: 0,
        total_products: 0,
        total_product_types: 0,
    });
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [firstProductTypeId, setFirstProductTypeId] = useState<number>(0);
    const [secondProductTypeId, setSecondProductTypeId] = useState<number>(0);
    const [comparisonProductTypes, setComparisonProductTypes] =
        useState<ComparisonProductType>({
            highest_product_type: {
                id: 0,
                name: "",
                total_revenue: 0,
            },
            lowest_product_type: {
                id: 0,
                name: "",
                total_revenue: 0,
            },
        });

    const fetchDashboardData = async () => {
        try {
            const response = await fetch(route("dashboard.getData"));
            const responseJson = await response.json();
            setData(responseJson.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProductTypes = async () => {
        try {
            const response = await fetch(
                route("product-type.getData") + "?perPage=999999"
            );
            const responseJson = await response.json();

            if (!response.ok) {
                throw new Error(responseJson.message);
            }

            setProductTypes(responseJson.data);
        } catch (error) {
            console.error(error);
        }
    };

    const compareProductTypes = async () => {
        try {
            const response = await fetch(
                route("dashboard.compareProductTypes") +
                    `?first_product_type_id=${firstProductTypeId}&second_product_type_id=${secondProductTypeId}`
            );
            const responseJson = await response.json();
            setComparisonProductTypes(responseJson.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        fetchProductTypes();
    }, []);

    useEffect(() => {
        if (firstProductTypeId !== 0 && secondProductTypeId !== 0) {
            compareProductTypes();
        }
    }, [firstProductTypeId, secondProductTypeId]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            title={`Halo ${auth.user.name}!`}
            subtitle="Dashboard"
        >
            <Head title="Dashboard" />
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Card className="px-3 py-4 flex gap-2">
                    <div className="bg-[#206bc4] rounded w-[40px] h-[40px] text-primary-foreground flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                            ></path>
                            <path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2"></path>
                            <path d="M12 3v3m0 12v3"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm">
                            Total Pendapatan
                        </h3>
                        <p className="text-gray-500 text-sm">
                            {formatPrice(data.total_revenue)}
                        </p>
                    </div>
                </Card>
                <Card className="px-3 py-4 flex gap-2">
                    <div className="bg-[#2fb344] rounded w-[40px] h-[40px] text-primary-foreground flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                            ></path>
                            <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                            <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                            <path d="M17 17h-11v-14h-2"></path>
                            <path d="M6 5l14 1l-1 7h-13"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm">Total Transaksi</h3>
                        <p className="text-gray-500 text-sm">
                            {data.total_transactions}
                        </p>
                    </div>
                </Card>
                <Card className="px-3 py-4 flex gap-2">
                    <div className="bg-[#1da1f2] rounded w-[40px] h-[40px] text-primary-foreground flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-package"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                            ></path>
                            <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"></path>
                            <path d="M12 12l8 -4.5"></path>
                            <path d="M12 12l0 9"></path>
                            <path d="M12 12l-8 -4.5"></path>
                            <path d="M16 5.25l-8 4.5"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm">Total Barang</h3>
                        <p className="text-gray-500 text-sm">
                            {data.total_products}
                        </p>
                    </div>
                </Card>
                <Card className="px-3 py-4 flex gap-2">
                    <div className="bg-[#1877f2] rounded w-[40px] h-[40px] text-primary-foreground flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 4h6v6h-6z" />
                            <path d="M14 4h6v6h-6z" />
                            <path d="M4 14h6v6h-6z" />
                            <path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm">
                            Total Jenis Barang
                        </h3>
                        <p className="text-gray-500 text-sm">
                            {data.total_product_types}
                        </p>
                    </div>
                </Card>
            </div>
            <Card className="mt-4 px-5 py-4">
                {/* create a comparison product type UI */}
                <h3 className="text-lg font-medium mb-4">
                    Bandingkan Jenis Barang
                </h3>
                <div className="flex gap-4">
                    <select
                        className="
                            w-1/2  
                            bg-white 
                            border 
                            border-gray-300 
                            rounded-md 
                            py-2 
                            px-3 
                            text-gray-900 
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-primary 
                            focus:border-transparent 
                            sm:text-sm
                        "
                        value={firstProductTypeId}
                        onChange={(e) => {
                            setFirstProductTypeId(Number(e.target.value));
                        }}
                    >
                        <option value="0" disabled>
                            Pilih Jenis Barang
                        </option>
                        {productTypes.map((productType) => (
                            <option key={productType.id} value={productType.id}>
                                {productType.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="
                            w-1/2  
                            bg-white 
                            border 
                            border-gray-300 
                            rounded-md 
                            py-2 
                            px-3 
                            text-gray-900 
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-primary 
                            focus:border-transparent 
                            sm:text-sm
                        "
                        value={secondProductTypeId}
                        onChange={(e) => {
                            setSecondProductTypeId(Number(e.target.value));
                        }}
                        disabled={firstProductTypeId === 0}
                    >
                        <option value="0" disabled>
                            Pilih Jenis Barang
                        </option>
                        {productTypes.map((productType) => (
                            <option key={productType.id} value={productType.id}>
                                {productType.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-medium mb-3">
                        Perbandingan Jenis Barang
                    </h3>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2 w-1/2">
                            <h4 className="font-medium">
                                Pendapatan Terbanyak
                            </h4>
                            {comparisonProductTypes.highest_product_type
                                .name ? (
                                <>
                                    <p className="text-gray-500 text-sm">
                                        Nama:{" "}
                                        {
                                            comparisonProductTypes
                                                .highest_product_type.name
                                        }
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Total:{" "}
                                        {formatPrice(
                                            comparisonProductTypes
                                                .highest_product_type
                                                .total_revenue
                                        )}
                                    </p>
                                </>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Tidak ada data
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <h4 className="font-medium">Pendapatan Terendah</h4>
                            {comparisonProductTypes.lowest_product_type.name ? (
                                <>
                                    <p className="text-gray-500 text-sm">
                                        Nama:{" "}
                                        {
                                            comparisonProductTypes
                                                .lowest_product_type.name
                                        }
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Total:{" "}
                                        {formatPrice(
                                            comparisonProductTypes
                                                .lowest_product_type
                                                .total_revenue
                                        )}
                                    </p>
                                </>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Tidak ada data
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </AuthenticatedLayout>
    );
}
