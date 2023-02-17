const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

// Array of roles to check
const rolesToCheck = [
  { id: 'ROLE_ID', name: 'DISCORD_PARTNER' },
  { id: 'ROLE_ID', name: 'EARLY_SUPPORTER' },
  { id: 'ROLE_ID', name: 'EARLY_VERIFIED_BOT_DEVELOPER' },
  { id: 'ROLE_ID', name: 'DISCORD_EMPLOYEE' },
  { id: 'ROLE_ID', name: 'DISCORD_CERTIFIED_MODERATOR' },
  { id: 'ROLE_ID', name: 'BUGHUNTER_LEVEL_1' },
  { id: 'ROLE_ID', name: 'BUGHUNTER_LEVEL_2' },
  { id: 'ROLE_ID', name: 'VERIFIED_BOT' },
  { id: 'ROLE_ID', name: 'VERIFIED_DEVELOPER' }
];

// Function to check a member's badges and assign the appropriate roles
async function checkBadges(member) {
  // Wait for the full GuildMember object to be fetched, including flags
  member = await member.fetch();

  // Check the member's badges against the rolesToCheck array
  const matchingRoles = rolesToCheck.filter(role => member.user.flags.toArray().includes(role.name));

  // Get the list of roles already assigned to the member
  const currentRoles = member.roles.cache.map(role => role.id);

  // Add the matching roles that are not already assigned
  const rolesToAdd = matchingRoles.map(role => role.id).filter(roleId => !currentRoles.includes(roleId));
  if (rolesToAdd.length > 0) {
    await member.roles.add(rolesToAdd);
  }

  // Remove the roles that are no longer applicable
  const rolesToRemove = currentRoles.filter(roleId => !matchingRoles.map(role => role.id).includes(roleId));
  if (rolesToRemove.length > 0) {
    await member.roles.remove(rolesToRemove);
  }
}

// Event listener for the guild member add event
client.on('guildMemberAdd', member => {
  checkBadges(member);
});

// Set an interval to check badges every 30 minutes
setInterval(() => {
  client.guilds.cache.forEach(guild => {
    guild.members.fetch().then(members => {
      members.forEach(member => {
        checkBadges(member);
      });
    });
  });
}, 30 * 60 * 1000);

// Login to the bot
client.login(process.env.TOKEN);
