# Clears illegal items from player inventories

clear @a[tag=!op,m=!c,tag=!bypass] bedrock
clear @a[tag=!op,m=!c,tag=!bypass] spawn_egg
clear @a[tag=!op,m=!c,tag=!bypass] end_portal_frame
clear @a[tag=!op,m=!c,tag=!bypass] dragon_egg
clear @a[tag=!op,m=!c,tag=!bypass] farmland
clear @a[tag=!op,m=!c,tag=!bypass] monster_egg
clear @a[tag=!op,m=!c,tag=!bypass] brown_mushroom_block
clear @a[tag=!op,m=!c,tag=!bypass] red_mushroom_block
clear @a[tag=!op,m=!c,tag=!bypass] chorus_plant
clear @a[tag=!op,m=!c,tag=!bypass] turtle_egg
clear @a[tag=!op,m=!c,tag=!bypass] skull 3
clear @a[tag=!op,m=!c,tag=!bypass] mob_spawner
clear @a[tag=!op,tag=!bypass] command_block
clear @a[tag=!op,tag=!bypass] chain_command_block
clear @a[tag=!op,tag=!bypass] repeating_command_block
clear @a[tag=!op,tag=!bypass] command_block_minecart
clear @a[tag=!op,tag=!bypass] barrier
clear @a[tag=!op,tag=!bypass] structure_block
clear @a[tag=!op,tag=!bypass] structure_void
clear @a[tag=!op,tag=!bypass] jigsaw
clear @a[tag=!op,tag=!bypass] allow
clear @a[tag=!op,tag=!bypass] deny
clear @a[tag=!op,tag=!bypass] light_block
clear @a[tag=!op,tag=!bypass] border_block
clear @a[tag=!op,tag=!bypass] chemistry_table
clear @a[tag=!op,tag=!bypass] frosted_ice

kill @e[type=chalkboard]

# Kills illegal ground items
kill @e[type=item,name="Bedrock"]
kill @e[type=item,name="End Portal"]
kill @e[type=item,name="Command Block"]
kill @e[type=item,name="Chain Command Block"]
kill @e[type=item,name="Repeating Command Block"]
kill @e[type=item,name="Minecart with Command Block"]
kill @e[type=item,name="Barrier"]
kill @e[type=item,name="Structure Block"]
kill @e[type=item,name="Structure Void"]
kill @e[type=item,name="Jigsaw Block"]
kill @e[type=item,name="Allow"]
kill @e[type=item,name="Deny"]
kill @e[type=item,name="Light Block"]
kill @e[type=item,name="Border"]
kill @e[type=item,name="Compound Creator"]
kill @e[type=item,name="Frosted Ice"]
