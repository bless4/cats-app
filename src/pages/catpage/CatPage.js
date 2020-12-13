import React from 'react'
import history from '../../utils/history'

const axios = require("axios");

class CatPage extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      sub_id: '',
      file: '',
      status: null
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('sub_id', this.state.sub_id);
    formData.append('file', this.state.file);
    const config = {
      headers: { 
        "Content-Type": "multipart/form-data",
         "x-api-key": "98de9fca-14cc-430d-a65f-e4930c214699"
         }
    };
    axios.post("https://api.thecatapi.com/v1/images/upload", formData, config)
      .then((response) => {
        alert("The file is successfully uploaded");
        this.setState({
          status: 'success'
        })
        if (response) {
          history.push('/')
        }
      }).catch((error) => {
        console.log('error', error)
      });
  }
  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  render() {

    console.log('state vote', this.props)
    return (
      <div className="container upload-panel">
        <div className="card-shadow mt-5 p-4">
          <form onSubmit={this.onFormSubmit}>
            <h1>Upload Your Cat Image</h1>
            <div className="form-group text-left my-4">
              <label>Sub Id</label>
              <input type="sub_id" className="form-control" value={this.state.sub_id} 
              onChange={(e) => this.setState({ sub_id: e.target.value })} />
            </div>
            <div className="form-group text-left my-4">
              <label>Image</label>
              <input type="file" className="form-control btn mt-1 p-0" 
              id="exampleInputPassword1" name="file" onChange={this.onChange} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block my-2">Submit</button>
          </form>
        </div>
      </div>
    )
  }
}

export default CatPage