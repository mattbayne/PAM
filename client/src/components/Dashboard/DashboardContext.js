import { createContext } from 'react';

const DashboardContext = createContext({
    selectedFunctionality: null,
    setSelectedFunctionality: () => {},
});

export default DashboardContext;
