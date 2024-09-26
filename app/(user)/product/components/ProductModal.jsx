const ProductModal = ({ product, setShowModal }) => {
  return (
    <div className="fixed text-black inset-0 p-5 h-full bg-gray-300 bg-opacity-50 flex justify-center items-center -4">
      <div className=" bg-white m-5 rounded-lg w-full h-auto max-h-[750px] max-w-4xl overflow-scroll p-4 sm:p-6 sm:m-5 mt-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">
            {product.name} - Stock Details
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {product.variants.map((variant) => (
              <div key={variant.name}>
                <h3 className="font-bold">{variant.name}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full mt-2 text-sm text-left">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 border-b">Size</th>
                        <th className="px-2 py-1 border-b">Stock on Hand</th>
                        <th className="px-2 py-1 border-b">Reserved</th>
                        <th className="px-2 py-1 border-b">Incoming</th>
                        <th className="px-2 py-1 border-b">ETA</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-2 py-1 border-b">{variant.size}</td>
                        <td className="px-2 py-1 border-b">{variant.stock}</td>
                        <td className="px-2 py-1 border-b">567</td>
                        <td className="px-2 py-1 border-b">890</td>
                        <td className="px-2 py-1 border-b">21 Aug 2024</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
