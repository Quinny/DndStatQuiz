function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function normalizeStat(rawScore, maxScore) {
  return Math.ceil(Math.min(rawScore, maxScore));
}

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.questionKey = this.props.section + "-" + this.props.questionIndex;
  }

  componentDidMount() {
    const sessionSelection = sessionStorage.getItem(this.questionKey);
    if (sessionSelection != null) {
      this.props.reportScore(
        this.props.questionIndex,
        this.props.options[parseInt(sessionSelection)].score);
    }
  }

  onChange(option, optionIndex) {
    this.props.reportScore(this.props.questionIndex, option.score);
    sessionStorage.setItem(this.questionKey, optionIndex);
  }

  render() {
    var options = this.props.options.map((option, optionIndex) => {
      return (
        <div>
          <label class="form-check-label">
            <input
              class="form-check-input"
              type="radio"
              name={this.questionKey}
              onChange={() => this.onChange(option, optionIndex)}
              checked={sessionStorage.getItem(this.questionKey) == optionIndex} />

            {option.body}
            {/* TODO consider removing this after scores are balanced */}
          </label> {"("} <span class="badge badge-secondary">{normalizeStat(option.score, this.props.maxSectionScore)}</span> {")"}
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

    this.maxScore = 20
    /*
    This method of score normalization was really hard to balance, but it would be cool in theory...

    for (const question of props.questions) {
      const optionScores = question.options.map(option => option.score)
      this.maxScore += Math.max.apply(Math, optionScores);
    }
    */
  }

  reportScore(questionIndex, score) {
    var questionScores = this.state.questionScores;
    questionScores[questionIndex] = score;
    var statScore = normalizeStat(sum(questionScores), this.maxScore);

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
            reportScore={this.reportScore.bind(this)}
            maxSectionScore={this.maxScore} />
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
          body: 'What is the maximum amount of weight you could lift over your head?',
          options: [{
            body: '20 pounds',
            score: 1
          },
          {
            body: '50 pounds',
            score: 5
          },
          {
            body: '75 pounds',
            score: 7
          },
          {
            body: '100 pounds',
            score: 10
          },
          {
            body: '150 pounds',
            score: 12
          },
          {
            body: '200 pounds',
            score: 15
          },
          {
            body: '300+ pounds',
            score: 18
          }],
        },
        {
          body: 'How many consecutive push ups can you do without resting?',
          options: [{
            body: '5',
            score: 1
          },
          {
            body: '10',
            score: 2
          },
          {
            body: '20',
            score: 3
          },
          {
            body: '30',
            score: 5
          },
          {
            body: '40',
            score: 5
          },
          {
            body: '50',
            score: 6
          }]
        },
        {
          body: 'Can you perform any feats of strength that would be considered impressive to the average person (e.g. doing a prolonged handstand, karate chopping a board, etc.)?',
          options: [{
            body: 'Yes',
            score: 5
          },
          {
            body: 'No',
            score: 0
          }]
        }
      ]
    }

    var intelligenceSection = {
      title: "Intelligence",
      questions: [{
        body: 'What is your highest level of education?',
        options: [
          {
            body: 'Grade school',
            score: 1,
          },
          {
            body: 'Middle school',
            score: 2,
          },
          {
            body: 'High school',
            score: 5,
          },
          {
            body: 'Bachelors Degree',
            score: 7,
          },
          {
            body: 'Masters Degree',
            score: 9,
          },
          {
            body: 'PHD or MD',
            score: 9,
          },
          {
            body: 'Post Doc or PHD + another unrelated Bachelors or greater degree',
            score: 12,
          },
        ]
      },
      {
        body: 'How many languages can you hold up a casual conversation in?',
        options: [
          {
            body: '1',
            score: 1,
          },
          {
            body: '2',
            score: 4,
          },
          {
            body: '3+',
            score: 6,
          },
        ]
      },
      {
        body: 'Are you able to operate most mechanical or eletronic equipment without asking for help?',
        options: [
          {
            body: 'Yes',
            score: 3,
          },
          {
            body: 'No',
            score: 0,
          },
        ]
      },
      {
        body: 'When watching a movie or reading a book, are you often able to correctly guess how it will end?',
        options: [
          {
            body: 'Yes',
            score: 3,
          },
          {
            body: 'No',
            score: 0,
          },
        ]
      }]
    }

    var dexteritySection = {
      title: "Dexterity",
      questions: [
        {
          body: 'How easy/difficult is it for you to thread a needle?',
          options: [
            { body: 'My hands shake a bit, it\'s always a challenge', score: 0 },
            { body: 'I can usually do it after a couple of tries', score: 4 },
            { body: 'I have a steady hand; threading a needle is no problem', score:6  },
            { body: 'I can thread a needle quickly and accurately', score: 10 },
          ]
        },
        {
          body: 'How many balls can you consistently juggle at once?',
          options: [
            { body: '1', score: 0 },
            { body: '2', score: 2 },
            { body: '3', score: 5 },
            { body: '4+', score: 7 },
          ]
        },
        {
          body: 'How easily can you learn a new physical skill, like a dance move or a new sport?',
          options: [
            { body: 'I struggle to learn new physical skills. I\'m not very coordinated', score: 0 },
            { body: 'It takes me a while, but I can eventually pick up new skills', score: 2 },
            { body: 'I learn new physical skills relatively quickly', score: 4 },
            { body: 'I\'m naturally athletic and can learn new skills with ease', score: 8 },
          ]
        }]
    }

    var constitutionSection = {
      title: "Constitution",
      questions: [
        {
          body: 'How easily do you get sick?',
          options: [
            { body: 'Very easily, I\'m often ill', score: 1 },
            { body: 'Fairly easily, I catch most common illnesses', score: 2 },
            { body: 'I get sick occasionally, but recover quickly', score: 4 },
            { body: 'I never get sick', score: 8 }
          ]
        },
        {
          body: 'How well do you operate under stress?',
          options: [
            { body: 'Poorly, I\'m easily overwhelmed', score: 1 },
            { body: 'I can manage some stress, but too much gets to me', score: 2 },
            { body: 'I handle stress fairly well', score: 4 },
            { body: 'I thrive under pressure', score: 6 },
          ]
        },
        {
          body: 'How quickly do you recover from physical injury or illness?',
          options: [
            { body: 'Slowly, it takes me a long time to recover', score: 1 },
            { body: 'I recover at a reasonable pace', score: 3 },
            { body: 'I recover quickly', score: 5 },
          ]
        },
        {
          body: 'How many hours per night do you typically sleep?',
          options: [
            { body: 'less than 4', score: 0 },
            { body: '4-6', score: 1 },
            { body: '6-8', score: 2 },
            { body: '8+', score: 4 },
          ]
        }
      ]
    }

    var wisdomSection = {
      title: "Wisdom",
      questions: [
        {
          body: 'How often do you reflect on your experiences and learn from them?',
          options: [
            { body: 'Rarely, I don\'t spend much time thinking about the past', score: 1 },
            { body: 'Occasionally, when something significant happens', score: 3 },
            { body: 'Regularly, I try to learn from my mistakes and successes', score: 5 },
            { body: 'Frequently, I analyze my experiences to gain deeper understanding', score: 9 },
          ]
        },
        {
          body: 'In the past five years, have you received a speeding ticket or other legal infraction for doing something you knew at the time you shouldn\'t do?	',
          options: [
            { body: 'Yes', score: 0 },
            { body: 'No', score: 3 },
          ]
        },
        {
          body: 'In the last month have you made an impulse purchase at a store or online you later regretted?',
          options: [
            { body: 'Yes.', score: 0 },
            { body: 'No', score: 3 },
          ]
        },
        {
          body: 'How often do you trust your intuition or gut feeling?',
          options: [
            { body: 'Rarely', score: 0 },
            { body: 'Sometimes', score: 3 },
            { body: 'Often', score: 5 },
          ]
        },
      ]
    }

    var charismaSection = {
      title: 'Charisma',
      questions: [
        {
          body: 'How easily do you make new friends?',
          options: [
            { body: 'I find it very difficult to connect with people', score: 1 },
            { body: 'I can make friends, but it takes time and effort', score: 3 },
            { body: 'I make friends easily', score: 5 },
          ]
        },
        {
          body: 'Do you have a reputation for being annoying, disruptive, antisocial, weird, or repulsive?',
          options: [
            { body: 'Yes', score: 0 },
            { body: 'No', score: 2 },
          ]
        },
        {
          body: 'Have you ever had an argument with someone and convinced them to see your point of view?',
          options: [
            { body: 'Yes', score: 2 },
            { body: 'No', score: 0 },
          ]
        },
        {
          body: 'Are you considered to be attractive by members of the opposite sex?',
          options: [
            { body: 'Yes', score: 3 },
            { body: 'No', score: 0 },
          ]
        },
        {
          body: 'Do you find that people who you don\'t know very well will ask your advice on things?',
          options: [
            { body: 'Yes', score: 3 },
            { body: 'No', score: 0 },
          ]
        }
      ]
    }

    var sections = [
      strengthSection,
      intelligenceSection,
      dexteritySection,
      constitutionSection,
      wisdomSection,
      charismaSection
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

    var sectionScores = this.state.sectionScores.entries().map((entry) => {
      var [sectionTitle, score] = entry
      return (
      <h2 class="card-header">
        {sectionTitle + ":"} <span class="badge badge-info">{score}</span>
      </h2>
      )
    })

    return (
      <div class="row">
        <div class="col-md-8 offset-md-2 col-xs-12">
          {sections}

          <div class="card">
            {sectionScores}
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