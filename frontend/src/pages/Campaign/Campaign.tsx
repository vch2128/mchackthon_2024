import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Layout,
  Typography,
  List,
  Card,
  Button,
  Drawer,
  Badge,
  Modal,
  InputNumber,
} from 'antd';

import teddyBear from './images/teddy-bear.jpg';
import chocolateBox from './images/chocolate-box.jpg';
import flowerBouquet from './images/flower-bouquet.jpg';

const { Header, Content } = Layout;
const { Title } = Typography;

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Campaign: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartVisible, setCartVisible] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const products: Product[] = [
    { id: 1, name: 'Teddy Bear', price: 25.0, image: teddyBear },
    { id: 2, name: 'Chocolate Box', price: 15.0, image: chocolateBox },
    { id: 3, name: 'Flower Bouquet', price: 30.0, image: flowerBouquet },
    { id: 4, name: 'Flower Bouquet', price: 30.0, image: flowerBouquet },
    { id: 5, name: 'Flower Bouquet', price: 30.0, image: flowerBouquet },
    { id: 6, name: 'Flower Bouquet', price: 30.0, image: flowerBouquet },
    { id: 7, name: 'Flower Bouquet', price: 30.0, image: flowerBouquet },    
  ];

  const addToCart = (product: Product): void => {
    const quantity = quantities[product.id] || 1;
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    // Reset the quantity input after adding to cart
    setQuantities({ ...quantities, [product.id]: 1 });
  };

  const removeFromCart = (productToRemove: CartItem): void => {
    setCart(cart.filter((product) => product.id !== productToRemove.id));
  };

  const showCart = (): void => {
    setCartVisible(true);
  };

  const hideCart = (): void => {
    setCartVisible(false);
  };

  const checkout = (): void => {
    setIsModalVisible(true);
  };

  const handleOk = (): void => {
    setCart([]);
    setIsModalVisible(false);
    hideCart();
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  const onQuantityChange = (productId: number, value: number | null): void => {
    if (value && value > 0) {
      setQuantities({ ...quantities, [productId]: value });
    } else {
      setQuantities({ ...quantities, [productId]: 1 });
    }
  };

  const renderProducts = (): JSX.Element => (
    <List
      grid={{ gutter: [40, 20], column: 2 }} // Adjust rowGutter to increase vertical spacing
      dataSource={products}
      renderItem={(product: Product) => (
        <List.Item key={product.id}>
          <Card
            hoverable
            style={{ width: '100%', height: 400 }}
            cover={
              <img
                alt={product.name}
                src={product.image}
                style={{ height: 250, objectFit: 'contain', margin: 10 }}
              />
            }
            actions={[
              <div key="input" style={{ display: 'flex', alignItems: 'center' }}>
                <span>Qty: </span>
                <InputNumber
                  min={1}
                  value={quantities[product.id] || 1}
                  onChange={(value) => onQuantityChange(product.id, value)}
                />
              </div>,
              <Button
                type="primary"
                onClick={() => addToCart(product)}
                key="add"
              >
                Add to Cart
              </Button>,
            ]}
          >
            <Card.Meta
              title={product.name}
              description={`$${product.price.toFixed(2)}`}
            />
          </Card>
        </List.Item>
      )}
    />
  );
  

  const renderCart = (): JSX.Element => (
    <>
      <Badge count={cart.length} style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={showCart}>
          View Cart
        </Button>
      </Badge>
      <Drawer
        title="Your Cart"
        placement="right"
        onClose={hideCart}
        visible={cartVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <List
              dataSource={cart}
              renderItem={(product: CartItem) => (
                <List.Item
                  key={product.id}
                  actions={[
                    <Button
                      type="link"
                      onClick={() => removeFromCart(product)}
                      key="remove"
                    >
                      Remove
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={`${product.name} x${product.quantity}`}
                    description={`$${(product.price * product.quantity).toFixed(
                      2
                    )}`}
                  />
                </List.Item>
              )}
            />
            <Title level={4}>
              Total: $
              {cart
                .reduce(
                  (total: number, product: CartItem) =>
                    total + product.price * product.quantity,
                  0
                )
                .toFixed(2)}
            </Title>
            <Button type="primary" onClick={checkout}>
              Proceed to Checkout
            </Button>
          </>
        )}
      </Drawer>
      <Modal
        title="Order Confirmation"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Thank you for your purchase!</p>
      </Modal>
    </>
  );

  return (
    <Layout >
      <Content
    style={{
      padding: '20px',
      maxHeight: '100vh', // Ensure the content area fits within the viewport
      overflowY: 'auto', // Enable vertical scrolling if content exceeds the viewport height
      overflowX: 'hidden', // Prevent horizontal scrolling unless necessary
      WebkitOverflowScrolling: 'touch', // Enable smooth scrolling on touch devices
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none', // Internet Explorer and Edge
    }}
  >
        <br></br>
        <br></br>
        {renderCart()}
        <br></br>
        <br></br>
        {renderProducts()}
      </Content>
    </Layout>
  );
};

export default Campaign;
