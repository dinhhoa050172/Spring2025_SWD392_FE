// src/components/ServiceList/TabsContainer.jsx
const TabsContainer = ({ tabs, selectedTab, onTabChange }) => {
    return (
        <div className="w-[80%] min-w-4xl flex flex-col md:flex-row gap-6 p-5">
            {tabs.length > 0 ? (
                <>
                    <div className="flex flex-col gap-2 w-full md:w-1/4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => onTabChange(tab.value)}
                                className={`py-3 px-4 text-left text-lg font-bold rounded-md transition-colors duration-200 ${selectedTab === tab.value
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-600 hover:bg-blue-600 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="w-full md:w-3/4">
                        {tabs.find((tab) => tab.value === selectedTab)?.content}
                    </div>
                </>
            ) : (
                <h4 className="text-center text-gray-500 w-full">Không có dữ liệu vaccine</h4>
            )}
        </div>
    );
};

export default TabsContainer;