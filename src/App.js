import React, { Component } from 'react';
import { Interactions } from 'aws-amplify';

import MessageList from 'anchor-ui/message-list';
import MessageInput from 'anchor-ui/message-input';
import Button from 'anchor-ui/button';

import Message from './components/Message';
import Header from './components/Header';
import ResponseCard from './components/ResponseCard';
import background from './images/background.jpg';
import { css } from 'glamor';


const DONE_TEXT = 'DONE';
const HELP_TEXT = 'HELP';


class App extends Component {
  state = {
    input: '',
    done: false,
    messages: [
      {
        id: 0,
        body:
          "Hi I'm SHRM's virtual assistant! I'm new here, but I will try and help you if I can or connect you to our support team."
      },
      {
        id: 0,
        responseCard: {
          genericAttachments: [
            {
              title: 'Here are some common topics that people need help with.',
              subTitle: 'Please choose an option from below',
              buttons: [
                { text: 'Americans with Disabilities Act (ADA)', value: 'ADA' },
                { text: 'Annual Conference', value: 'Annual Conference' },
                { text: 'Compensation', value: 'compensation' },
                { text: 'Family and Medical Leave Act (FMLA)', value: 'FMLA' },
                { text: 'Membership', value: 'membership' },
                { text: 'Other Topics', value: 'question' }
              ]
            }
          ]
        }
      }
    ],
    hasActiveResponseCard: true,
    workflowIteration: 0
  };



  onChange = e => {
    const input = e.target.value;
    this.setState({
      input
    });
  };

  toggleActiveResponseCard = () => {
    this.setState({
      hasActiveResponseCard: !this.state.hasActiveResponseCard
    });
  };

  cardButtonHandler = buttonValue => {
    if (buttonValue === DONE_TEXT) {
      const doneMessage = {
        id: 0,
        markdown: `Great! Take a <a href=${process.env.REACT_APP_SURVEY_LINK}>quick survey</a> to tell us how we did?`
      };

      let messages = [...this.state.messages, doneMessage];

      this.setState({
        messages,
        input: '',
        hasActiveResponseCard: true,
        done: true
      });
    } else if (buttonValue === HELP_TEXT) {
      const helpMessages = [
        {
          id: 0,
          markdown:
            `I'm sorry! Please <a href="https://shrm.org/about-shrm/Pages/Contact-Us.aspx" target="_blank">contact our support team</a> and they can assist your further.`
        },
        {
          id: 0,
          markdown:
            `Help us improve this experience. <a href=${process.env.REACT_APP_SURVEY_LINK} target="_blank">Give us your feedback!</a>`
        }
      ];

      let messages = [...this.state.messages, ...helpMessages];
      this.setState({
        messages,
        input: '',
        hasActiveResponseCard: true,
        done: true
      });
    } else {
      this.submitMessageToBot(buttonValue);
      this.toggleActiveResponseCard();
    }
  };

  startOver = () => {
    const state = {
      input: '',
      done: false,
      messages: [
        {
          id: 0,
          body:
            "Hi I'm SHRM's virtual assistant! I'm new here, but I will try and help you if I can. If not I will attempt to get you some human help."
        },
        {
          id: 0,
          responseCard: {
            genericAttachments: [
              {
                title:
                  'Here are some common topics that people need help with.',
                subTitle: 'Please choose an option from below',
                buttons: [
                  { text: 'Americans with Disabilities Act (ADA)', value: 'ADA' },
                  { text: 'Annual Conference', value: 'Annual Conference' },
                  { text: 'Compensation', value: 'compensation' },
                  { text: 'Family and Medical Leave Act (FMLA)', value: 'FMLA' },
                  { text: 'Membership', value: 'membership' },
                  { text: 'Other Topics', value: 'question' }
                ]
              }
            ]
          }
        }
      ],
      hasActiveResponseCard: true,
      workflowIteration: this.state.workflowIteration + 1
    };

    this.setState({ ...state });
  };

  submitUserMessage = async () => {
    const { input } = this.state;

    if (input === '') return;

    const message = {
      id: 1,
      body: input
    };

    let messages = [...this.state.messages, message];

    this.setState({
      messages,
      input: ''
    });

    this.submitMessageToBot(input);
  };

