import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface IntroData {
  name: string;
  address: string;
  where: string;
  yearold: number; // Chỉnh sửa kiểu dữ liệu yearold từ 0 thành number
  sex: string;
  workplace: string;
  lat: number; // Chỉnh sửa kiểu dữ liệu lat và lng từ 0 thành number
  lng: number;
  default: boolean;
}

const UserProfile: React.FC<{ user: { _id: string } }> = ({ user }) => {
  const [intro, setIntro] = useState<IntroData[]>([]);
  const [updateIntro, setUpdateIntro] = useState<IntroData>({
    name: '',
    address: '',
    where: '',
    yearold: 0,
    sex: '',
    workplace: '',
    lat: 0,
    lng: 0,
    default: false,
  });



  useEffect(() => {
    const fetchUserIntro = async () => {
      try {
        const response = await axios.get<any>(`http://localhost:8000/api/address/get/${user._id}`);
        setIntro(response.data.docs); // Lưu các thông tin intro từ server vào state
      } catch (error) {
        console.error('Error fetching user intro:', error);
      }
    };

    if (user) {
      fetchUserIntro();
    }
  }, [user._id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateIntro(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/address/update/${user._id}`, updateIntro);
      alert('Intro updated successfully!');
      console.log(response.data); // Log response từ server
    } catch (error) {
      console.error('Error updating intro:', error);
    }
  };
  console.log("user._iduser._iduser._id : _",user._id)

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Form để cập nhật thông tin intro */}
        <label>
          Name:
          <input type="text" name="name" value={updateIntro.name} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Address:
          <input type="text" name="address" value={updateIntro.address} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Where:
          <input type="text" name="where" value={updateIntro.where} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Year old:
          <input type="number" name="yearold" value={updateIntro.yearold} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Sex:
          <input type="text" name="sex" value={updateIntro.sex} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Workplace:
          <input type="text" name="workplace" value={updateIntro.workplace} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Lat:
          <input type="number" name="lat" value={updateIntro.lat} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Lng:
          <input type="number" name="lng" value={updateIntro.lng} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Default:
          <input type="checkbox" name="default" checked={updateIntro.default} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Update Intro</button>
      </form>

      {/* Hiển thị thông tin intro hiện tại */}
      {intro.map((item, index) => (
        <div key={index} className="bg-white rounded-lg p-3 text-sm text-gray-600 shadow">
          <div className="mb-2">
            <p className="font-bold text-xl text-gray-800">Intro</p>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <span>
                <i className="fas fa-briefcase"></i>
              </span>
              <p>
                Work at{' '}
                <span className="font-semibold">
                  {item.workplace}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span>
                <i className="fas fa-graduation-cap"></i>
              </span>
              <p>
                Year old{' '}
                <span className="font-semibold">
                  {item.yearold}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span>
                <i className="fas fa-home"></i>
              </span>
              <p>
                Where <span className="font-semibold">{item.where}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span>
                <i className="fas fa-map-marker-alt"></i>
              </span>
              <p>
                From{' '}
                <span className="font-semibold">
                  {item.address}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span>
                <i className="fas fa-heart"></i>
              </span>
              <p>
                <span className="font-semibold">{item.sex}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
