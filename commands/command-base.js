const { prefix } = require("../config.json")

const validatePermissions = (permissions) => {
    const validPermissions = [
        "CREATE_INSTANT_INVITE",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "ADMINISTRATOR",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "ADD_REACTIONS",
        "VIEW_AUDIT_LOG",
        "PRIORITY_SPEAKER",
        "STREAM",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "SEND_TTS_MESSAGES",
        "MANAGE_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "MENTION_EVERYONE",
        "USE_EXTERNAL_EMOJIS",
        "VIEW_GUILD_INSIGHTS",
        "CONNECT",
        "SPEAK",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
        "MOVE_MEMBERS",
        "USE_VAD",
        "CHANGE_NICKNAME",
        "MANAGE_NICKNAMES",
        "MANAGE_ROLES",
        "MANAGE_WEBHOOKS",
        "MANAGE_EMOJIS_AND_STICKERS",
        "USE_APPLICATION_COMMANDS",
        "REQUEST_TO_SPEAK",
        "MANAGE_THREADS",
        "USE_PUBLIC_THREADS",
        "USE_PRIVATE_THREADS",
        "USE_EXTERNAL_STICKERS"
    ]

    for(const permission of permissions) {
        if(!validPermissions.includes(permission)) {
            throw new Error(`Unknown permission node "${permission}"`)
        }
    }
}

module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = "",
        permissionError = "You do not have permission to run this command",
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        callback
    } = commandOptions

    // Ensure the command and aliases are in an array
    if(typeof commands === 'string') {
        commands = [commands]
    }

    console.log(`Registering commands "${commands[0]}"`)

    // Ensure the permissions are valid and in an array
    if(permissions.length) {
        if(typeof permissions === "string") {
            permissions = [permissions]
        }

        validatePermissions(permissions)
    }

    // Listen for commands
    client.on('message', message => {
        const { member, content, guild } = message

        for(const alias of commands) {
            if(content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {
                // A command has been issued
                console.log('I see a command')
            
                // Ensure the user has the req'd permissions
                for(const permission of permissions){
                    if(!member.hasPermission(permission)) {
                        message.reply(permissionError)
                        return
                    }
                }

                // Ensure the user has the req'd roles
                for(const requiredRole of requiredRoles){
                    const role = guild.roles.cache.find(role =>
                        role.name === requiredRole)
                
                    if(!role || !member.roles.cache.has(role.id)) {
                        message.reply(`You must have the "${requiredRole}" role to use this command`)
                        return
                    }
                }   

                // Split on any number of arguments
                const arguments = content.split(/[ ]+/)

                // remove the commmand which is first index
                arguments.shift()
            
                // Ensure there is the correct number of arguments
                if(arguments.length < minArgs || (maxArgs !== null && arguments.length > maxArgs)) {
                    message.reply(`Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`)
                    return
                }

                // handle the custom command code
                callback(message, arguments, arguments.join(' '))
                return
            }
        }
    })
}