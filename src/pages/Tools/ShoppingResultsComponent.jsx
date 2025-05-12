import { BiSave } from "react-icons/bi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

const ShoppingResultsComponent = ({
  shoppingResults,
  handleSaveShoppingResults,
}) => {
  const extractDomain = (url) => {
    if (!url || typeof url !== "string") {
      console.error("Invalid URL:", url);
      return "";
    }

    try {
      const domain = new URL(url).hostname.replace("www.", "");
      return domain;
    } catch (error) {
      // Handle URLs without a protocol by adding a default one
      const formattedUrl =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `http://${url}`;
      try {
        const domain = new URL(formattedUrl).hostname.replace("www.", "");
        return domain;
      } catch (error) {
        console.error("Invalid URL:", url);
        return "";
      }
    }
  };

  return (
    <div>
      {shoppingResults.length > 0 && (
        <>
          <h1 className="text-2xl font-roboto mt-6 font-semibold p-3 px-8 rounded-r-md text-[#023e8a] bg-[#ade8f4] w-72">
            Shopping Results
          </h1>
          <div>
            {shoppingResults.map((item, index) => (
              <div key={index}>
                <div className="flex justify-end items-center">
                  <TooltipComponent content="Save" position="BottomCenter">
                    <button
                      className="text-3xl text-[#023e8a] mx-2"
                      onClick={() => handleSaveShoppingResults(item)}
                    >
                      <BiSave />
                    </button>
                  </TooltipComponent>
                </div>
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
                          {extractDomain(item.link)}
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
    </div>
  );
};

export default ShoppingResultsComponent;
