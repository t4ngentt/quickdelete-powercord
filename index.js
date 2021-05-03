const { Plugin } = require('powercord/entities');
const { findInReactTree } = require('powercord/util');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');
const http = require('powercord/http');
const Settings = require('./Settings');

module.exports = class quickdelete extends Plugin {
  async startPlugin () {
    powercord.api.settings.registerSettings('quickdelete', {
      category: this.entityID,
      label: 'Quick-Delete',
      render: Settings
    });
    const classes = {
      ...await getModule([ 'icon', 'isHeader' ]),
      ...await getModule([ 'button', 'separator', 'wrapper' ])
    };
    const MiniPopover = await getModule(m => m.default && m.default.displayName === 'MiniPopover');

    inject('quickdelete', MiniPopover, 'default', (_, res) => {
      const props = findInReactTree(res, r => r && r.message);      
      var messageid = props.message.id;
      var channelid = props.message.channel_id;
      var msgauthor = props.message.author.id;
      var flag = 0;

      if((this.settings.get('allmsg', false))){
        console.log("all reacts")
        flag = 1;
      }
      else{
        console.log("limited reacts")
        if((msgauthor == getModule(['getCurrentUser'], false).getCurrentUser().id))
          flag = 1;
      }
  
      if(flag == 1){
        res.props.children.unshift(React.createElement(
          'div', {
            className: classes.button,
            onClick: () => {require('powercord/webpack').messages.deleteMessage(channelid, messageid)
            }
          },  
          React.createElement('img', {className: `emoji ${classes.icon}`,src: '/assets/9b1b76abb59b5c8a41daea1342f2138a.svg'
        })
      ));
      }        
      return res;
    });
    MiniPopover.default.displayName = 'MiniPopover';
  }
  pluginWillUnload () {
    powercord.api.settings.unregisterSettings(this.entityID);
    uninject('quickdelete');
  }
};
