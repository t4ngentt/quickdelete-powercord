const { React } = require('powercord/webpack');
const { SwitchItem } = require('powercord/components/settings');

module.exports = class Settings extends React.Component {
  render () {
    const { getSetting, toggleSetting } = this.props;

    return (
      <div>
        <SwitchItem
          note={[
            'Choose whether quick-delete icon should appear over each message you hover over (useful only if you have channel-message delete permissions). Please note that existing delete-icons wont go away after switch. Restart the Discord Client to get them removed.'
          ]}
          value={getSetting('allmsg', false)}
          onChange={() => toggleSetting('allmsg')}
        >
          Enable quickdelete for all Messages
        </SwitchItem>

      </div>
    );
  }
};
