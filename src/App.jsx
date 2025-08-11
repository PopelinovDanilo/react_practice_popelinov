import React, { useState } from 'react';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { Products } from './components/Products/Products';
import { Filter } from './components/Filter/Filter';

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(
    categoriesFromServer.map(cat => ({ id: cat.id, isSelected: false })),
  );
  const [sort, setSort] = useState({ type: 'ID', ascOrder: true });

  let filteredProducts = productsFromServer.map(prod => {
    const category = categoriesFromServer.find(
      categor => categor.id === prod.categoryId,
    );
    const user = usersFromServer.find(us => us.id === category.ownerId);

    return { ...prod, category, user };
  });

  if (selectedUser) {
    filteredProducts = filteredProducts.filter(
      item => item.user.name === selectedUser,
    );
  }

  if (selectedProduct) {
    filteredProducts = filteredProducts.filter(item =>
      item.name.toLowerCase().includes(
        selectedProduct.toLowerCase(),
        // eslint-disable-next-line
      ));
  }

  if (
    selectedCategories.reduce(
      (count, cat) => (cat.isSelected ? count + 1 : count),
      0,
    ) !== categoriesFromServer.length
  ) {
    filteredProducts = filteredProducts.filter(item =>
      selectedCategories.some(
        cat => cat.id === item.category.id && cat.isSelected,
        // eslint-disable-next-line
      ));
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <Filter
            users={usersFromServer}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            categoryList={categoriesFromServer}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>

        <div className="box table-container">
          <Products
            itemArray={filteredProducts}
            sort={sort}
            setSort={setSort}
          />
        </div>
      </div>
    </div>
  );
};
