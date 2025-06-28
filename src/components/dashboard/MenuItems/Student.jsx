import React from "react";

export default function Student() {
  const sessionOptions = ["2022-2023", "2023-2024", "2024-2025"];
  const classOptions = [
    "Darja Atfal Awwal",
    "Darja Awwal",
    "Darja Doam",
    "Darja Soam",
    "Darja Chaharum",
  ];
  const passOutOptions = ["Rajab", "Zillhaj"];

  const renderSelect = (label, options) => (
    <div className="form-group">
      <label>{label}</label>
      <select defaultValue="">
        <option value="" disabled>
          -- {label} --
        </option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="student-panel">
      {renderSelect("Session", sessionOptions)}
      {renderSelect("Class", classOptions)}
      {renderSelect("Pass Out", passOutOptions)}
    </div>
  );
}
