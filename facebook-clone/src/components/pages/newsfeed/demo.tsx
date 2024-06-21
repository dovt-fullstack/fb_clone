import React, { useState, useEffect } from "react";
import { Drawer, Button, Form, Input, Space, Popover, Tabs } from "antd";
import { useLocation } from "react-router-dom";
import axios from "axios";

const UserPage = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countLike, setCountLike] = useState(0);
  const [countTym, setCountTym] = useState(0);
  const [dataLike, setDataLike] = useState([]);
  const [dataTym, setDataTym] = useState([]);
  const [searchFriend, setSearchFriend] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchDataLike();
    fetchDataTym();
    fetchDataFriend();
  }, []);

  useEffect(() => {
    fetchDataLike();
    fetchDataTym();
  }, [countLike, countTym]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const fetchDataLike = async () => {
    try {
      const res = await axios.get("/api/like");
      setDataLike(res.data);
      setCountLike(res.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataTym = async () => {
    try {
      const res = await axios.get("/api/tym");
      setDataTym(res.data);
      setCountTym(res.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataFriend = async () => {
    try {
      const res = await axios.get("/api/friend");
      setSearchFriend(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (value) => {
    const filteredFriends = searchFriend.filter((friend) =>
      friend.toLowerCase().includes(value.toLowerCase())
    );
    setSearchFriend(filteredFriends);
  };

  const { TabPane } = Tabs;

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Drawer title="Basic Drawer" placement="right" onClose={onClose} open={open}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Tab 1" key="1">
            Content of Tab 1
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content of Tab 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            <Popover content={<p>Content</p>} title="Title">
              <Button type="primary">Popover</Button>
            </Popover>
            <Form>
              <Form.Item>
                <Input placeholder="Search friends" onChange={(e) => handleSearch(e.target.value)} />
              </Form.Item>
              <Space direction="vertical">
                {searchFriend.map((friend, index) => (
                  <p key={index}>{friend}</p>
                ))}
              </Space>
            </Form>
          </TabPane>
        </Tabs>
      </Drawer>
    </>
  );
};

export default UserPage;
