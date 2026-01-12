import { useState } from 'react';
import { Product } from '@/types';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import ProductForm from './ProductForm';
import { Pencil, Trash2, Plus, Package } from 'lucide-react';
import { toast } from 'sonner';

const ProductList = () => {
  const { products, deleteProduct } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success('Product deleted successfully');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl font-semibold">Products</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-display text-xl text-muted-foreground">No products yet</h3>
          <p className="text-sm text-muted-foreground mt-2">Add your first product to get started</p>
          <Button onClick={handleAdd} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-card rounded-lg overflow-hidden card-elevated">
              <div className="aspect-video bg-secondary/50 relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display font-medium mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">${product.price}</span>
                  <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(product)}>
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{product.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm product={editingProduct} onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;
