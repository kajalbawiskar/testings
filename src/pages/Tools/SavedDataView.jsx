import { BiSave } from "react-icons/bi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

const SavedDataView = ({ adsData, shoppingResults, inlineProducts }) => {

  return (
    <div className="mb-20">
      {adsData.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-roboto font-semibold p-3 px-8 rounded-r-md text-[#40916c] bg-[#b7e4c7] w-72">
              Ads
            </h1>
          </div>
          <div>
            {adsData.map((item, index) => (
              <div key={index}>
                <div className="flex">
                  <p className="text-xl mx-4 my-4 p-3 px-5 rounded-full bg-[#40916c] font-bold h-fit text-white">
                    {index + 1}
                  </p>
                  <table className="max-w-[1500px] w-[1100px] my-4 mx-2 table-auto border-collapse border border-gray-300">
                    <tbody>
                      <tr className="bg-gray-100 hover:bg-gray-200">
                        <td className="border border-gray-300 px-4 py-2 w-40">
                          Block Position
                        </td>
                        <td className="border border-gray-300 px-4 py-2 capitalize">
                          {item.block_position}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          Position
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.position}
                        </td>
                      </tr>
                      <tr className="bg-gray-100 hover:bg-gray-200">
                        <td className="border border-gray-300 px-4 py-2">
                          Website Link
                        </td>
                        <td className="border px-4 py-2 text-blue-500 cursor-pointer hover:underline break-all">
                          {item.website_link}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          Title
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.title}
                        </td>
                      </tr>
                      <tr className="bg-gray-100 hover:bg-gray-200">
                        <td className="border border-gray-300 px-4 py-2">
                          Description
                        </td>
                        <td className="border border-gray-300 px-4 py-2 break-all">
                          {item.description ? item.description : "NA"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {shoppingResults.length > 0 && (
        <>
          <h1 className="text-2xl font-roboto mt-6 font-semibold p-3 px-8 rounded-r-md text-[#023e8a] bg-[#ade8f4] w-72">
            Shopping Results
          </h1>
          <div>
            {shoppingResults.map((item, index) => (
              <div key={index}>
                <div className="flex">
                  <p className="text-xl mx-4 my-4 p-3 px-5 rounded-full bg-[#023e8a] font-bold h-fit text-white">
                    {index + 1}
                  </p>
                  <table className="max-w-[1500px] w-[1100px] my-4 mx-2 table-auto border-collapse border border-gray-300">
                    <tbody>
                      <tr className="bg-gray-100 hover:bg-gray-200">
                        <td className="border border-gray-300 px-4 py-2 w-40">
                          Block Position
                        </td>
                        <td className="border border-gray-300 px-4 py-2 capitalize">
                          {item.block_position}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 w-40 border-gray-300">
                          Position
                        </td>
                        <td className="border px-4 py-2 border-gray-300">
                          {item.position}
                        </td>
                      </tr>
                      <tr className="bg-gray-100 hover:bg-gray-200">
                        <td className="border px-4 py-2 w-40 border-gray-300">
                          Website Link
                        </td>
                        <td className="border px-4 py-2 break-all text-blue-500 cursor-pointer hover:underline border-gray-300">
                          {item.website_link}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 w-40 border-gray-300">
                          Title
                        </td>
                        <td className="border px-4 py-2 border-gray-300">
                          {item.title}
                        </td>
                      </tr>
                      <tr className="bg-gray-100 hover:bg-gray-200">
                        <td className="border px-4 py-2 w-40 border-gray-300">
                          Extensions
                        </td>
                        <td className="border px-4 py-2 break-all border-gray-300">
                          {Array.isArray(item.extensions) &&
                          item.extensions.length > 0
                            ? item.extensions.join(", ")
                            : item.extensions || "N/A"}
                        </td>
                      </tr>

                      <tr>
                        <td className="border px-4 py-2 w-40 border-gray-300">
                          Price
                        </td>
                        <td className="border px-4 py-2 break-all border-gray-300">
                          {item.price}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {inlineProducts.length > 0 && (
        <>
          <h1 className="text-2xl font-roboto mt-6 font-semibold p-3 px-8 rounded-r-md text-[#b69121] bg-[#fff2b2] w-72">
            Shopping Products
          </h1>
          <div>
            {inlineProducts.map((item, index) => (
              <div key={index}>
                

                <div className="flex">
                  <p className="text-xl mx-4 my-4 p-3 px-5 rounded-full bg-[#b69121] font-bold h-fit text-white">
                    {index + 1}
                  </p>
                  <table className="max-w-[1500px] w-[1100px] my-4 mx-2 table-auto border-collapse border border-gray-300">
                    <tbody>
                      <tr className="bg-gray-100 hover:bg-gray-200">
                        <td className="border px-4 py-2 w-40 border-gray-300">
                          Position
                        </td>
                        <td className="border px-4 py-2 border-gray-300">
                          {item.position}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 w-40 border-gray-300">
                          Title
                        </td>
                        <td className="border px-4 py-2 border-gray-300">
                          {item.title}
                        </td>
                      </tr>
                      <tr className="bg-gray-100 hover:bg-gray-200">
                        <td className="border px-4 py-2 w-40 border-gray-300">
                          Price
                        </td>
                        <td className="border px-4 py-2 border-gray-300 break-all">
                          {item.currency} {item.price}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 w-40 border-gray-300">
                          Source
                        </td>
                        <td className="border px-4 py-2 border-gray-300">
                          {item.source}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 w-40 border-gray-300">
                          Thumbnail
                        </td>
                        <td className="border px-4 py-2 border-gray-300 text-blue-500 cursor-pointer hover:underline break-all">
                          {item.thumbnail}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SavedDataView;
