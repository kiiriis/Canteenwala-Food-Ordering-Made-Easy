import React, { useEffect, useState } from "react";
import CategoryItemCard from "../../components/Menu/CategoryItemCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import serverFetch from "../../lib/axios/serverFetch";

const ManageMenu = () => {
  const { category } = useParams();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [retrievedCategory, setRetrievedCategory] = useState({});
  const [food, setFood] = useState([]);

  const getSingleCategory = async () => {
    try {
      const { data } = await serverFetch(`/categories/slug/${category}`);
      setRetrievedCategory(data.categories[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFoodItem = (id) => {
    setFood((prevFood) => prevFood.filter((foodItem) => foodItem._id !== id));
  };

  const getFood = async () => {
    try {
      const { data } = await serverFetch("/food");
      setFood(data.food);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleCategory();
    getFood();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    user.role !== "admin" && navigate("/");
  }, [user.role, navigate]);

  return (
    <div>
      <div className="mx-auto mt-4">
        <div className="flex items-center justify-between">
          <Link to={`/admin/Menu`}>
            <button className="rounded-md bg-amber-800 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>
          <Link to="manageMenu/addItem">
            <button className="rounded bg-amber-800 px-4 py-2 font-bold text-white">
              Add Item
            </button>
          </Link>
        </div>
        <div className="mt-2 flex flex-col items-stretch gap-3 xl:mt-5 xl:flex-row xl:flex-wrap">
          {food
            .filter((food) => food.category === retrievedCategory._id)
            .map((item) => (
              <CategoryItemCard
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                inStock={item.inStock}
                description={item.description}
                itemImageSrc={item.image}
                removeFoodItem={removeFoodItem}
                isAdmin={true}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManageMenu;
