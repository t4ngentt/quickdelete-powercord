const { Plugin } = require('powercord/entities');
const { findInReactTree } = require('powercord/util');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');
const http = require('powercord/http');

module.exports = class quickdelete extends Plugin {

  async startPlugin () {
    const classes = {
      ...await getModule([ 'icon', 'isHeader' ]),
      ...await getModule([ 'button', 'separator', 'wrapper' ])
    };

    const pog = await getModule(m => m.default && m.default.displayName === 'pog');

    inject('quickdelete', pog, 'default', (_, res) => {
      const props = findInReactTree(res, r => r && r.message);      
      var messageid = props.message.id;
      var channelid = props.message.channel_id;
      res.props.children.unshift(React.createElement(
        'div', {
          className: classes.button,
          onClick: () => {
            console.log("it clicked");
            require('powercord/webpack').messages.deleteMessage(channelid, messageid)
          }
        },  
        React.createElement('img', {className: `emoji ${classes.icon}`,src: '/assets/9b1b76abb59b5c8a41daea1342f2138a.svg'
        })
      ));
      return res;
    });
    pog.default.displayName = 'pog';
  }

  pluginWillUnload () {
    uninject('quickdelete');
  }
};
