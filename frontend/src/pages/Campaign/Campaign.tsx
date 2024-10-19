import React, { useState, useContext, useEffect, useCallback} from 'react';
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
  Popconfirm
} from 'antd';
import axios from 'axios';
import dining from '../../assets/dining.png';


const { Header, Content } = Layout;
const { Title } = Typography;

interface CampaignData {
  id: string;
  name: string;
  description: string;
  price: number;
  image_path: string;
  quantity: number;
  expire: string; // Store as string since ISO date strings are usually used in APIs
  attenders_id: string[];
}

interface CampaignUpdate {
  name?: string;
  description?: string;
  price?: number;
  image_path?: string;
  quantity?: number;
  lasting_hours?: number;
  attenders_id?: string[];
}

type CampaignProps = {
  campaign: CampaignData;
};

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
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [expire]);

  return (
    <div>
      {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
    </div>
  );
};

const updateCampaign = async (campaignId: string, campaignUpdate: CampaignUpdate) => {
  try {
    const response = await axios.put(`/api/campaign/${campaignId}`, campaignUpdate, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Campaign updated successfully:', response.data);
    return response.data; // Return the updated campaign data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error updating campaign:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};


const getEmployeeWallet = async (employeeId: string): Promise<number> => {
  try {
    const response = await axios.get(`/api/employee/get_wallet/${employeeId}`);
    return response.data; // This will return the wallet value (int)
  } catch (error) {
    console.error('Error fetching wallet:', error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
};
interface UpdateWalletRequest {
  employee_id: string;
  value: number;
}

const updateEmployeeWallet = async (data: UpdateWalletRequest): Promise<number> => {
  try {
    const response = await axios.put('/api/employee/update_wallet', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // This will return the updated wallet value (int)
  } catch (error) {
    console.error('Error updating wallet:', error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
};

const Campaign: React.FC = () => {
  const { user } = useContext(UserContext);
  const [campaigns, setCampaigns] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignData | null>(null);
  useEffect(() => {
    const getCampaigns = async () => {
      try {
        const response = await axios.get("/api/campaigns");
        console.log("get campaigns", response.data);
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    getCampaigns();
  }, []);
  

  const isVerified = async (campaign: CampaignData) => {
    const moneyRemain = await getEmployeeWallet(user.id)
    return moneyRemain > campaign.price && campaign.quantity > 0;
  };

  const handleOrder = async (campaign: CampaignData): Promise<void> => {
    showPopconfirm()
    const flag = await isVerified(campaign);
    if (flag) {
      const updatedAttenders = [...campaign.attenders_id, String(user.id)];
      const campaignUpdate: CampaignUpdate = {
        quantity: campaign.quantity - 1, // Reduce quantity
        attenders_id: updatedAttenders,
      };
      
      const updateWallet : UpdateWalletRequest = {
        employee_id: user.id,
        value: -campaign.price,
      }
      await updateEmployeeWallet(updateWallet);
      await updateCampaign(campaign.id, campaignUpdate);
    } else {
      return;
    }
  };

  const showCampaignDetails = (campaign: CampaignData) => {
    setSelectedCampaign(campaign);  // Set the selected campaign
    setIsModalVisible(true);  // Show the modal
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);  // Hide the modal
  };

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  const renderProducts = (): JSX.Element => (
    <List
      grid={{ gutter: [40, 20], column: 2 }} // Adjust rowGutter to increase vertical spacing
      dataSource={campaigns.filter((campaign: CampaignData) => new Date(campaign.expire) > new Date())} // Filter out expired campaigns
      renderItem={(campaign: CampaignData) => (
        <List.Item key={campaign.id}>
          <CountdownTimer expire={new Date(campaign.expire)} />
          <Card
            hoverable
            style={{ width: '100%', height: 400 }}
            cover={
              <div 
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250, overflow: 'hidden' }}
                onClick={() => showCampaignDetails(campaign)}>
                <img
                  alt={campaign.name}
                  src={dining}
                  style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                />
              </div>
            }
            actions={[
              <div key="input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span>Remains: {campaign.quantity}</span>
              </div>, 
              <Popconfirm
                title="Confirmation"
                description="Click OK to confirm the order! Wish you a good day."
                open={open}
                onConfirm={handleOk}
                okButtonProps={{ loading: confirmLoading }}
                onCancel={handleCancel}
              >
                <Button
                  type="primary"
                  onClick={() => handleOrder(campaign)}
                >
                  Order
                </Button>,
              </Popconfirm>
            ]}
          >
            <Card.Meta
              title={campaign.name}
              description={`$${campaign.price.toFixed(2)}`}
            />
          </Card>
        </List.Item>
      )}
    />
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
        {renderProducts()}
        <Modal
          title={selectedCampaign?.name}
          visible={isModalVisible}
          onCancel={handleCloseModal}
          footer={[
            <Button key="back" onClick={handleCloseModal}>
              Close
            </Button>
          ]}
        >
          {selectedCampaign && (
            <div>
              <p><strong>Description:</strong> {selectedCampaign.description}</p>
              <p><strong>Price:</strong> ${selectedCampaign.price.toFixed(2)}</p>
              <p><strong>Quantity Left:</strong> {selectedCampaign.quantity}</p>
              <p><strong>Expires At:</strong> {new Date(selectedCampaign.expire).toLocaleString()}</p>
            </div>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default Campaign;