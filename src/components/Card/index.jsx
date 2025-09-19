const Card = ({ image, title, description, buttonText }) => {
    return (
        <div className="max-w-sm bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            {image && (
                <img className="w-full h-48 object-cover rounded-t-lg" src={image} alt={title} />
            )}
            <div className="p-4">
                <h5 className="text-xl font-bold text-gray-800">{title}</h5>
                <p className="mt-2 text-gray-600">{description}</p>
                <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
                    {buttonText || "Learn More"}
                </button>
            </div>
        </div>
    );
};

