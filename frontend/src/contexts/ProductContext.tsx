'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { api } from '@/utils/api';

interface ProductContextType {
  products: Product[];
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  const refreshProducts = async () => {
    const data = await api.getProducts();
    const formatted = data.map((p: any) => ({
      ...p,
      images: JSON.parse(p.images),
      isActive: Boolean(p.is_active),
    }));
    setProducts(formatted);
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = async (productData: any) => {
    await api.createProduct(productData);
    await refreshProducts();
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    await api.updateProduct({ id, ...productData });
    await refreshProducts();
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
