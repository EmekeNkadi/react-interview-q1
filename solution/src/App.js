import "./App.scss";
import { useState, useMemo, useEffect } from "react";
import { getLocations, isNameValid } from "./mock-api/apis";
import { debounce } from "lodash";

function App() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameHasValidated, setNameHasValidated] = useState(false);
  const [optionsList, setOptionsList] = useState([]);
  const [location, setLocation] = useState(null);
  const [itemList, setItemList] = useState([]);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    setNameHasValidated(false);
  };

  const validateName = async (n) => {
    const nameValid = await isNameValid(n);
    setNameError(!nameValid);
    setNameHasValidated(true);
  };

  const debouncedNameValidation = useMemo(() => debounce(validateName, 500), []);

  useEffect(() => {
    debouncedNameValidation(name);
  }, [name, debouncedNameValidation]);

  useEffect(() => {
    fetchOptionList();
  }, []);

  const fetchOptionList = async () => {
    const list = await getLocations();
    setOptionsList(list);
    setLocation(null);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (nameError || !location) return;
    setItemList((items) => [...items, { name: name, location: location }]);
    setName("");
    setNameError(false);
  };

  const handleClearItem = (e) => {
    e.preventDefault();
    setItemList([]);
    setName("");
    setNameError(false);
  };
  return (
    <div className="App">
      <form action="">
        <div className="form-element">
          <label htmlFor="name">Name: </label>
          <input
            className={`${nameError ? "input-error-active" : ""}`}
            required
            type="text"
            id="name"
            name="name"
            placeholder="Enter Name"
            minLength={1}
            maxLength={80}
            x
            value={name}
            onChange={(e) => handleNameChange(e)}
          />
        </div>
        {nameError && <p className={`error-msg`}>This name has already been taken</p>}
        <div className="form-element">
          <label htmlFor="location">Location: </label>
          <select
            name="location"
            id="location"
            placeholder="Choose a location"
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="" disabled selected>
              Choose a location...
            </option>
            {optionsList.length > 0 &&
              optionsList.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
          </select>
        </div>
        <div className="button-ctn">
          <button className="button-button" onClick={(e) => handleClearItem(e)} type="button">
            Clear
          </button>
          <button
            className={`button-button `}
            disabled={nameError || !name || !nameHasValidated || !location}
            onClick={(e) => handleAddItem(e)}
            type="button"
          >
            Add
          </button>
        </div>
      </form>
      <div className="result-table">
        <div className="name-col">
          <div className="header">Name</div>
          {itemList.length > 0 &&
            itemList.map((item, index) => (
              <div key={index} className="item">
                {item.name}
              </div>
            ))}
        </div>
        <div className="location-col">
          <div className="header">Location</div>
          {itemList.length > 0 &&
            itemList.map((item, index) => (
              <div key={index} className="item">
                {item.location}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
