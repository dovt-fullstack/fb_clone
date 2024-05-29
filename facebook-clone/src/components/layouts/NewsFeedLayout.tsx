import React, { PropsWithChildren } from 'react';
import Navbar from '../atoms/navbar';
import MainContentContainer from '../common';


const NewsFeedLayout: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <MainContentContainer>
        <div className="flex">
          {/* <LeftSidebar /> */}
          <div className="flex-1 ">{children}</div>
          {/* <RightSidebar /> */}
        </div>
      </MainContentContainer>
    </div>
  );
};

export default NewsFeedLayout;
