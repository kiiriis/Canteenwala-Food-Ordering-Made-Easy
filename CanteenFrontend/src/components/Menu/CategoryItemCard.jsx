import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import serverFetch from "../../lib/axios/serverFetch";
import {
  decrease,
  increase,
  add,
  removeItem,
} from "../../lib/redux/features/cartSlice";

const CategoryItemCard = (props) => {
  const dispatch = useDispatch();
  const storeItem = useSelector(
    (state) => state.cart.cartItems.filter((item) => item._id === props._id)[0]
  );
  const slugItemName = () => {
    let text = props.name;
    return (
      text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        //eslint-disable-next-line
        .replace(/[^\w\-]+/g, "")
        //eslint-disable-next-line
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
    );
  };

  const deleteFood = async () => {
    try {
      await serverFetch.delete(`/food/${props.id}`);
      props.removeFoodItem(props.id);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(slugItemName());
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-md border-2 border-amber-300 bg-amber-100 xl:w-1/4">
      <img
        src={props.itemImageSrc}
        className="h-40 w-full object-cover object-center"
        alt=""
      />
      <div className="flex h-full flex-col rounded-md rounded-t-none p-4">
        <div className="mb-1 flex items-center  justify-between ">
          <h2 className="text-xl capitalize">{props.name}</h2>
          <p className="text-xl font-bold">₹{props.price}</p>
        </div>
        <p className="mb-2 flex-1 text-sm text-gray-500">{props.description}</p>
        {!props.isAdmin ? (
          props.inStock ? (
            <div className="w-full rounded-md border-2 border-amber-900 bg-amber-700 py-2 text-amber-200">
              {storeItem?.quantity ? (
                <div className="flex items-center justify-between px-8">
                  <button
                    className="px-2 text-2xl font-bold"
                    onClick={() => {
                      if (storeItem.quantity === 1) {
                        dispatch(removeItem(props._id));
                      } else {
                        dispatch(decrease(props._id));
                      }
                    }}
                  >
                    -
                  </button>
                  <p>{storeItem.quantity}</p>
                  <button
                    className="px-2 text-2xl font-bold"
                    onClick={() => dispatch(increase(props._id))}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="w-full py-1 text-center"
                  onClick={() => dispatch(add(props))}
                >
                  ADD
                </button>
              )}
            </div>
          ) : (
            <div className="w-full cursor-not-allowed rounded-md border border-gray-400 bg-gray-100 py-3 text-center text-gray-500">
              OUT OF STOCK
            </div>
          )
        ) : (
          <div className="flex w-full items-center justify-end gap-2">
            {!props.inStock && (
              <p className="flex-1 font-bold uppercase text-rose-700">
                Out of Stock
              </p>
            )}

            <button className="rounded bg-rose-600 p-2" onClick={deleteFood}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <Link
              to={`manageMenu/${slugItemName()}`}
              className="flex gap-2  self-end rounded bg-amber-600  px-3 py-2 text-sm font-bold uppercase text-white "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <p>Edit</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryItemCard;
