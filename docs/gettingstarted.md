<img src="https://i.imgur.com/oi5NwOp.png" alt="Lets Go"> </img>

!> Before you import the pack please read below regarding realms, Failing to do so will lead to issues.

## Realms

> -   Realms have an issue with the new authentication system which paradox uses to grant you paradox opped access, in this instance we recommend you use a password which can be set in config.js. you then use the following command `!op mypassword` to grant you paradox opped rights.

## Required Experimental Flags

Paradox uses the following experimental flags you need to make sure these are enable in your world.

-   Scripting API
-   Molang
-   EDU

    <img src ="https://i.imgur.com/bR8AmXn.png" alt="ScriptingAPI"></img>
    <img src ="https://i.imgur.com/djOZoqH.png" alt="EDU"></img>

!> The EDU flag is needed the `!fly` command to work.

## Op Password Configuration

!> Its highly recommended that realms users make use of the password for granting paradox op due to bugs within the isOP().

File: ``scripts/data/config.js``

Before you import paradox you can set a password as seen below this is recommend for realm users if you forget to do this before importing the pack, you will have issues with the realm detecting a change, the steps to get around this are documented else where.

To configure the password open up config.js and you will see the folowing code block 

> ```js
>  /**
     * Set your password here.
     *
     * This is required for Realm users to gain Paradox-Op.
     *
     * Anyone else is welcome to use this if they like but
     * are not obligated.
     */
    encryption: {
        password: "",
    },
> ```

In this example i am going to set a password of MyPassword123$.
> ```js
>  /**
     * Set your password here.
     *
     * This is required for Realm users to gain Paradox-Op.
     *
     * Anyone else is welcome to use this if they like but
     * are not obligated.
     */
    encryption: {
        password: "MyPassword123$",
    },
> ``

The next set is to save the file then re zip the archive and rename it with the file extension of .mcpack this can then be imported into minecraft and applied to the realm.

> Now when i come to running the command on my realm i will need to execute this command in chat `!op MyPassword123$`.

## Op Bedrock Dedicated Servers

?> BDS refers to Bedrock Dedicated Servers

BDS users can take full advantage of simply executing `!op` in chat but the following settings need to be added to the server.properties file.

File: `server.properties`

> ```server.properties
> op-permission-level=2
#min=2
#max=4
> ```

You should now be able to execute the command and grant your self Paradox Op.
To grant permissions to another player simply run `!op PlayerName`.

## Ending Notes
You should now have paradox up and running the next steps would be to check out all the commands as well as looking over the Graphical User Interface for paradox to see all commands in chat run the `!help` command. To access the GUI run `!paradoxui` and close chat.  