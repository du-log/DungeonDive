# Routes
- /adventurer
- /user
- /dungeon
- /battle

## /adventurer
#### /roster
Accesses the database based on a specified user ID, then returns a JSON based on a dictionary that returns the full list of adventurers associated with the user.
#### /recruit
Accesses the database based on a specified user ID. Attempts to insert a new adventurer depending on if the associated user has a specified amount of gold, and if successful updates the new gold amount of user and adds new adventurer to the roster.
#### /retire/{adv_id}
Using a passed-in adventurer ID, attempts to remove specified adventurer from the database. First checks if adventurer is associated with the user, then determines a refunded gold amount based on the adventurer's level * 100. If all successful, adventurer is deleted from the database and gold is refunded by updating the 'gold' amount of the user.
#### /heal
Takes in a content request of a list of adventurer IDs. Loops through the list and sets the current HP of each "injured" adventurer back to full HP. Finally, removes a specific amount of gold from the player's total gold.

## /user
#### /info
Accesses the database based on the user ID and returns a JSON consisting of the user's username and gold amount.
#### /add-gold
Temporary endpoint that updates the user's gold amount by +100, will be removed at a later date.

## /dungeon
#### /tick
Takes in a Content Request of a list of party IDs. Every tick does a randomized roll between 1 and 100, and specified events are initiated based on the integer rolled. Current events are LOOT, HEAL, and COMBAT.
- LOOT provides a random amount of gold and updates the user's gold amount based on the random integer.
- COMBAT deletes a random amount of HP from each adventurer in the party. Utilizes a helper function dungeon_combat() to damage each party member based on a random amount, keep count of how many members are still "alive" and provides a value that determines if the run will end.
- HEAL does a universal heal on all party members, healing each party member by a respective amount.
- REVIVE is a possible event. Currently, HEAL will heal all members regardless of if they were knocked out (0 hp) or not. Could be considered later on in development.

## /battle
#### /start
Initializes a new battle. We create the squad based on the number of adventurers (up to 4) where their in_combat_party boolean value is true/1. For that squad, we place each member into a combatants table with their HP values, their ID, their type, and and initial readiness that's pre-randomized.  
The same will be done for any enemies, but we choose a randomized amount between 1 and 3, then for that amount, we pick a random enemy from the enemies table until we have all of our enemies. After that, we'll insert those specific enemies into the combatants table.  
We'll return with a status that the battle has started and the enemy count.

#### /combatants
This returns all of the combatants found in the table. This is used for updating the values to keep the frontend data up-to-date.

#### /turn-tick
This is for incrementing the readiness of each combatant found in the table. While any units have a readiness below 100, we increment their readiness value by the current amount plus 10% of their speed value. If we have any units with a readiness >= 100, then we sort by descending order and choose the unit with the highest readiness value as that active unit, then return that unit's id and type, and if there is a turn ready.

#### /attack-enemy
This will be for the basic attack. We take in the active unit's id determined from turn-tick, then based on a chosen target (or for monsters, it will be the first hero in the party), we use their id to "damage" the target. For now, damage is calculated solely on the attacker's str stat. Afterwards, we update the target's current hp in the combatant's table with the new hp value calculated, and set a boolean on if the target is dead or not if their new hp is <= 0.

#### /clear
This will clear the combatants table to an empty slate. Mainly used if you decide to flee the battle, but currently also used in case /start does not clear the table. If player does not flee the battle, this endpoint is called if all enemies or adventurers are dead.