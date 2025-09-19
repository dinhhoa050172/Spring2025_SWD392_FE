const CardInfo = ({ icon, title, money }) => {
  return (
    <div className=" bg-white border border-gray-300 rounded-lg shadow-md hover:bg-blue-200 hover:text-white transition-shadow ">
      <div className="flex justify-center pt-2 text- text-blue-500 ">
        {icon}
      </div>
      <div className="p-2 ">
        <h5 className="text-xl font-bold text-gray-800">{title}</h5>
        <p className="mt-2 text-gray-600">{money}</p>
      </div>
    </div>
  );
};

export default CardInfo;