  submitMessageToBot = async input => {
    const response = await Interactions.send(
      process.env.REACT_APP_BOT_NAME,
      input.toLowerCase()
    );
    const responseMessage = {
      id: 0,
      body: response.message,
      responseCard: response.responseCard
    };

    if (response.sessionAttributes && response.sessionAttributes.result) {
      let result = JSON.parse(response.sessionAttributes.result);
      if (result && result.alt && result.alt.markdown && result.a === response.message) {
        responseMessage.markdown = result.alt.markdown;
      }
    }

    let messages = [...this.state.messages, responseMessage];
    this.setState({ messages });

    if (response.responseCard) {
      this.toggleActiveResponseCard();
    }
    // Is the convo over
    if (response.dialogState === 'Fulfilled') {
      const MESSAGE_FAIL =
        "You stumped me! Sadly I don't know how to answer your question.";
      // if (response.sessionAttributes && response.sessionAttributes.hasAnswer) {
      if (response.message === MESSAGE_FAIL) {
        // Go to ending with failed state
        this.cardButtonHandler(HELP_TEXT);
      } else {
        const didIHelp = {
          id: 0,
          responseCard: {
            genericAttachments: [
              {
                title: 'Was that the information you were seeking?',
                subTitle: 'Please choose an option from below',
                buttons: [
                  { text: 'Yes!', value: DONE_TEXT },
                  { text: 'No', value: HELP_TEXT }
                ]
              }
            ]
          }
        };
        let messages = [...this.state.messages, didIHelp];
        this.setState({
          messages,
          input: '',
          hasActiveResponseCard: true
        });
      }
    }
  };




  scrollToBottom = () => {
    this.bottom.scrollIntoView({ behavior: "smooth" });
  }
  
  componentDidMount() {
    this.scrollToBottom();
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }



  render() {
    const { messages, workflowIteration } = this.state;
    const now = new Date();
    return (
      <div style={{ backgroundImage: `url(${background})`, ...styles.main }}
        ref={(el) => { this.messagesDiv = el; }}>

        <MessageList
          className="smooth-scroll"
          autoScroll={false}
          style={styles.list}
          listStyle={styles.listInner}
        >
          {messages &&
            messages.map((message, idx) => {
              const user = message.id ? 'You' : 'Ask SHRM';
              const messagePayload = {
                ...message,
                user,
                date: `${now.toLocaleDateString()} @${now.toLocaleTimeString()}`
              };
              if (message.responseCard) {
                return (
                  <ResponseCard
                    key={`MessageItem${idx}-${workflowIteration}`}
                    responseCard={message.responseCard}
                    buttonHandler={this.cardButtonHandler}
                    
                  />

                );
              } else if (message.body || message.markdown) {
                return (
                  <Message key={`MessageItem${idx}-${workflowIteration}`} message={messagePayload} 
                  
                  />
                );
              } else {
                return null;
              }
            })}


          {this.state.done && (
            <Button onClick={this.startOver}>
              <p>Start Over?</p>
            </Button>
          )}

          <div style={{clear: "both", float: "left" }}
            id="bottom"
            ref={(el) => { this.bottom = el; }}>
          </div>
        </MessageList>

        <Header />
        <MessageInput
          disabled={this.state.hasActiveResponseCard}
          style={styles.input}
          onChange={this.onChange}
          placeholder="Type something..."
          value={this.state.input}
          sendMessage={this.submitUserMessage}
        />
      </div>
    );
  }
}

const styles = {

  main: {
    backgroundRepeat: 'repeat',
    backgroundSize: '650px 650px',
    overflow: 'hidden',
    height: '100%',
    width: '400px',
    position: 'fixed',
    bottom: 0,
    right: 0
  },
  list: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1
  },
  listInner: {
    paddingBottom: '75px',
    paddingTop: '105px',
    paddingLeft: '10px',
    paddingRight: '10px'
  },
  input: {
    padding: 0,
    marginBottom: '0px',
    marginTop: '0px',
    marginLeft: '0px',
    marginRight: '0px',
    position: 'absolute',
    bottom: 0,
    left: 0,
    maxWidth: '100%'
  },
  element: {
    opacity: "0",
    transition: "all 5.5s ease-in -out"
  },
  fadeIn: {
    opacity: "1"
  }



};

const ROOT_CSS = css({
  height: "100vh",
  width: "100%"

});


export default App;
