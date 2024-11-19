import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import CategoryItemCard from "../../components/Menu/CategoryItemCard";
import serverFetch from "../../lib/axios/serverFetch";

const Category = () => {
  const { category } = useParams();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [food, setFood] = useState([]);
  const [categoryId, setcategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const getCategoryId = async () => {
    try {
      const { data } = await serverFetch(`/categories/slug/${category}`);
      setcategoryId(data.categories[0]._id);
      setCategoryName(data.categories[0].name);
    } catch (error) {
      console.log(error);
    }
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
    getCategoryId();
    getFood();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    !user.userId && navigate("/");
  }, [user.userId, navigate]);

  return user.role !== "admin" ? (
    <div className="mt-4">
      <Link to={"/Menu"}>
        <button className="mb-2 rounded-md bg-amber-800 p-2">
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
      <div className="flex w-full flex-col items-stretch gap-3 xl:flex-row xl:flex-wrap">
        {food
          .filter((foodItem) => foodItem.category === categoryId)
          .map((foodItem) => (
            <CategoryItemCard
              key={foodItem._id}
              _id={foodItem._id}
              name={foodItem.name}
              price={foodItem.price}
              inStock={foodItem.inStock}
              description={foodItem.description}
              itemImageSrc={foodItem.image}
              isAdmin={false}
            />
          ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
      <p>To view {categoryName} category, please go to admin panel.</p>
      <Link
        to={`/admin/Menu/${category}`}
        className="rounded-md border-2 border-amber-500 bg-amber-100 px-4 py-2 font-bold uppercase tracking-wide text-amber-700"
      >
        Admin Panel {categoryName} Category
      </Link>
    </div>
  );
};

export default Category;
