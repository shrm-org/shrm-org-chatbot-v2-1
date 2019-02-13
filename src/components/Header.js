import React from 'react';
import AppHeader from 'anchor-ui/app-header';
import Button from 'anchor-ui/button';
import colors from 'anchor-ui/settings/colors';
import IconExit from 'anchor-ui/icons/icon-close';

const Header = () => (
  <AppHeader
    style={{ position: 'absolute', top: 0, height: 70 }}
    icon={
      <img
        style={{ height: 50 }}
        src={process.env.REACT_APP_BOT_LOGO_IMAGE}
        alt="logo"
      />
    }
    text="Ask SHRM"
    rightButton={
      <Button style={{ marginTop: 8 }} iconButton>
        <IconExit color={colors.white} />
      </Button>
    }
  />
);

export default Header;
