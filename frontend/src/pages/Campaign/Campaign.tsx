import { UserContext } from '../../context/UserContext';
import React, { useState, useContext, useEffect } from 'react';
import {
  Layout,
  List,
  Card,
  Button,
  Modal,
  message,
  Popconfirm,
} from 'antd';
import axios from 'axios';
import dining from '../../assets/dining.png';
import hostevent from '../../assets/hostevent.png';
import HostEventForm from './HostEventForm';

const { Content } = Layout;

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

const getCampaign = async (campaignId: string) => {
  try {
    const response = await axios.get(`/api/campaign/${campaignId}`);
    return response.data;  // Return the campaign data
  } catch (error) {
    console.error('Error:', error);
  }
};

const Campaign: React.FC = () => {
  const { user } = useContext(UserContext);
  const [campaigns, setCampaigns] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHostEventModalVisible, setIsHostEventModalVisible] = useState(false); // State for host event modal
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null);

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Enjoy your trip',
    });
  };

  const error_ = (text: string) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };

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
  }, [setIsHostEventModalVisible]);
  

  const isVerified = async (campaign: CampaignData) => {
    const moneyRemain = await getEmployeeWallet(user.id)
    const instantCampaign = await getCampaign(campaign.id)
    if (instantCampaign==null || moneyRemain==null){
      return false;
    } else {
      return (moneyRemain >= instantCampaign.price && instantCampaign.quantity > 0);
    }
  };

  const handleOrder = async (campaign: CampaignData): Promise<void> => {
    setConfirmLoading(true); // Set loading state

    const getCampaigns = async () => {
      try {
        const response = await axios.get("/api/campaigns");
        console.log("get campaigns", response.data);
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const flag = await isVerified(campaign);
    const isAttended = campaign.attenders_id.includes(user.id)
    if (isAttended) {
      error_("You have already applied the event.")
      setConfirmLoading(false)
      return 
    }
    if (flag) {
      try {
        const updatedAttenders = [...campaign.attenders_id, String(user.id)];
        const campaignUpdate: CampaignUpdate = {
          quantity: campaign.quantity - 1,
          attenders_id: updatedAttenders,
        };
        
        const updateWallet : UpdateWalletRequest = {
          employee_id: user.id,
          value: -campaign.price,
        };
  
        await updateEmployeeWallet(updateWallet);
        await updateCampaign(campaign.id, campaignUpdate);
        await getCampaigns()
        // Update the local state with the updated campaign data
        success(); // Show success message
        setTimeout(() => {
          window.location.reload(); // Reload the page after a successful order
        }, 500); // Optional delay for the success message to be seen
      } catch (err) {
        console.log("fail to place order:", err)
        error_("Failed to place order!"); // Show error message
      } finally {
        setConfirmLoading(false); // Reset loading state
        setOpenPopconfirmId(null); // Close the popconfirm
      }
    } else {
      error_("Insufficient funds or no available quantity.");
      setConfirmLoading(false); // Reset loading state if order fails
    }
  };

  const showCampaignDetails = (campaign: CampaignData) => {
    setSelectedCampaign(campaign);  // Set the selected campaign
    setIsModalVisible(true);  // Show the modal
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);  // Hide the modal
  };

  const showPopconfirm = (campaignId: string) => {
    setOpenPopconfirmId(campaignId); // Set the campaign ID to open Popconfirm for
  };
  
  const handleCancel = () => {
    setOpenPopconfirmId(null); // Close all Popconfirms by resetting the state
  };

  const showHostEventForm = () => {
    setIsHostEventModalVisible(true);  // Show the Host Event modal
  };

  const handleCloseHostEventModal = () => {
    setIsHostEventModalVisible(false);  // Hide the Host Event modal
  };

  const renderProducts = (): JSX.Element => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center'}}>
      <Card
        hoverable
        style={{ width: '100%', height: 250 }}
        cover={
          <div 
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 241, overflow: 'hidden' }}
            onClick={() => showHostEventForm()}>
            <img
              src={hostevent}
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
          </div>
        }
      >
      </Card>
      
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
                  open={openPopconfirmId === campaign.id} // Only open for the current campaign
                  onConfirm={() => handleOrder(campaign)} // Pass campaign to handleOrder
                  okButtonProps={{ loading: confirmLoading }}
                  onCancel={handleCancel}
                >
                  <Button
                    type="primary"
                    onClick={() => showPopconfirm(campaign.id)} // Open Popconfirm for this campaign
                  >
                    Order
                  </Button>
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
    </div>
  );
  
  return (
    <Layout >
      {contextHolder} 
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

        <Modal
          title="Host an Event"
          visible={isHostEventModalVisible}
          onCancel={handleCloseHostEventModal}
          footer={null}  // No footer since the form already has its submit button
        >
          <HostEventForm closeModal={handleCloseHostEventModal}/>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Campaign;