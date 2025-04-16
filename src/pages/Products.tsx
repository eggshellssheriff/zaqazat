
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { ProductForm } from "@/components/ProductForm";
import { Search } from "@/components/Search";
import { Plus } from "lucide-react";

const Products = () => {
  const { products } = useApp();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = searchQuery
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <Layout title="Товары">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <Search type="products" />
          
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить товар
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Нет товаров</h3>
            <p className="text-muted-foreground mb-4">
              Добавьте первый товар, чтобы начать управление инвентарем
            </p>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить товар
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <ProductForm open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </Layout>
  );
};

export default Products;
