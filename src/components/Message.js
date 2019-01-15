import React from 'react';
import ReactHtmlParser from 'react-html-parser'
import Message from 'anchor-ui/message';
import Card from 'anchor-ui/card'
import CardContent from 'anchor-ui/card-content'
import userAvatar from '../images/user.png';
import { colors } from './variables';

const styles = {
  user: {
    main: {
      background: colors.blue,
      color: '#fff'
    },
    header: {
      color: '#fff'
    },
    body: {
      color: '#fff'
    },
    time: {
      color: '#fff'
    }
  },
  bot: {
    main: {
      background: colors.offWhite,
      color: colors.darkGray,
      border: `1 px solid ${colors.gray}`,
      marginBottom: '10px'
    },
    markdown: {
      background: colors.offWhite,
      color: colors.darkGray,
      border: `1px solid ${colors.gray}`
    },
    header: {
      color: colors.darkGray
    },
    card: {
      marginBottom: '10px'
    },
    body: {
      color: colors.darkGray
    },
    time: {
      color: colors.darkGray
    }
  }
};
export default ({ message }) => {
  const myMessage = Boolean(message.id);
  const style = myMessage ? styles.user : styles.bot;
  const avatar = myMessage ? userAvatar : process.env.REACT_APP_BOT_AVATAR_IMAGE;
  if (message.markdown) {
    return (
        <Card style={style.card}>
          <CardContent style={style.markdown}>
            {
              ReactHtmlParser(message.markdown)
              
            }
          </CardContent>
        </Card>
    )
  }
  return (
    <Message
      avatar={avatar}
      myMessage={myMessage}
      style={style.main}
      messageHeaderStyle={style.header}
      messageBodyStyle={style.body}
      messageTimeStyle={style.time}
      body={message.body}
      username={message.user}
      createdAt={message.date}
      enableLinks={true}
    />
  );
};
