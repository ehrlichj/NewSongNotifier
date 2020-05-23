import React, { Component } from 'react';

class pw extends Component {
  constructor(){
    super();
    this.state={
      students:[]
    }
  }

componentDidMount(){
  fetch("/api/students")
  .then(res=>res.json())
  .then(students => this.setState({students:students},()=> console.log("success",students)));
}

  render() {
    return (
      <div className="Student">
          <h2>Students</h2>
          <ul>
            {this.state.students.map(student =>
              <li key = {student.user_id}>{student.user_name}</li>
            )}
          </ul>
      </div>
    );
  }
}

export default pw;
