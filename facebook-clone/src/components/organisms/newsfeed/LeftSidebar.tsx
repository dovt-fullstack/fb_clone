import React from 'react';
import { useAppSelector } from '../../../store';

const LeftSidebar: React.FC = () => {
  const { user } = useAppSelector((state: any) => state.persistedReducer.auth)

  return (
    <div className="w-[22.5rem] h-auto py-3">
      <ul className="w-full text-gray-600">
        <li className="h-12 mb-2 flex items-center justify-content cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-200">
          <div>
            <img
              className="w-8 h-8 rounded-full"
              src="https://random.imagecdn.app/200/200"
              alt="user"
            />
          </div>
          <div>
            <p className="text-sm font-semibold">{ user?.username}</p>
          </div>
        </li>
        <li className="h-12 mb-2 flex items-center justify-content cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-200">
          <div>
            <img
              className="w-8 h-8 rounded-full"
              src="https://static.xx.fbcdn.net/rsrc.php/v3/yR/r/tInzwsw2pVX.png"
              alt="info"
            />
          </div>
          <div>
            <p className="text-sm font-semibold">Covid-19 Information Center</p>
          </div>
        </li>
        <li className="h-12 mb-2 flex items-center justify-content cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-200">
          <div>
  <i data-visualcompletion="css-img"  style={{backgroundImage: 'url("https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/A5UbHHnDt8X.png")', backgroundPosition: '0 -296px', backgroundSize: '37px 555px', width: 36, height: 36, backgroundRepeat: 'no-repeat', display: 'inline-block'}} />
</div>

          <div>
            <p className="text-sm font-semibold">Friends</p>
          </div>
        </li>
        <li className="h-12 mb-2 flex items-center justify-content cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-200">
          <div>
        <i data-visualcompletion="css-img"  style={{backgroundImage: 'url("https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/A5UbHHnDt8X.png")', backgroundPosition: '0 -444px', backgroundSize: '37px 555px', width: 36, height: 36, backgroundRepeat: 'no-repeat', display: 'inline-block'}} />

          </div>
          <div>
            <p className="text-sm font-semibold">Memories</p>
          </div>
        </li>
        <li className="h-12 mb-2 flex items-center justify-content cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-200">
          <div>
           <i data-visualcompletion="css-img"  style={{backgroundImage: 'url("https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/A5UbHHnDt8X.png")', backgroundPosition: '0px -111px', backgroundSize: '37px 555px', width: 36, height: 36, backgroundRepeat: 'no-repeat', display: 'inline-block'}} />

          </div>
          <div>
            <p className="text-sm font-semibold">Pages</p>
          </div>
        </li>
        <li className="h-12 mb-2 flex items-center justify-content cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-200">
          <div>
         <i data-visualcompletion="css-img"  style={{backgroundImage: 'url("https://static.xx.fbcdn.net/rsrc.php/v3/yj/r/A5UbHHnDt8X.png")', backgroundPosition: '0 -37px', backgroundSize: '37px 555px', width: 36, height: 36, backgroundRepeat: 'no-repeat', display: 'inline-block'}} />

          </div>
          <div>
            <p className="text-sm font-semibold">Groups</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default LeftSidebar;
