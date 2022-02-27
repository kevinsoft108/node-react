import React, { useState } from "react";
import axios from 'axios';

export default function Edit() {
  const [form, setForm] = useState({
    file: null,
    number: 1,
    result: {},
  });

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  function onChangeFile(e) {
    return updateForm({ file: e.target.files[0] });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    data.append('number', form.number);
    data.append('file', form.file)

    axios.post("http://localhost:5000/", data, {})
      .then(res => {
        const result = { result: res.data };
        return setForm((prev) => {
          return { ...prev, ...result };
        });
      })
  }

  return (
    <div>
      <h3>Upload File</h3>
      <form>
        <div className="form-group">
          <input type="file" name="file" onChange={onChangeFile}/>
        </div>
        <div className="form-group">
          <label htmlFor="number">Number: </label>
          <input
            type="text"
            className="form-control"
            id="number"
            value={form.number}
            onChange={(e) => updateForm({ number: e.target.value })}
          />
        </div>
        <br />

        <div className="form-group">
          <input
            type="submit"
            value="Upload"
            className="btn btn-primary"
            onClick={onSubmit}
          />
        </div>
      </form>
      <div>
        {JSON.stringify(form.result)}
      </div>
    </div>
  );
}
