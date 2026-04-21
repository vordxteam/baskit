"use client";

import React, { useEffect, useState } from "react";
import { ProductInventory } from "@/api/productInventory";
import { CreateInventoryRequest } from "@/api/productInventory/types";
import { useRouter } from "next/navigation";
// import your actual catalog api here

interface CatalogType {
    id: string;
    name: string;
}

type RawCatalogType = {
    id?: string;
    name?: string;
    label?: string;
    value?: string;
    code?: string;
};

interface CatalogResponse {
    data?: RawCatalogType[] | { data?: RawCatalogType[] };
}

const inventoryApi = new ProductInventory();

export default function CreateInventoryPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isCatalogLoading, setIsCatalogLoading] = useState(false);
    const [error, setError] = useState("");

    const [catalogTypes, setCatalogTypes] = useState<CatalogType[]>([]);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const router = useRouter();
    const [formData, setFormData] = useState<CreateInventoryRequest>({
        name: "",
        price: 0,
        stock_quantity: 0,
        description: "",
        catalog_item_type_id: "",
        image: "",
        is_active: true,
    });

    const normalizeCatalogTypes = (items: RawCatalogType[]): CatalogType[] => {
        return items
            .map((item) => {
                const id = (item.id ?? "").toString().trim();
                const name = (item.name ?? item.label ?? item.code ?? item.value ?? "").toString().trim();

                if (!id || !name) {
                    return null;
                }

                return { id, name };
            })
            .filter((item): item is CatalogType => item !== null);
    };

    useEffect(() => {
        const fetchCatalogTypes = async () => {
            try {
                setIsCatalogLoading(true);

                // Expected response example:
                // {
                //   data: [
                //     { label: "Flower", value: "FLOWER" },
                //     { label: "Chocolate", value: "CHOCOLATE" }
                //   ]
                // }

                const response = await new ProductInventory().getCatalog<CatalogResponse>();

                const data = response?.data;
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : [];

                setCatalogTypes(normalizeCatalogTypes(list));
            } catch (error) {
                console.error("Error fetching catalog types:", error);
                setCatalogTypes([]);
            } finally {
                setIsCatalogLoading(false);
            }
        };

        fetchCatalogTypes();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const target = e.target as HTMLInputElement;
            setFormData((prev) => ({
                ...prev,
                [name]: target.checked,
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "price" || name === "stock_quantity"
                    ? Number(value)
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setError("");

            console.log("Form data before submission:", formData);

            console.log("Submitting create inventory payload:", formData);

            const res = await inventoryApi.createInventory<{ success?: boolean }>(formData);

            if (res.success) {         
                router.push("/admin/inventory");
            }

            setFormData({
                name: "",
                price: 0,
                stock_quantity: 0,
                description: "",
                catalog_item_type_id: "",
                image: "",
                is_active: true,
            });
            setSelectedFileName(null);
            setFilePreview(null);
        } catch (error) {
            console.error("Error creating inventory item:", error);
            setError("Failed to create inventory item.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-4 py-8 sm:px-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create Inventory Item</h1>
                <p className="text-sm text-gray-500">
                    Fill in the details and select catalog type from catalog API
                </p>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-5 rounded-xl border border-gray-200 bg-white p-6 md:grid-cols-2"
            >
                <div className="md:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-brand-500"
                        required
                    />
                </div>

                <div className="md:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Price
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-brand-500"
                        required
                    />
                </div>

                <div className="md:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Stock Quantity
                    </label>
                    <input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleChange}
                        placeholder="Enter stock quantity"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-brand-500"
                        required
                    />
                </div>

                <div className="md:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Catalog Type
                    </label>
                    <select
                        name="catalog_item_type_id"
                        value={formData.catalog_item_type_id}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-brand-500"
                        required
                    >
                        <option value="">
                            {isCatalogLoading ? "Loading catalog types..." : "Select catalog type"}
                        </option>

                        {catalogTypes.map((catalogType) => (
                            <option key={catalogType.id} value={catalogType.id}>
                                {catalogType.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <select
                        name="is_active"
                        value={String(formData.is_active)}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                is_active: e.target.value === "true",
                            }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-brand-500"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                <div className="md:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Product Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) {
                                setSelectedFileName(null);
                                setFormData((prev) => ({ ...prev, image: "" }));
                                setFilePreview(null);
                                return;
                            }

                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const base64Url = reader.result as string;
                                setSelectedFileName(file.name);
                                setFilePreview(base64Url);
                                setFormData((prev) => ({ ...prev, image: base64Url }));
                            };
                            reader.readAsDataURL(file);
                        }}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm"
                    />
                    {filePreview ? (
                        <div className="mt-3">
                            <img src={filePreview} alt="Preview" className="h-32 w-32 rounded-lg object-cover" />
                            <p className="mt-2 text-xs text-gray-500">Selected: {selectedFileName}</p>
                        </div>
                    ) : (
                        <p className="mt-2 text-xs text-gray-500">No image selected.</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-brand-500"
                    />
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "Create Item"}
                    </button>
                </div>
            </form>
        </div>
    );
}