import React, { Component } from 'react';
import Card from 'anchor-ui/card';
import CardHeader from 'anchor-ui/card-header';
import CardContent from 'anchor-ui/card-content';
import Button from 'anchor-ui/button';

import { colors } from './variables';

class ResponseCard extends Component {
  state = {
    disabled: false
  };

  disableButtons = () => {
    this.setState({
      disabled: true,
      fadeIn: false
    });
  };

  onButtonClick = buttonValue => {
    if (this.props.buttonHandler) {
      this.props.buttonHandler(buttonValue);
      this.disableButtons();
    }
  };


  render() {
    const { responseCard } = this.props;
    if (
      responseCard &&
      responseCard.genericAttachments &&
      responseCard.genericAttachments.length
    ) {
      const {
        title,
        subTitle,
        buttons
        // attachmentLinkUrl
      } = responseCard.genericAttachments[0];
      return (
        <Card style={styles.card}
        className={ this.state.fadeIn ? styles.elementFadeIn : styles.element }>
          {title && (
            <CardHeader
              titleStyle={{ color: 'white' }}
              subtitleStyle={{ color: 'white' }}
              style={styles.cardTitle}
              title={title}
              subtitle={subTitle}
            />
          )}
          <CardContent style={styles.content}>

            {buttons &&
              buttons.length &&
              buttons.map((button, idx) => (
                <Button
                  key={idx}
                  style={styles.button}
                  value={button.value}
                  disabled={this.state.disabled}
                  onClick={() => this.onButtonClick(button.value)}
                >
                  <p>{button.text}</p>
                </Button>
              ))}
          </CardContent>
        </Card>
      );
    }
    return null;
  }
}

const styles = {
  button: {
    backgroundColor: colors.gray,
    color: colors.darkGray,
    ':hover': {
      backgroundColor: colors.offWhite
    }
  },
  card: {
    display: 'inline-block',
    marginBottom: '5px',
    width: '100%'
  },
  cardTitle: {
    background: colors.orange,
    color: 'white'
  },
  content: {
    display: 'grid',
    gridRowGap: '30px',
    background: 'white'
  },
  image: {
    maxWidth: '100%'
  },
  element: {
    opacity: "0",
    transition: "all 5.5s ease-in -out"
  },
  elementFadeIn: {
    opacity: "1"
    
  }
};

export default ResponseCard;
