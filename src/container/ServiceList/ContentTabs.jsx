// src/components/ServiceList/ContentTabs.jsx
export const generateTabsData = (vaccinesPackage) => {
    if (!vaccinesPackage || vaccinesPackage.length === 0) return [];

    return vaccinesPackage.map((packageVaccine) => ({
        label: packageVaccine.vaccinePackageName,
        value: packageVaccine.vaccinePackageId,
        content: (
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{packageVaccine.vaccinePackageName}</h2>
                <p className="text-gray-600 mb-4">{packageVaccine.description}</p>
                <p className="font-semibold text-gray-700 mb-4">
                    Tổng giá: {packageVaccine.totalPrice.toLocaleString()} VND
                </p>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-3 text-left text-gray-700">Bệnh</th>
                            <th className="border border-gray-300 p-3 text-left text-gray-700">Vaccine</th>
                            <th className="border border-gray-300 p-3 text-left text-gray-700">Xuất xứ</th>
                            <th className="border border-gray-300 p-3 text-left text-gray-700">Liều</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packageVaccine.vaccineLineServiceDTO.map((vaccine, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="border border-gray-300 p-3">{vaccine.diseaseName}</td>
                                <td className="border border-gray-300 p-3">{vaccine.vaccineName}</td>
                                <td className="border border-gray-300 p-3">{vaccine.countryOfOrigin}</td>
                                <td className="border border-gray-300 p-3 text-center">{vaccine.doseNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ),
    }));
};