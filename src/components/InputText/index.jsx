
const InputText = ({ label, name, register, required, error, ...rest }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <input
                {...register(name, { required })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none 
        ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                {...rest}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
};

export default InputText;


//example: 
{/* 
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <Input label="Your Name" name="name" register={register} required={{ message: "Name is required" }} error={errors.name} />
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Submit
            </button>
        </form>
    </div> 
*/}