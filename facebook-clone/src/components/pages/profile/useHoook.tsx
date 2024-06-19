import { useState } from "react";

export const useHoook = () => {
    const [selectedTab, setSelectedTab] = useState<any>('posts');



    return{selectedTab, setSelectedTab}
}