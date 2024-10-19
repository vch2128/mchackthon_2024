import React, { useState, useContext, useEffect} from 'react';
import { UserContext } from '../../context/UserContext';
import { useLocation } from 'react-router-dom';
import {
  Layout,
  Typography,
  List,
  Card,
  Button,
  Drawer,
  Modal,
} from 'antd';

import teddyBear from './images/teddy-bear.jpg';
import chocolateBox from './images/chocolate-box.jpg';
import flowerBouquet from './images/flower-bouquet.jpg';

const { Header, Content } = Layout;
const { Title } = Typography;

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  num: number;
  expire: Date;
}

interface CartItem extends Product {
  quantity: number;
}

const CountdownTimer = ({ expire }: { expire: Date }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = expire.getTime() - now.getTime();
    let timeLeft = { hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [timeLeft, expire]);

  return (
    <div>
      {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
    </div>
  );
};

const Campaign: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartVisible, setCartVisible] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const { user } = useContext(UserContext);
  
  const products: Product[] = [
    { id: "1", name: 'Teddy Bear', price: 25.0, image: teddyBear, num: 4, expire: new Date(new Date().setHours(new Date().getHours() + 2)) },
    { id: "2", name: 'Chocolate Box', price: 15.0, image: chocolateBox, num: 4, expire: new Date(new Date().setHours(new Date().getHours() + 2)) },
    { id: "3", name: 'Flower Bouquet', price: 30.0, image: flowerBouquet, num: 4, expire: new Date(new Date().setHours(new Date().getHours() + 2)) },
    { id: "4", name: 'Flower Bouquet', price: 30.0, image: flowerBouquet, num: 4, expire: new Date(new Date().setHours(new Date().getHours() + 2)) },
    { id: "5", name: 'Flower Bouquet', price: 30.0, image: flowerBouquet, num: 4, expire: new Date(new Date().setHours(new Date().getHours() + 2)) },
    { id: "6", name: 'Flower Bouquet', price: 30.0, image: flowerBouquet, num: 4, expire: new Date(new Date().setHours(new Date().getHours() + 2)) },
    { id: "7", name: 'Flower Bouquet', price: 30.0, image: flowerBouquet, num: 4, expire: new Date(new Date().setHours(new Date().getHours() + 2)) },    
  ];

  const isVerified = async (product: Product) => {
    if (user){
      if (user.wallet > product.price && product.num > 0){
        return true;
      }
    }
    return false;
  };

  const handleOrder = async (product: Product): Promise<void> => {
    const flag = await isVerified(product);
    if (flag){
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, num: item.num-1 }
            : item
        )
      );
    }else {
      return 
    }
  }

  const removeFromCart = (productToRemove: CartItem): void => {
    setCart(cart.filter((product) => product.id !== productToRemove.id));
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

  const onQuantityChange = (productId: string, value: number | null): void => {
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
          <CountdownTimer expire={product.expire} />
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
              <div key="input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span>剩餘數量: {product.num}</span>
              </div>, 
              <Button
                type="primary"
                onClick={() => handleOrder(product)}
              >
                立即卡位
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