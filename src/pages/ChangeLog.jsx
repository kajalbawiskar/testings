import axios from "axios";
import React, { useEffect, useReducer, useState ,useRef} from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import {  FaColumns} from "react-icons/fa"; 
import { BiHide } from "react-icons/bi"; 
import ModifyColumns from "./Tools/ModifyColumns";
function ChangeLog() {
  const [data, setData] = useState([]);
  const [columns,setColumns] = useState([
    { id:"0",title: "Date", key: "date", visible: true ,category:Performance},
    { id:"1",title: "Activity", key: "activity", visible: true,category:Performance },
    { id:"2",title: "Campagin/AdGroup", key: "campaign_ad_group", visible: true ,category:Performance},
    { id:"3",title: "Change", key: "change_description", visible: true ,category:Performance},
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataIsNull, setDataIsNull] = useState(true);
  let ColumnRef = useRef(null)

  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [tableVisible, setTableVisible] = useState(true);
  const openColumnsMenu = () => {
    setShowColumnsMenu(true);
    setTableVisible(false);
  };

  const [campaigns, setCampaigns] = useState([]);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [formVisible, setFormVisible] = useState(false);
  const [formSymbol, setFormSymbol] = useState("+");

  const [formValues, setFormValues] = useState({
    activity: "",
    campaign_ad_group: "",
    change_description: "",
    email: localStorage.getItem("email") || "",
  });

  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    const { activity, campaign_ad_group, change_description, email } = formValues;

    if (!activity || !campaign_ad_group || !change_description || !email) {
      alert("All fields are required!");
      return;
    }

    axios
      .post("https://api.confidanto.com/change-log/create", formValues)
      .then((res) => {
        console.log("Data Added", res);
        setFormVisible(false);
        setFormSymbol("+");
        forceUpdate();
      })
      .catch((error) => {
        console.error("Error creating change log:", error);
        alert("Something went wrong while submitting the form.");
      });
  };

  useEffect(() => {
    axios
      .post("https://api.confidanto.com/get-campaigns-list", {
        customer_id: "4643036315",
      })
      .then((res) => {
        console.log("Campaigns ", res);
        setCampaigns(res.data);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    axios
      .post("https://api.confidanto.com/change-log/get", {
        email: localStorage.getItem("email"),
      })
      .then((res) => {
        console.log(res.data.data);
        setData(res.data.data);
        setIsLoading(false);
        setDataIsNull(false);
      })
      .catch(() => {
        setIsLoading(false);
        setDataIsNull(true);
      });
  }, [formVisible]);

  return (
    <div className="p-6 max-w-7xl mx-auto mb-10">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Change Log</h1>
      </div>

      <div className="relative flex justify-end" 
                   ref={ColumnRef} >
                      <button
                        className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                        onClick={openColumnsMenu}
                        // onClick={()=>{closeModalBoxes("Column")}}
                      >
                        <FaColumns className="ml-5" /> Columns
                      </button>
                      {showColumnsMenu && (
                        <ModifyColumns columns={columns}
                        setColumns={setColumns}
                        setTableVisible={setTableVisible}
                        setShowColumnsMenu={setShowColumnsMenu} 
                        />
                      
                      )}
                    </div>
  
      {/* Table Container */}
      <div className="bg-white rounded-md shadow-md rounded-t mb-4">
        <table className="min-w-full table-auto text-sm -mb-20 ">
          <thead className="bg-indigo-900 border-b  text-white">
            <tr className="rounded-t">
              {columns
                .filter((col) => col.visible)
                .map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-4 text-left  text-white border-r-2 border-gray-200 font-medium uppercase tracking-wider"
                  >
                    {col.title}
                  </th>
                ))}
            </tr>
          </thead>
          {!isLoading && !dataIsNull && (
            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {columns
                    .filter((col) => col.visible)
                    .map((col) => (
                      <td key={col.key} className="px-6 py-4 border-r-2 border-gray-200 text-gray-700">
                        {Array.isArray(item[col.key])
                          ? item[col.key].join(", ")
                          : item[col.key]}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
  
        {/* Loading or No Data */}
        <div className="flex items-center justify-center p-10">
          {isLoading ? (
            <LoadingAnimation />
          ) : dataIsNull ? (
            <div className="text-lg text-gray-500">No data found</div>
          ) : null}
        </div>
      </div>
  
      {/* Form Toggle */}
      <div className="mb-4">
        <button
          onClick={() => {
            const newVisibility = !formVisible;
            setFormVisible(newVisibility);
            setFormSymbol(newVisibility ? "-" : "+");
          }}
          className="text-white bg-indigo-900  px-5 py-2 rounded-lg text-lg shadow transition"
        >
          {formSymbol === "+" ? "Add New Log" : <BiHide />}
        </button>
      </div>
  
      {/* Form */}
      {formVisible && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit();
          }}
          className="bg-white p-6 rounded-2xl shadow-md space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Add Change Log
          </h2>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity
            </label>
            <input
              type="text"
              name="activity"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleFormChange}
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign/Ad Group
            </label>
            <select
              name="campaign_ad_group"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleFormChange}
            >
              <option value="">Select Campaign</option>
              {campaigns.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Change Description
            </label>
            <input
              type="text"
              name="change_description"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleFormChange}
            />
          </div>
  
          <div className="text-right">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-md shadow transition"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
  
}

export default ChangeLog;
