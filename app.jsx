function sum(arr) {
  return arr.reduce((a, b ) => a + b, 0);
}

class Question extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var options = this.props.options.map((option) => {
      return (
        <div>
          <label class="form-check-label">
            <input
              class="form-check-input"
              type="radio"
              name={this.props.section + "-" + this.props.questionIndex}
              onChange={() => this.props.reportScore(this.props.questionIndex, option.score)} />

            {option.body}
          </label>
        </div>
      );
    });

    return (
      <div>
        <h4>{this.props.body}</h4>
        {options}
      </div>
    )
  }
}

class QuestionSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionScores: new Array(props.questions.length).fill(0),
      statScore: 0
    };

    this.maxScore = 0
    for (const question of props.questions) {
      const optionScores = question.options.map(option => option.score)
      this.maxScore += Math.max.apply(Math, optionScores);
    }
  }

  reportScore(questionIndex, score) {
    var questionScores = this.state.questionScores;
    questionScores[questionIndex] = score;
    var statScore = (sum(questionScores) / this.maxScore) * 20

    this.setState({
      questionScores: questionScores,
      statScore: statScore
    })

    this.props.reportScore(this.props.sectionStat, statScore);
  }

  render() {
    var questions = this.props.questions.map((question, index) => {
      return (
        <li className="list-group-item">
          <Question
            body={question.body}
            options={question.options}
            section={this.props.sectionStat}
            questionIndex={index}
            reportScore={this.reportScore.bind(this)} />
        </li>
      )
    });


    return (
      <div class="card">
        <h2 class="card-header">
          {this.props.sectionStat} <span class="badge badge-info">{this.state.statScore}</span>
        </h2>
        <ul class="list-group list-group-flush">
          {questions}
        </ul>
      </div>
    );
  }
}



class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionScores: new Map()
    }
  }

  reportScore(sectionName, score) {
    var sectionScores = this.state.sectionScores;
    sectionScores.set(sectionName, score);
    this.setState({
      sectionScores: sectionScores
    });
  }


  render() {
    var strengthSection = {
      title: "Strength",
      questions: [
        {
          'body': 'How much weight can you lift?',
          'options': [{
            'body': '10 pounds',
            'score': 1
          },
          {
            'body': '20 pounds',
            'score': 2
          }]
        },
        {
          'body': 'How many push ups can you do?',
          'options': [{
            'body': '5',
            'score': 1
          },
          {
            'body': '10',
            'score': 2
          }]
        }
      ]
    }

    var intelligenceSection = {
      title: "Intelligence",
      questions: [{
        'body': 'What is your highest level of education?',
        'options': [{
          'body': 'Grade school',
          'score': 1,
        }, {
          'body': 'High school',
          'score': 2,
        }]
      }]
    }

    var sections = [
      strengthSection,
      intelligenceSection
    ].map(section => {
      return (
        <div>
          <QuestionSection
            sectionStat={section.title}
            questions={section.questions}
            reportScore={this.reportScore.bind(this)} />
          <br />
        </div>
      );
    });

    return (
      <div class="row">
        <div class="col-md-8 offset-md-2 col-xs-12">
          {sections}
          
          <div class="card">
            <h2 class="card-header">
              Stat total: <span class="badge badge-info">
                {sum(this.state.sectionScores.values())}
              </span>
            </h2>
          </div>
        </div>
      </div>
    )
  }
}

$(document).ready(() => {
  ReactDOM.render(
    <App />,
    document.getElementById('quiz')
  );
});