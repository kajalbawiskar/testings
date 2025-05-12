import { BsInfoCircle } from "react-icons/bs";

const OrganicResultsComponent = ({ organicResults }) => {
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
      {organicResults.length > 0 && (
        <>
          <p className="text-base px-4 ml-6 text-left my-3 mb-5 text-[#3c096c] bg-[#bde0fe] p-4 flex rounded-lg animate-pulse justify-center">
            <span className="mt-1.5 mr-4">
              <BsInfoCircle />
            </span>
            The keyword you entered has no sponsored ads running. Hence,
            displaying the organic search result. Please check the monthly
            search volume of this keyword and a list of potential search
            keywords with Confidanto. Proceed to keyword planner.
          </p>
          <h1 className="text-2xl font-roboto font-semibold p-3 px-8 rounded-r-md text-[#3a0ca3] bg-[#ece0f3] w-72">
            Organic Results
          </h1>
          <div>
            {organicResults.map((item, index) => (
              <div className="flex" key={index}>
                <p className="text-xl mx-4 my-4 p-3 px-5 rounded-full bg-[#3a0ca3] font-bold h-fit text-white">
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
                        Website Link
                      </td>
                      <td className="border px-4 py-2 text-blue-500 cursor-pointer hover:underline border-gray-300 break-all">
                        {extractDomain(item.link)}
                      </td>
                    </tr>
                    <tr className="bg-gray-100 hover:bg-gray-200">
                      <td className="border px-4 py-2 w-40 border-gray-300">
                        Title
                      </td>
                      <td className="border px-4 py-2 border-gray-300">
                        {item.title}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrganicResultsComponent;
