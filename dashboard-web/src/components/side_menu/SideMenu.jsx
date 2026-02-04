import React, { useState } from "react";
import "./sideMenu.scss";

const navegacion = [
  {
    path: "/dashboard/categorias",
    category: {
      title: "Categorias",
      icon: "fa-solid fa-house",
    },
    options: [
      {
        title: "Create",
        path: "/dashboard/categorias/create",
      },
      {
        title: "Create",
        path: "/dashboard/categorias/create",
      },
      {
        title: "Create",
        path: "/dashboard/categorias/create",
      },
      {
        title: "Create",
        path: "/dashboard/categorias/create",
      },
    ],
  },
];

const Category = ({ category, icon, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <ul onClick={() => setOpen(!open)} className="option_category">
      <div className="group">
        <span className="option_name">
          <i className={icon}></i>
          <h5>{category}</h5>
        </span>
        <i class="fa-solid fa-angle-down"></i>
      </div>

      {React.Children.map(children, (child) =>
        React.cloneElement(child, { open }),
      )}
    </ul>
  );
};

const Option = ({ title, open }) => {
  return (
    <li className={open ? "option open" : "option"}>
      <i class="fa-solid fa-circle"></i>
      <p className="item">{title}</p>
    </li>
  );
};

const SideMenu = () => {
  const [dataPath, setDataPath] = useState(navegacion);
  return (
    <aside className="side_menu">
      <section className="title">
        <h2>Whisper Found</h2>
      </section>
      <section className="side_box">
        {dataPath.map((obj, index) => (
          <Category
            key={index}
            category={obj.category.title}
            icon={obj.category.icon}
          >
            {obj.options.map((option, idx) => (
              <Option key={idx} title={option.title} />
            ))}
          </Category>
        ))}
      </section>
    </aside>
  );
};
export default SideMenu;
