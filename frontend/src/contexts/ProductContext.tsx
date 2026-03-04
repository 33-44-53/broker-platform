'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { api } from '@/utils/api';
import { mockProducts } from '@/mock-data/products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const refreshProducts = async () => {
    try {
      const data = await api.getProducts();
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((p: any) => ({
          ...p,
          images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
          isActive: p.is_active ?? p.isActive ?? true,
        }));
        setProducts(formatted);
      } else {
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts(mockProducts);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = async (productData: any) => {
    const newProduct = { ...productData, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
    try {
      const payload = { ...productData };
      if (Array.isArray(payload.images)) {
        payload.images = JSON.stringify(payload.images);
      }
      await api.createProduct(payload);
      await refreshProducts();
    } catch (error) {
      console.error('API error:', error);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product> | null) => {
    if (productData === null) {
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
    }
    try {
      if (productData !== null) {
        const payload = { id, ...productData };
        if (Array.isArray(payload.images)) {
          payload.images = JSON.stringify(payload.images);
        }
        await api.updateProduct(payload);
      }
    } catch (error) {
      console.error('API error:', error);
      await refreshProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
    } catch (error) {
      console.error('API error:', error);
    }
    await refreshProducts();
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
