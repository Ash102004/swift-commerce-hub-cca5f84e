import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Pencil, Trash2, Plus, Package, Loader2, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { DbProduct, useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { staggerContainer, staggerItem } from '@/components/motion/MotionComponents';

const ProductList = () => {
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | undefined>();

  const handleEdit = (product: DbProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
    } catch (error) {
      // Error handled in hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-10 h-10 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-semibold gold-text">المنتجات</h2>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={handleAdd} className="btn-royal rounded-none px-6">
            <Plus className="w-4 h-4 mr-2" />
            إضافة منتج
          </Button>
        </motion.div>
      </motion.div>

      {products.length === 0 ? (
        <motion.div 
          className="card-royal rounded-none py-16 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 mx-auto border-2 border-primary/30 flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h3 className="font-display text-xl mb-2">لا توجد منتجات بعد</h3>
          <p className="text-sm text-muted-foreground mb-6">أضف منتجك الأول للبدء</p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleAdd} className="btn-royal rounded-none">
              <Plus className="w-4 h-4 mr-2" />
              إضافة منتج
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div 
                key={product.id} 
                variants={staggerItem}
                layout
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="card-royal rounded-none overflow-hidden"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <motion.img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {product.featured && (
                    <motion.span 
                      className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-3 py-1 font-display flex items-center gap-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Crown className="w-3 h-3" />
                      مميز
                    </motion.span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display font-medium text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{product.description}</p>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <span className="font-display font-semibold text-primary text-lg">{product.price.toLocaleString()} دج</span>
                    <span className="text-sm text-muted-foreground">المخزون: {product.stock}</span>
                  </div>
                  <div className="flex gap-3">
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full rounded-none border-border hover:border-primary hover:bg-primary/10 font-display" 
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        تعديل
                      </Button>
                    </motion.div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="destructive" size="sm" className="rounded-none">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-none">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-display">حذف المنتج</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف "{product.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-none font-display">إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)} className="rounded-none font-display">
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-none">
          <DialogHeader>
            <DialogTitle className="font-display text-xl gold-text">
              {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm product={editingProduct} onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;
