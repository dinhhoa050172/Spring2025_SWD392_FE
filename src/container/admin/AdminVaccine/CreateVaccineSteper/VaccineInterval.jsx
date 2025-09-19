import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import vaccineService from '@src/services/vaccineService.js';
import { toast } from 'react-toastify';
import { message } from '@utils/message.js';

const VaccineIntervalForm = ({ lifeNumber, vaccineId, onSubmitCallback }) => {
    const { control, handleSubmit, watch,reset, formState: { errors } } = useForm();
    const { fields, replace } = useFieldArray({
        control,
        name: 'intervals',
    });

    const watchedIntervals = watch('intervals');

    useEffect(() => {
        const initialData = Array.from({ length: Number(lifeNumber) }, (_, index) => ({
            fromDoseNumber: index,
            toDoseNumber: index + 1,
            minAgeApplicableMonth: 0,
            minAgeApplicableYear: 0,
            validateBy: 'MONTHS',
            daysBetween: 0,
        }));
        replace(initialData);
    }, [lifeNumber, replace]);

    const onSubmit = async (data) => {
        const formattedData = data.intervals.map((interval) => ({
            fromDoseNumber: Number(interval.fromDoseNumber),
            toDoseNumber: Number(interval.toDoseNumber),
            daysBetween: Number(interval.daysBetween),
            fromVaccineId: vaccineId,
            toVaccineId: vaccineId,
            ...(interval.validateBy === 'MONTHS'
                ? { minAgeApplicableMonth: Number(interval.minAgeApplicableMonth) }
                : { minAgeApplicableYear: Number(interval.minAgeApplicableYear) }),
            validateBy: interval.validateBy,
        }));
        console.log('Formatted data:', formattedData);

        try {
            // Gửi dữ liệu tới API (giả định có endpoint createTemplateDoseInterval)
            const response = await vaccineService.createTemplateDoseInterval(formattedData);
            if (response.code === '201') {
                toast.success(message.SUCCESS_CREATE);
                reset();
                onSubmitCallback();
            } else {
                toast.error(message.ERROR_CREATE);
            }
        } catch (error) {
            console.error(message.ERROR_CREATE, error);
            toast.error(message.ERROR_CREATE);
        }
    };

    return (
        <div className="p-6">
            {Number(lifeNumber) > 0 ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Nhập thông tin khoảng cách vaccine</h2>

                    {fields.map((field, index) => {
                        const validateBy = watchedIntervals?.[index]?.validateBy || 'MONTHS';

                        return (
                            <div
                                key={field.id}
                                className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
                            >
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                    Mũi {index + 1}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Đơn vị kiểm tra */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Đơn vị kiểm tra <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            {...control.register(`intervals.${index}.validateBy`, {
                                                required: 'Vui lòng chọn đơn vị kiểm tra',
                                            })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.intervals?.[index]?.validateBy
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500'
                                                }`}
                                        >
                                            <option value="MONTHS">Tháng</option>
                                            <option value="YEARS">Năm</option>
                                        </select>
                                        {errors.intervals?.[index]?.validateBy && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                                <FiAlertCircle className="mr-1" />{' '}
                                                {errors.intervals[index].validateBy.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Hiển thị input theo đơn vị */}
                                    {validateBy === 'MONTHS' ? (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tuổi tối thiểu (Tháng) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                {...control.register(`intervals.${index}.minAgeApplicableMonth`, {
                                                    valueAsNumber: true,
                                                    required: 'Vui lòng nhập tuổi tối thiểu',
                                                    min: { value: 0, message: 'Giá trị không được âm' },
                                                })}
                                                type="number"
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.intervals?.[index]?.minAgeApplicableMonth
                                                        ? 'border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Nhập số tháng"
                                            />
                                            {errors.intervals?.[index]?.minAgeApplicableMonth && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                                    <FiAlertCircle className="mr-1" />{' '}
                                                    {errors.intervals[index].minAgeApplicableMonth.message}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tuổi tối thiểu (Năm) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                {...control.register(`intervals.${index}.minAgeApplicableYear`, {
                                                    valueAsNumber: true,
                                                    required: 'Vui lòng nhập tuổi tối thiểu',
                                                    min: { value: 0, message: 'Giá trị không được âm' },
                                                })}
                                                type="number"
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.intervals?.[index]?.minAgeApplicableYear
                                                        ? 'border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Nhập số năm"
                                            />
                                            {errors.intervals?.[index]?.minAgeApplicableYear && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                                    <FiAlertCircle className="mr-1" />{' '}
                                                    {errors.intervals[index].minAgeApplicableYear.message}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Khoảng cách ngày */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Khoảng cách ngày <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...control.register(`intervals.${index}.daysBetween`, {
                                                valueAsNumber: true,
                                                required: 'Vui lòng nhập khoảng cách ngày',
                                                min: { value: 0, message: 'Giá trị không được âm' },
                                            })}
                                            type="number"
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.intervals?.[index]?.daysBetween
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500'
                                                }`}
                                            placeholder="Nhập số ngày"
                                        />
                                        {errors.intervals?.[index]?.daysBetween && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                                <FiAlertCircle className="mr-1" />{' '}
                                                {errors.intervals[index].daysBetween.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        type="submit"
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center w-full md:w-auto"
                    >
                        Gửi <FiCheckCircle className="ml-2" />
                    </button>
                </form>
            ) : (
                <div className="text-center">
                    <span className="text-red-600 font-bold text-lg">Không có khoảng cách nào để nhập</span>
                </div>
            )}
        </div>
    );
};

export default VaccineIntervalForm;