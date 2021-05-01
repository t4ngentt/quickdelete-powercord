const { Plugin } = require('powercord/entities');
const { findInReactTree } = require('powercord/util');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');

module.exports = class quickdelete extends Plugin {

  async startPlugin () {
    const classes = {
      ...await getModule([ 'icon', 'isHeader' ]),
      ...await getModule([ 'button', 'separator', 'wrapper' ])
    };

    const MiniPopover = await getModule(m => m.default && m.default.displayName === 'MiniPopover');

    inject('quickdelete', MiniPopover, 'default', (_, res) => {
      const props = findInReactTree(res, r => r && r.message);
      
      var messageid = props.message.id;
      var channelid = props.message.channel_id;

      res.props.children.unshift(React.createElement(
        'div', {
          className: classes.button,
          onClick: () =>{
            const API_DELETE_URL = `https://discord.com/api/v9/channels/${channelid}/messages/${messageid}`;
            await fetch(API_DELETE_URL, {
                        headers,
                        method: 'DELETE'
            });
          }
        },  
        React.createElement('img', {
          className: `emoji ${classes.icon}`,
          src: '/assets/e4d52f4d69d7bba67e5fd70ffe26b70d.svg'
        })
      ));
      return res;
    });
    MiniPopover.default.displayName = 'MiniPopover';
  }

  pluginWillUnload () {
    uninject('quickdelete');
  }
};
