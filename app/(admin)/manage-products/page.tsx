"use client";
import React, { useState } from 'react';
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaPlus, FaDownload, FaUpload } from 'react-icons/fa';
import { products as importedProducts } from '@/public/assets/assets';

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  status: string;
  rating: number;
  reviews: number;
  image: any[];
  tags: string[];
  ingredients: string[];
  allergens: string[];
  preparationTime: string;
  calories: number;
  createdAt: string;
  updatedAt: string;
};

const ManageProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>(importedProducts);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const PRODUCTS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  const categories = ['Adamawa', 'Centre', 'East', 'Far North', 'Littoral', 'North', 'Northwest', 'West', 'South', 'Southwest'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockColor = (stock: number) => {
    if (stock > 20) return 'text-green-600';
    if (stock > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleDelete = (product: Product) => {
    setDeleteProduct(product);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    if (!deleteProduct) return;
    setProducts(products.filter(p => p.id !== deleteProduct.id));
    setShowDeleteModal(false);
    setDeleteProduct(null);
  };
  const handleEdit = (product: Product) => {
    setEditProduct(product);
  };
  const handleEditSave = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditProduct(null);
  };
  const handleView = (product: Product) => {
    setViewProduct(product);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product> | null>(null);

  // Export products as CSV
  const handleExport = () => {
    let csv = 'id,name,description,category,price,originalPrice,stock,status,rating,reviews,tags,ingredients,allergens,preparationTime,calories,createdAt,updatedAt\n';
    products.forEach(p => {
      csv += `${p.id},${p.name},${p.description.replace(/,/g, ' ')},${p.category},${p.price},${p.originalPrice},${p.stock},${p.status},${p.rating},${p.reviews},${p.tags.join('|')},${p.ingredients.join('|')},${p.allergens.join('|')},${p.preparationTime},${p.calories},${p.createdAt},${p.updatedAt}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import products from CSV
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(Boolean);
      const [header, ...rows] = lines;
      const keys = header.split(',');
      const imported = rows.map(row => {
        const values = row.split(',');
        const obj: any = {};
        keys.forEach((k, i) => obj[k.trim()] = values[i]?.trim());
        return {
          id: obj.id,
          name: obj.name,
          description: obj.description,
          category: obj.category,
          price: Number(obj.price),
          originalPrice: Number(obj.originalPrice),
          stock: Number(obj.stock),
          status: obj.status,
          rating: Number(obj.rating),
          reviews: Number(obj.reviews),
          image: [], // Images can't be imported from CSV
          tags: obj.tags ? obj.tags.split('|') : [],
          ingredients: obj.ingredients ? obj.ingredients.split('|') : [],
          allergens: obj.allergens ? obj.allergens.split('|') : [],
          preparationTime: obj.preparationTime,
          calories: Number(obj.calories),
          createdAt: obj.createdAt,
          updatedAt: obj.updatedAt,
        };
      });
      setProducts(imported);
    };
    reader.readAsText(file);
  };

  // Add Product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct) return;
    setProducts([
      { ...newProduct, id: `PROD-${Date.now()}` } as Product,
      ...products,
    ]);
    setShowAddModal(false);
    setNewProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
          <p className="text-gray-600">View and manage all products in your menu</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2" onClick={() => fileInputRef.current?.click()}>
            <FaUpload />
            Import
          </button>
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImport} className="hidden" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" onClick={handleExport}>
            <FaDownload />
            Export
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2" onClick={() => setShowAddModal(true)}>
            <FaPlus />
            Add Product
          </button>
        </div>
        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Add Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input type="text" placeholder="Name" className="w-full border rounded px-3 py-2" value={newProduct?.name || ''} onChange={e => setNewProduct({ ...(newProduct || {}), name: e.target.value })} required />
                <textarea placeholder="Description" className="w-full border rounded px-3 py-2" value={newProduct?.description || ''} onChange={e => setNewProduct({ ...(newProduct || {}), description: e.target.value })} required />
                <input type="text" placeholder="Category" className="w-full border rounded px-3 py-2" value={newProduct?.category || ''} onChange={e => setNewProduct({ ...(newProduct || {}), category: e.target.value })} required />
                <input type="number" placeholder="Price" className="w-full border rounded px-3 py-2" value={newProduct?.price || ''} onChange={e => setNewProduct({ ...(newProduct || {}), price: Number(e.target.value) })} required />
                <input type="number" placeholder="Original Price" className="w-full border rounded px-3 py-2" value={newProduct?.originalPrice || ''} onChange={e => setNewProduct({ ...(newProduct || {}), originalPrice: Number(e.target.value) })} required />
                <input type="number" placeholder="Stock" className="w-full border rounded px-3 py-2" value={newProduct?.stock || ''} onChange={e => setNewProduct({ ...(newProduct || {}), stock: Number(e.target.value) })} required />
                <input type="text" placeholder="Status" className="w-full border rounded px-3 py-2" value={newProduct?.status || ''} onChange={e => setNewProduct({ ...(newProduct || {}), status: e.target.value })} required />
                <input type="number" placeholder="Rating" className="w-full border rounded px-3 py-2" value={newProduct?.rating || ''} onChange={e => setNewProduct({ ...(newProduct || {}), rating: Number(e.target.value) })} required />
                <input type="number" placeholder="Reviews" className="w-full border rounded px-3 py-2" value={newProduct?.reviews || ''} onChange={e => setNewProduct({ ...(newProduct || {}), reviews: Number(e.target.value) })} required />
                <input type="text" placeholder="Tags (comma separated)" className="w-full border rounded px-3 py-2" value={newProduct?.tags?.join(',') || ''} onChange={e => setNewProduct({ ...(newProduct || {}), tags: e.target.value.split(',').map(t => t.trim()) })} />
                <input type="text" placeholder="Ingredients (comma separated)" className="w-full border rounded px-3 py-2" value={newProduct?.ingredients?.join(',') || ''} onChange={e => setNewProduct({ ...(newProduct || {}), ingredients: e.target.value.split(',').map(t => t.trim()) })} />
                <input type="text" placeholder="Allergens (comma separated)" className="w-full border rounded px-3 py-2" value={newProduct?.allergens?.join(',') || ''} onChange={e => setNewProduct({ ...(newProduct || {}), allergens: e.target.value.split(',').map(t => t.trim()) })} />
                <input type="text" placeholder="Preparation Time" className="w-full border rounded px-3 py-2" value={newProduct?.preparationTime || ''} onChange={e => setNewProduct({ ...(newProduct || {}), preparationTime: e.target.value })} />
                <input type="number" placeholder="Calories" className="w-full border rounded px-3 py-2" value={newProduct?.calories || ''} onChange={e => setNewProduct({ ...(newProduct || {}), calories: Number(e.target.value) })} />
                <input type="text" placeholder="Created At" className="w-full border rounded px-3 py-2" value={newProduct?.createdAt || ''} onChange={e => setNewProduct({ ...(newProduct || {}), createdAt: e.target.value })} />
                <input type="text" placeholder="Updated At" className="w-full border rounded px-3 py-2" value={newProduct?.updatedAt || ''} onChange={e => setNewProduct({ ...(newProduct || {}), updatedAt: e.target.value })} />
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => { setShowAddModal(false); setNewProduct(null); }}>Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Add</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <FaFilter />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedProducts.length} product(s) selected
            </span>
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                Activate
              </button>
              <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors">
                Deactivate
              </button>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                className="absolute top-3 left-3 z-10 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <img
                src={product.image[0].src}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{product.price} FCFA</p>
                  {product.originalPrice > product.price && (
                    <p className="text-sm text-gray-500 line-through">{product.originalPrice} FCFA</p>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                </div>
                <span className={`text-sm font-medium ${getStockColor(product.stock)}`}>
                  Stock: {product.stock}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                <div>
                  <span className="font-medium">Category:</span> {product.category}
                </div>
                <div>
                  <span className="font-medium">Prep Time:</span> {product.preparationTime}
                </div>
                <div>
                  <span className="font-medium">Calories:</span> {product.calories}
                </div>
                <div>
                  <span className="font-medium">Allergens:</span> {product.allergens.length}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => handleView(product)} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                  <FaEye />
                  View
                </button>
                <button onClick={() => handleEdit(product)} className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                  <FaEdit />
                  Edit
                </button>
                <button onClick={() => handleDelete(product)} className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1">
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * PRODUCTS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)}</span> of{' '}
            <span className="font-medium">{filteredProducts.length}</span> results
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 text-sm rounded ${currentPage === i + 1 ? 'bg-red-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{viewProduct.name}</h2>
            <img src={viewProduct.image[0].src} alt={viewProduct.name} className="w-full h-48 object-cover mb-4" />
            <p className="mb-2">{viewProduct.description}</p>
            <div className="mb-2">Price: <b>{viewProduct.price} FCFA</b></div>
            <div className="mb-2">Category: {viewProduct.category}</div>
            <div className="mb-2">Stock: {viewProduct.stock}</div>
            <div className="mb-2">Tags: {viewProduct.tags.join(', ')}</div>
            <div className="mb-2">Ingredients: {viewProduct.ingredients.join(', ')}</div>
            <div className="mb-2">Allergens: {viewProduct.allergens.join(', ')}</div>
            <div className="mb-2">Prep Time: {viewProduct.preparationTime}</div>
            <div className="mb-2">Calories: {viewProduct.calories}</div>
            <div className="mb-2">Created: {viewProduct.createdAt}</div>
            <div className="mb-2">Updated: {viewProduct.updatedAt}</div>
            <button onClick={() => setViewProduct(null)} className="mt-4 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Confirm Delete</h2>
            <p>Are you sure you want to delete <b>{deleteProduct?.name}</b>?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit {editProduct.name}</h2>
            <form onSubmit={e => { e.preventDefault(); handleEditSave(editProduct); }} className="space-y-4">
              <input type="text" className="w-full border rounded px-3 py-2" value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} required />
              <textarea className="w-full border rounded px-3 py-2" value={editProduct.description} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} required />
              <input type="number" className="w-full border rounded px-3 py-2" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: Number(e.target.value) })} required />
              <input type="number" className="w-full border rounded px-3 py-2" value={editProduct.stock} onChange={e => setEditProduct({ ...editProduct, stock: Number(e.target.value) })} required />
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setEditProduct(null)} className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
