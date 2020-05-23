import React, { Component } from 'react';
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'



class Quizzes extends Component {
  constructor(){
    super();
    this.state={
      quizzes:[]
    }
  }

componentDidMount(){
  fetch("/api/quiz")
  .then(res=>res.json())
  .then(quizzes => this.setState({quizzes:quizzes},()=> console.log("success",quizzes)));
}

  render() {
    return (
      <div className="Quizzes">
          <h2>Quiz Questions</h2>
          <ul>
            {this.state.quizzes.map(quizzes =>
              <li key = {quizzes.question_number}><Latex>{quizzes.question}</Latex></li>
            )}
          </ul>
      </div>
    );
  }
}

export default Quizzes;
