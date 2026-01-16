import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, X, Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { DbProduct, useAddProduct, useUpdateProduct, uploadProductImage } from '@/hooks/useProducts';

interface ProductFormProps {
  product?: DbProduct;
  onClose: () => void;
}

const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    description: product?.description || '',
    images: product?.images || [],
    category: product?.category || '',
    stock: product?.stock || 0,
    featured: product?.featured || false,
  });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('حجم الصورة يجب أن يكون أقل من 5MB');
        }
        return uploadProductImage(file);
      });

      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
      toast.success('تم رفع الصور بنجاح');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('حدث خطأ أثناء رفع الصور');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product.id, ...formData });
      } else {
        await addProduct.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      // Error handled in hooks
    }
  };

  const isLoading = addProduct.isPending || updateProduct.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">اسم المنتج *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="أدخل اسم المنتج"
            dir="rtl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">الفئة *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="مثال: إلكترونيات، ملابس"
            dir="rtl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">السعر (دج) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">الكمية *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={e => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <div className="space-y-2">
          <Label>منتج مميز</Label>
          <div className="flex items-center gap-2 h-10">
            <Switch
              checked={formData.featured}
              onCheckedChange={checked => setFormData(prev => ({ ...prev, featured: checked }))}
            />
            <span className="text-sm text-muted-foreground">
              {formData.featured ? 'نعم' : 'لا'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">الوصف</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="أدخل وصف المنتج"
          dir="rtl"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>صور المنتج</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {formData.images.map((img, idx) => (
            <div key={idx} className="relative aspect-square bg-muted rounded-xl overflow-hidden group">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={() => removeImage(idx)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className="aspect-square bg-muted/50 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <>
                <Package className="w-8 h-8 text-muted-foreground/50" />
                <span className="text-xs text-muted-foreground">إضافة صورة</span>
              </>
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isLoading} className="btn-fire">
          {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
          {product ? 'تحديث المنتج' : 'إضافة المنتج'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
