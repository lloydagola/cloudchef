import { useState, useEffect } from "react";
import "../Styles/Home.css";
import Tree from "react-d3-tree";
import axios from "axios";
import { response } from "express";

interface TreeNode {
  name: string;
  parentName: string | null;
  childrenNames: string[];
}

interface TreeData {
  name: string;
  children?: TreeData[];
}

export default function Form() {
  const [value, setValue] = useState<string>("");
  const [jsonData, setJsonData] = useState<TreeNode[]>([]);
  const [treeData, setTreeData] = useState<TreeData[]>([]);
  const [errorStatus, setErrorStatus] = useState<boolean>(true);

  const convertToTreeData = (
    data: TreeNode[],
    parentName: string | null = null
  ): TreeData[] =>
    data
      .filter((node) => node.parentName === parentName)
      .map((node) => ({
        name: node.name,
        children: convertToTreeData(data, node.name),
      }));

  useEffect(() => {
    const updatedTreeData = convertToTreeData(jsonData);
    setTreeData(updatedTreeData);
  }, [jsonData]);

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
  }

  function generate() {
    setErrorStatus(true);
    try {
      const axiosData = eval(value);
      console.log(axiosData);

      axios
        .post("http://localhost:5000/api/save-data", axiosData)
        .then((response) => setJsonData(response.data));
    } catch (error) {
      console.error("Error parsing JSON:", error);
      setErrorStatus(false);
    }
  }

  function MyButton({ title }: { title: string }) {
    return (
      <button
        className="generate-btn"
        onClick={generate}
        disabled={!value.trim()}
      >
        {title}
      </button>
    );
  }

  return (
    <div className="main-section">
      <h3 className="name-section">
        Populate the text field with JSON data for seamless integration!
      </h3>
      <textarea
        value={value}
        onChange={handleChange}
        className="textarea-section"
      />
      <MyButton title="Generate" />
      <div className="tree-section">
        {errorStatus ? (
          treeData.length > 0 ? (
            <Tree data={treeData} />
          ) : (
            <p className="info-statement">No data to display. Upload a JSON file.</p>
          )
        ) : (
          <p className="error-statement">No data uploaded. Confirm data again.</p> // Render this when errorStatus is false
        )}
      </div>
    </div>
  );
}
