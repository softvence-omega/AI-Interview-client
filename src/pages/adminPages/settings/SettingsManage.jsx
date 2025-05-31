import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

const SettingsManage = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Link to="/userDashboard/settings-manage/general-settings" className="block">
        <div className="flex justify-between items-center bg-white p-5 rounded-lg hover:shadow-md transition">
          <h2 className="text-[#212121] md:text-[20px] lg:text-[20px] font-medium">General Settings</h2>
          <FaArrowRightLong className="text-white bg-[#37B874] rounded-full w-8 h-8 p-2" />
        </div>
      </Link>

      <Link to="/userDashboard/settings-manage/subscription" className="block">
        <div className="flex justify-between items-center bg-white p-5 rounded-lg hover:shadow-md transition">
          <h2 className="text-[#212121] text-[16px] md:text-[20px] lg:text-[20px] font-medium">Subscription and Payment Settings</h2>
          <FaArrowRightLong className="text-white bg-[#37B874] rounded-full w-8 h-8 p-2" />
        </div>
      </Link>

      <Link to="/userDashboard/settings-manage/privacy" className="block">
        <div className="flex justify-between items-center bg-white p-5 rounded-lg hover:shadow-md transition">
          <h2 className="text-[#212121] md:text-[20px] lg:text-[20px] font-medium">Privacy Options</h2>
          <FaArrowRightLong className="text-white bg-[#37B874] rounded-full w-8 h-8 p-2" />
        </div>
      </Link>
    </div>
  );
};

export default SettingsManage;
