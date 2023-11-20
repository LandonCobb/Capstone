import * as React from "react";
import Template from "@/components/template";

const testItems = [
  {
    id: 1,
    name: "Card 1",
    title: "title 1",
  },
  {
    id: 2,
    name: "Card 2",
    title: "title 2",
  },
];

const Explore: React.FC = () => {
  return (
    <Template>
      <h1>Explore page</h1>
      <div>
        {testItems.map((item, i) => (
            <div key={i}>
                {item.name}
                <br />
                { item.title}
          </div>
        ))}
      </div>
    </Template>
  );
};

export default Explore;
