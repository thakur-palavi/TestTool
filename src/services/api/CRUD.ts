const delay = (ms: number) => new Promise(res => setTimeout(res, ms)); // Added type for ms

export interface Product {
    id: string;
    title: string;
}

export const getAllProducts = async (): Promise<Product[]> => {
    await delay(2000);
    const stored = localStorage.getItem("products");
    const products: Product[] = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(products)) {
        console.error("localStorage 'products' is not an array, clearing.");
        localStorage.removeItem("products");
        return [];
    }

    return products;
};

export const addProduct = async (title: string): Promise<Product> => {
    const products = await getAllProducts();
    const newProduct: Product = {
        id: Date.now().toString(),
        title: title,
    };
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    return newProduct;
};

export const updateProduct = async (id: string, updatedProduct: Partial<Product>): Promise<Product | undefined> => {
    const products = await getAllProducts();
    const index = products.findIndex((p: Product) => p.id === id);
    if (index !== -1) {
        const updatedProducts = [...products];
        updatedProducts[index] = { ...updatedProducts[index], ...updatedProduct };
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        return updatedProducts[index];
    }
    return undefined;
};

export const deleteProduct = async (id: string): Promise<void> => {
    const products = await getAllProducts();
    const filtered = products.filter((p: Product) => p.id !== id);
    localStorage.setItem("products", JSON.stringify(filtered));
};