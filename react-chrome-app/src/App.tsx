import { useState } from 'react';
import './App.css';

function App() {
  const [snowColor, setSnowColor] = useState('white');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSnowColor = event.target.value;
    setSnowColor(newSnowColor);
    chrome.runtime.sendMessage({ type: 'colorList', data: newSnowColor });
  };

  const toggleSnow = () => {
    chrome.runtime.sendMessage({ type: 'toggleSnow' });
  };

  return (
    <div className="app">
      <h1 className="title">Let it Snow!</h1>
      <div className="row">
        <label htmlFor="snow-color">Snow Color:</label>
        <select id="snow-color" value={snowColor} onChange={handleChange}>
          <option value="white">White</option>
          <option value="blue">Blue</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
        </select>
      </div>
      <div className="row">
        <button className="button" onClick={toggleSnow}>Snow ON/OFF</button>
      </div>
    </div>
  );
}

export default App;