import { userService } from "@src/services/userService.js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import StepIndicator from "./Steper.jsx";
import SelectChild from "./Step/Step1.jsx";
import SelectVaccine from "./Step/Step2.jsx";
import ConfirmInfo from "./Step/Step3.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVaccineAndPackages,
  fetchVaccines,
} from "@src/stores/slices/serviceSlice.js";
import { CircularProgress } from "@mui/material";
import { appointmentService } from "@src/services/appointmentService.js";
import { toast } from "react-toastify";
import { formatTime } from "@utils/format.js";
import { useNavigate } from "react-router-dom";
import { message } from "@utils/message.js";
import routes from "@src/router/index.js";

const RegisterVaccination = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();
  const [step, setStep] = useState(1);
  const [listChild, setListChild] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [methodPayment, setMethodPayment] = useState("online");
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.service);
  const navigate = useNavigate();

  useEffect(() => {
    const idParent = localStorage.getItem("userId");

    const fetchChildren = async () => {
      try {
        const response = await userService.getAllChildProfile(idParent);
        setListChild(response);
      } catch (error) {
        console.error(error);
      }
    };

    dispatch(fetchVaccines());
    dispatch(fetchVaccineAndPackages());
    fetchChildren();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);

    const isPackage =
      selectedVaccines.length > 0 && selectedVaccines[0]?.type === "package";

    const register = {
      vaccinationRecordId: selectedChild.id,
      vaccines: !isPackage
        ? selectedVaccines.map((vaccine) => vaccine.vaccineId)
        : null,
      vaccinePackageId: isPackage ? selectedVaccines[0]?.id : null,
      scheduleDate: data.date,
      timeFrom: formatTime(data.time),
      notes: data.notes,
    };

    try {
      const response = await appointmentService.createAppointment(register);
      if (response) {
        toast.success(message.REGISTER_SUCCESS, {
          autoClose: 4000,
          closeOnClick: true,
        });
        if (methodPayment === "online") {
          window.location.href = response.data.vnpayUrl;
        } else {
          navigate(routes.user.selfSchedule);
        }
      } else {
        toast.error(message.REGISTER_ERROR, {
          autoClose: 4000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      if (error.details && Array.isArray(error.details)) {
        error.details.forEach((detail) => {
          toast.error("Lỗi: " + detail, {
            autoClose: 4000,
            closeOnClick: true,
          });
        });
      } else {
        toast.error(message.REGISTER_ERROR, {
          autoClose: 4000,
          closeOnClick: true,
        });
      }
      console.error(message.REGISTER_ERROR, error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading")
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );

  return (
    <div className="flex flex-col items-center my-3 h-auto p-6">
      <div className="w-screen max-w-4xl min-w-min text-center">
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <StepIndicator step={step} />
          {step === 1 && (
            <SelectChild
              listChild={listChild}
              setSelectedChild={setSelectedChild}
              selectedChild={selectedChild}
            />
          )}
          {step === 2 && (
            <SelectVaccine
              setSelectedVaccines={setSelectedVaccines}
              selectedVaccines={selectedVaccines}
              register={register}
              errors={errors}
              setMethodPayment={setMethodPayment}
              setValue={setValue}
            />
          )}
          {step === 3 && (
            <ConfirmInfo
              selectedChild={selectedChild}
              selectedVaccines={selectedVaccines}
              values={getValues()}
              methodPayment={methodPayment}
            />
          )}
        </div>
        <div className="mt-4 flex justify-between">
          {step > 1 && (
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={() => setStep(step - 1)}
            >
              Quay lại
            </button>
          )}
          {step < 3 ? (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                if (step === 1) {
                  if (!selectedChild) {
                    toast.error(message.SELECT_PATIENT, {
                      autoClose: 3000,
                    });
                    return;
                  }
                }
                if (step === 2) {
                  const date = getValues("date");
                  const time = getValues("time");

                  if (selectedVaccines.length === 0) {
                    toast.error(message.SELECT_VACCINE, {
                      autoClose: 3000,
                    });
                    return;
                  }
                  if (!date) {
                    toast.error(message.SELECT_DATE, {
                      autoClose: 3000,
                    });
                    return;
                  }
                  if (!time) {
                    toast.error(message.SELECT_TIME, {
                      autoClose: 3000,
                    });
                    return;
                  }
                }
                setStep(step + 1);
              }}
            >
              Tiếp tục
            </button>
          ) : (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={16} color="inherit" className="mx-6" />
              ) : (
                "Đăng ký"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default RegisterVaccination;
